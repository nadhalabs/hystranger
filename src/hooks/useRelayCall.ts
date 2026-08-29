"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getFallbackIceServers, serializeIceCandidate, signalingUrls } from "@/lib/webrtc";
import type { CallPhase, ChatItem, ReportReason, ServerMessage } from "@/types/signaling";

const SIGNALING_TIMEOUT = 18_000;

export function useRelayCall(localStream: MediaStream | null) {
  const [phase, setPhase] = useState<CallPhase>("idle");
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef(localStream);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const intentionalCloseRef = useRef(false);
  const phaseRef = useRef<CallPhase>(phase);
  const iceServersRef = useRef<RTCIceServer[]>(getFallbackIceServers());
  const disconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { localStreamRef.current = localStream; }, [localStream]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const clearConnectionTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  const closePeer = useCallback(() => {
    clearConnectionTimeout();
    if (disconnectTimerRef.current) clearTimeout(disconnectTimerRef.current);
    disconnectTimerRef.current = null;
    pendingIceRef.current = [];
    peerRef.current?.close();
    peerRef.current = null;
    setRemoteStream(null);
  }, [clearConnectionTimeout]);

  const send = useCallback((payload: object) => {
    if (socketRef.current?.readyState !== WebSocket.OPEN) return false;
    socketRef.current.send(JSON.stringify(payload));
    return true;
  }, []);

  const failPeer = useCallback((message: string) => {
    send({ type: "client_failure", category: message.includes("too long") ? "connection_timeout" : "ice_failed" });
    closePeer();
    setError(message);
    setPhase("error");
  }, [closePeer, send]);

  const createPeer = useCallback(() => {
    closePeer();
    const peer = new RTCPeerConnection({ iceServers: iceServersRef.current });
    peerRef.current = peer;
    localStreamRef.current?.getTracks().forEach((track) => peer.addTrack(track, localStreamRef.current!));
    peer.ontrack = (event) => {
      const stream = event.streams[0];
      if (stream) {
        setRemoteStream(stream);
        return;
      }

      // Some Safari/WebKit builds emit track events without a streams entry.
      const fallbackStream = new MediaStream();
      fallbackStream.addTrack(event.track);
      setRemoteStream(fallbackStream);
    };
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        send({ type: "signal", signal_type: "ice", payload: serializeIceCandidate(event.candidate) });
      }
    };
    peer.onconnectionstatechange = () => {
      if (peer.connectionState === "connected") {
        if (disconnectTimerRef.current) clearTimeout(disconnectTimerRef.current);
        clearConnectionTimeout();
        setError(null);
        setPhase("connected");
      } else if (peer.connectionState === "disconnected") {
        if (disconnectTimerRef.current) clearTimeout(disconnectTimerRef.current);
        disconnectTimerRef.current = setTimeout(() => {
          if (peer.connectionState === "disconnected") failPeer("The peer-to-peer connection was interrupted.");
        }, 6_000);
      } else if (peer.connectionState === "failed" && phaseRef.current !== "peer-left") {
        failPeer("The peer-to-peer connection was interrupted.");
      }
    };
    timeoutRef.current = setTimeout(() => failPeer("The connection took too long. You can find someone else."), SIGNALING_TIMEOUT);
    return peer;
  }, [clearConnectionTimeout, closePeer, failPeer, send]);

  const handleSignal = useCallback(async (message: Extract<ServerMessage, { type: "signal" }>) => {
    let peer = peerRef.current;
    try {
      if (message.signalType === "offer") {
        peer ||= createPeer();
        await peer.setRemoteDescription(message.payload as RTCSessionDescriptionInit);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        send({ type: "signal", signal_type: "answer", payload: answer });
      } else if (message.signalType === "answer") {
        if (!peer) return;
        await peer.setRemoteDescription(message.payload as RTCSessionDescriptionInit);
      } else {
        const candidate = message.payload as RTCIceCandidateInit;
        if (!peer?.remoteDescription) pendingIceRef.current.push(candidate);
        else await peer.addIceCandidate(candidate);
      }
      if (peer?.remoteDescription && pendingIceRef.current.length) {
        const candidates = pendingIceRef.current.splice(0);
        await Promise.all(candidates.map((candidate) => peer!.addIceCandidate(candidate)));
      }
    } catch {
      failPeer("We couldn’t complete the secure peer connection.");
    }
  }, [createPeer, failPeer, send]);

  const handleMessage = useCallback(async (event: MessageEvent<string>) => {
    let message: ServerMessage;
    try { message = JSON.parse(event.data) as ServerMessage; } catch { return; }
    if (message.type === "ready") {
      send({ type: "join" });
    } else if (message.type === "searching") {
      setPhase("searching");
    } else if (message.type === "matched") {
      setMessages([]);
      setPhase("connecting-peer");
      setError(null);
      const peer = createPeer();
      if (message.role === "initiator") {
        try {
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          send({ type: "signal", signal_type: "offer", payload: offer });
        } catch {
          failPeer("We couldn’t begin the peer connection.");
        }
      }
    } else if (message.type === "signal") {
      await handleSignal(message);
    } else if (message.type === "chat") {
      setMessages((current) => [...current, { id: crypto.randomUUID(), author: "stranger", text: message.text, sentAt: message.sentAt * 1000 }]);
    } else if (message.type === "peer_left") {
      closePeer();
      setPhase("peer-left");
    } else if (message.type === "cooldown") {
      setPhase("searching");
      window.setTimeout(() => send({ type: "join" }), Math.max(1, message.seconds) * 1000);
    } else if (message.type === "session_replaced") {
      setError("This session was opened in another tab.");
      setPhase("error");
    } else if (message.type === "report_received" || message.type === "blocked") {
      closePeer();
      setPhase("peer-left");
    } else if (message.type === "error" && message.code !== "not_matched") {
      setError(message.message);
    }
  }, [closePeer, createPeer, failPeer, handleSignal, send]);

  const start = useCallback(async () => {
    if (!localStreamRef.current) return;
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      setPhase("searching");
      send({ type: "join" });
      return;
    }
    setPhase("connecting-signal");
    setError(null);
    intentionalCloseRef.current = false;
    try {
      const urls = signalingUrls();
      let clientId = window.localStorage.getItem("nadha-relay-client-id");
      if (!clientId) {
        clientId = crypto.randomUUID();
        window.localStorage.setItem("nadha-relay-client-id", clientId);
      }
      const response = await fetch(urls.session, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ client_id: clientId }) });
      if (!response.ok) throw new Error("session");
      const data = await response.json() as { sessionToken: string };
      try {
        const iceResponse = await fetch(urls.ice, { headers: { Authorization: `Bearer ${data.sessionToken}` } });
        if (iceResponse.ok) {
          const iceData = await iceResponse.json() as { iceServers: RTCIceServer[] };
          if (iceData.iceServers.length) iceServersRef.current = iceData.iceServers;
        }
      } catch { /* STUN fallback remains available. */ }
      const socket = new WebSocket(`${urls.socket}?token=${encodeURIComponent(data.sessionToken)}`);
      socketRef.current = socket;
      socket.onmessage = (event) => { void handleMessage(event); };
      socket.onerror = () => setError("The signaling service is unavailable.");
      socket.onclose = () => {
        socketRef.current = null;
        if (!intentionalCloseRef.current) {
          closePeer();
          setError("Connection to hyStranger was lost. Check your network and try again.");
          setPhase("error");
        }
      };
      heartbeatRef.current = setInterval(() => send({ type: "ping" }), 15_000);
    } catch {
      socketRef.current = null;
      setError("hyStranger couldn’t reach the signaling service. Is the backend running?");
      setPhase("error");
    }
  }, [closePeer, handleMessage, send]);

  const findAnother = useCallback(() => {
    closePeer();
    setMessages([]);
    setError(null);
    setPhase("searching");
    send({ type: "leave", reason: "next" });
    window.setTimeout(() => send({ type: "join" }), 50);
  }, [closePeer, send]);

  const cancelSearch = useCallback(() => {
    send({ type: "leave", reason: "cancel" });
    setPhase("idle");
  }, [send]);

  const stop = useCallback(() => {
    intentionalCloseRef.current = true;
    send({ type: "leave", reason: "stop" });
    closePeer();
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    heartbeatRef.current = null;
    socketRef.current?.close(1000, "User stopped");
    socketRef.current = null;
    setPhase("idle");
  }, [closePeer, send]);

  const sendChat = useCallback((rawText: string) => {
    const text = rawText.trim().slice(0, 500);
    if (!text || phaseRef.current !== "connected" || !send({ type: "chat", text })) return false;
    setMessages((current) => [...current, { id: crypto.randomUUID(), author: "you", text, sentAt: Date.now() }]);
    return true;
  }, [send]);

  const report = useCallback((reason: ReportReason, endMatch = true) => {
    return send({ type: "report", reason, end_match: endMatch });
  }, [send]);

  const block = useCallback(() => {
    closePeer();
    setPhase("peer-left");
    return send({ type: "block" });
  }, [closePeer, send]);

  useEffect(() => () => {
    intentionalCloseRef.current = true;
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    socketRef.current?.close(1000, "Page closed");
    peerRef.current?.close();
  }, []);

  return { phase, remoteStream, messages, error, start, findAnother, cancelSearch, stop, sendChat, report, block };
}
