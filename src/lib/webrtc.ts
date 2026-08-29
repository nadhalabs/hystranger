export function getFallbackIceServers(): RTCIceServer[] {
  const fallback: RTCIceServer[] = [{ urls: "stun:stun.l.google.com:19302" }];
  const configured = process.env.NEXT_PUBLIC_ICE_SERVERS;
  if (!configured) return fallback;
  try {
    const parsed: unknown = JSON.parse(configured);
    return Array.isArray(parsed) ? (parsed as RTCIceServer[]) : fallback;
  } catch {
    return fallback;
  }
}

export function signalingUrls() {
  const http = (process.env.NEXT_PUBLIC_SIGNALING_URL || "http://localhost:8000").replace(/\/$/, "");
  const ws = http.replace(/^http/, "ws");
  return { session: `${http}/api/sessions`, ice: `${http}/api/ice-config`, stats: `${http}/api/stats`, socket: `${ws}/ws` };
}

/**
 * Safari versions in active use do not all expose RTCIceCandidate#toJSON.
 * Signaling only needs the candidate-init fields, so do not invoke that
 * optional browser method from the realtime event callback.
 */
export function serializeIceCandidate(candidate: RTCIceCandidate): RTCIceCandidateInit {
  return {
    candidate: candidate.candidate,
    sdpMid: candidate.sdpMid,
    sdpMLineIndex: candidate.sdpMLineIndex,
    usernameFragment: candidate.usernameFragment ?? undefined,
  };
}
