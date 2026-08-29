"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaIssue } from "@/types/media";

function friendlyIssue(error: unknown): MediaIssue {
  const name = error instanceof DOMException ? error.name : "";

  if (name === "NotAllowedError" || name === "SecurityError") {
    return { kind: "denied", title: "Permission is blocked", message: "Allow camera and microphone access in your browser settings, then try again." };
  }
  if (name === "NotReadableError" || name === "AbortError") {
    return { kind: "busy", title: "A device is already in use", message: "Close other apps using your camera or microphone, then try once more." };
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return { kind: "camera-missing", title: "We couldn’t find your devices", message: "Connect a camera and microphone, then refresh the device list." };
  }
  return { kind: "unknown", title: "We couldn’t start your devices", message: "Check your browser permissions and device connections, then try again." };
}

export function useMediaSetup() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [cameraId, setCameraId] = useState("");
  const [microphoneId, setMicrophoneId] = useState("");
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [issue, setIssue] = useState<MediaIssue | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
  }, []);

  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = devices.filter((device) => device.kind === "videoinput");
    const audioInputs = devices.filter((device) => device.kind === "audioinput");
    setCameras(videoInputs);
    setMicrophones(audioInputs);
    setCameraId((current) => current || videoInputs[0]?.deviceId || "");
    setMicrophoneId((current) => current || audioInputs[0]?.deviceId || "");
  }, []);

  const requestMedia = useCallback(async (nextCameraId?: string, nextMicrophoneId?: string) => {
    if (!window.isSecureContext) {
      setIssue({ kind: "insecure", title: "A secure connection is required", message: "Camera and microphone access works on HTTPS or localhost. Open this page through a secure connection." });
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setIssue({ kind: "unsupported", title: "This browser can’t access media", message: "Try the latest version of Chrome, Safari, Edge, or Firefox." });
      return;
    }

    setLoading(true);
    setIssue(null);
    const previousStream = streamRef.current;

    try {
      const nextStream = await navigator.mediaDevices.getUserMedia({
        video: nextCameraId || cameraId ? { deviceId: { exact: nextCameraId || cameraId }, facingMode: "user" } : { facingMode: "user" },
        audio: nextMicrophoneId || microphoneId ? { deviceId: { exact: nextMicrophoneId || microphoneId }, echoCancellation: true, noiseSuppression: true } : { echoCancellation: true, noiseSuppression: true },
      });
      previousStream?.getTracks().forEach((track) => track.stop());
      streamRef.current = nextStream;
      setStream(nextStream);
      setCameraEnabled(true);
      setMicrophoneEnabled(true);
      await refreshDevices();
      const videoTrack = nextStream.getVideoTracks()[0];
      const audioTrack = nextStream.getAudioTracks()[0];
      setCameraId(videoTrack?.getSettings().deviceId || nextCameraId || cameraId);
      setMicrophoneId(audioTrack?.getSettings().deviceId || nextMicrophoneId || microphoneId);
    } catch (error) {
      setIssue(friendlyIssue(error));
      if (!previousStream) setStream(null);
    } finally {
      setLoading(false);
    }
  }, [cameraId, microphoneId, refreshDevices]);

  const switchCamera = useCallback(async (deviceId: string) => {
    setCameraId(deviceId);
    await requestMedia(deviceId, microphoneId);
  }, [microphoneId, requestMedia]);

  const switchMicrophone = useCallback(async (deviceId: string) => {
    setMicrophoneId(deviceId);
    await requestMedia(cameraId, deviceId);
  }, [cameraId, requestMedia]);

  const toggleCamera = useCallback(() => {
    const next = !cameraEnabled;
    streamRef.current?.getVideoTracks().forEach((track) => { track.enabled = next; });
    setCameraEnabled(next);
  }, [cameraEnabled]);

  const toggleMicrophone = useCallback(() => {
    const next = !microphoneEnabled;
    streamRef.current?.getAudioTracks().forEach((track) => { track.enabled = next; });
    setMicrophoneEnabled(next);
  }, [microphoneEnabled]);

  useEffect(() => {
    const mediaDevices = navigator.mediaDevices;
    const onDeviceChange = () => { void refreshDevices(); };
    mediaDevices?.addEventListener?.("devicechange", onDeviceChange);
    return () => {
      mediaDevices?.removeEventListener?.("devicechange", onDeviceChange);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [refreshDevices]);

  const hasCamera = Boolean(stream?.getVideoTracks().length);
  const hasMicrophone = Boolean(stream?.getAudioTracks().length);

  return {
    stream, cameras, microphones, cameraId, microphoneId, cameraEnabled, microphoneEnabled,
    loading, issue, hasCamera, hasMicrophone, isReady: hasCamera && hasMicrophone,
    requestMedia, switchCamera, switchMicrophone, toggleCamera, toggleMicrophone, stopStream,
  };
}
