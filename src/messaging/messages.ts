export type MessageType =
  | "CAPTURE_SESSION"
  | "RESTORE_SESSION"
  | "DELETE_SESSION"
  | "UPDATE_LABEL"
  | "RECAPTURE_SESSION"
  | "GET_SESSIONS";

export interface ExtensionMessage {
  type: MessageType;
  payload?: unknown;
}

export interface CapturePayload {
  label: string;
  tabId: number;
}

export interface RestorePayload {
  sessionId: string;
  tabId: number;
}

export interface DeletePayload {
  sessionId: string;
}

export interface UpdateLabelPayload {
  sessionId: string;
  newLabel: string;
}

export interface RecapturePayload {
  sessionId: string;
  tabId: number;
}

export interface ExtensionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
