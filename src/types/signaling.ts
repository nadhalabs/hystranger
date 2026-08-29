export type CallPhase = "idle" | "connecting-signal" | "searching" | "connecting-peer" | "connected" | "peer-left" | "error";

export type ChatItem = {
  id: string;
  author: "you" | "stranger";
  text: string;
  sentAt: number;
};

export type ServerMessage =
  | { type: "ready" | "searching" | "left" | "session_replaced" }
  | { type: "matched"; role: "initiator" | "responder" }
  | { type: "signal"; signalType: "offer" | "answer" | "ice"; payload: RTCSessionDescriptionInit | RTCIceCandidateInit }
  | { type: "chat"; text: string; sentAt: number }
  | { type: "peer_left"; reason: string }
  | { type: "report_received" | "blocked" }
  | { type: "cooldown"; seconds: number }
  | { type: "error"; code: string; message: string }
  | { type: "pong"; time: number };

export type ReportReason = "sexual_content" | "harassment" | "violence" | "underage" | "spam" | "other";
