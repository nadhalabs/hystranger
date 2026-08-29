export type MediaErrorKind =
  | "unsupported"
  | "insecure"
  | "denied"
  | "camera-missing"
  | "microphone-missing"
  | "busy"
  | "unknown";

export type MediaIssue = {
  kind: MediaErrorKind;
  title: string;
  message: string;
};
