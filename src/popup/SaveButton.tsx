import { useState } from "react";
import {
  captureCurrentSession,
} from "../messaging/client";

interface Props {
  tabId: number;
  domain: string;
  onSaved: () => void;
}

export function SaveButton({ tabId, domain, onSaved }: Props) {
  const [label, setLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    const trimmed = label.trim();
    if (!trimmed) return;

    setSaving(true);
    setError(null);
    try {
      const resp = await captureCurrentSession(trimmed, tabId);
      if (resp.success) {
        setLabel("");
        onSaved();
      } else {
        setError(resp.error ?? "Failed to save");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="save-section">
      <div className="save-domain">
        CURRENT : <strong>{domain.toUpperCase()}</strong>
      </div>
      <div className="save-row">
        <input
          type="text"
          className="save-input"
          placeholder='Label (e.g "Work Account")'
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
          }}
          disabled={saving}
        />
        <button
          className="btn btn-save"
          onClick={handleSave}
          disabled={saving || !label.trim()}
        >
          {saving ? "SAVING…" : "SAVE"}
        </button>
      </div>
      {error && <div className="error-text">{error}</div>}
    </div>
  );
}
