import { useState } from "react";

interface Props {
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

export function ConfirmDialog({ onConfirm, onCancel, message }: Props) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to manage confirm dialog state.
 */
export function useConfirm() {
  const [pending, setPending] = useState<(() => void) | null>(null);
  const [message, setMessage] = useState("");

  function requestConfirm(msg: string, action: () => void) {
    setMessage(msg);
    setPending(() => action);
  }

  function confirm() {
    pending?.();
    setPending(null);
    setMessage("");
  }

  function cancel() {
    setPending(null);
    setMessage("");
  }

  return {
    isOpen: pending !== null,
    message,
    requestConfirm,
    confirm,
    cancel,
  };
}
