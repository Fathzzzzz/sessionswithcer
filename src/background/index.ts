import type {
  ExtensionMessage,
  ExtensionResponse,
  CapturePayload,
  RestorePayload,
  DeletePayload,
  UpdateLabelPayload,
  RecapturePayload,
  ImportSessionsPayload,
} from "../messaging/messages";
import {
  captureSession,
  restoreSession,
  recaptureSession,
} from "../services/session.service";
import {
  deleteSession,
  updateSession,
  getAllSessions,
  bulkImportSessions,
} from "../storage/session.storage";

chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: ExtensionResponse) => void,
  ) => {
    (async () => {
      try {
        switch (message.type) {
          case "CAPTURE_SESSION": {
            const { label, tabId } = message.payload as CapturePayload;
            const session = await captureSession(label, tabId);
            sendResponse({ success: true, data: session });
            break;
          }
          case "RESTORE_SESSION": {
            const { sessionId, tabId } = message.payload as RestorePayload;
            await restoreSession(sessionId, tabId);
            sendResponse({ success: true });
            break;
          }
          case "DELETE_SESSION": {
            const { sessionId } = message.payload as DeletePayload;
            await deleteSession(sessionId);
            sendResponse({ success: true });
            break;
          }
          case "UPDATE_LABEL": {
            const { sessionId, newLabel } =
              message.payload as UpdateLabelPayload;
            await updateSession(sessionId, { label: newLabel });
            sendResponse({ success: true });
            break;
          }
          case "RECAPTURE_SESSION": {
            const { sessionId, tabId } = message.payload as RecapturePayload;
            const session = await recaptureSession(sessionId, tabId);
            sendResponse({ success: true, data: session });
            break;
          }
          case "GET_SESSIONS": {
            const sessions = await getAllSessions();
            sendResponse({ success: true, data: sessions });
            break;
          }
          case "IMPORT_SESSIONS": {
            const { sessions } = message.payload as ImportSessionsPayload;
            const result = await bulkImportSessions(sessions);
            sendResponse({ success: true, data: result });
            break;
          }
          default:
            sendResponse({
              success: false,
              error: "Unknown message type",
            });
        }
      } catch (err) {
        sendResponse({
          success: false,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    })();

    // Return true to indicate async sendResponse
    return true;
  },
);
