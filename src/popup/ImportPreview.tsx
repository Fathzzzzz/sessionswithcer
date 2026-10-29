import { useState } from "react";
import type { Session } from "../types/session";
import { importSessions } from "../messaging/client";

interface Props {
  sessions: Session[];
  onClose: () => void;
  onImported: () => void;
}

export function ImportPreview({ sessions, onClose, onImported }: Props) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{
    imported: number;
    skipped: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Group by domain for display
  const byDomain: Record<string, Session[]> = {};
  for (const s of sessions) {
    (byDomain[s.domain] ??= []).push(s);
  }

  async function handleConfirm() {
    setBusy(true);
    setError(null);
    try {
      const resp = await importSessions(sessions);
      if (resp.success && resp.data) {
        setResult(resp.data);
        onImported();
      } else {
        setError(resp.error ?? "Import failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div
        className="import-preview-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {result ? (
          <>
            <h3 className="import-preview-title">Import Complete</h3>
            <p className="import-result-text">
              ✓ {result.imported} session{result.imported !== 1 ? "s" : ""}{" "}
              imported
              {result.skipped > 0 && (
                <>, {result.skipped} skipped (duplicate ID)</>
              )}
            </p>
            <div className="confirm-actions">
              <button className="btn btn-primary btn-sm" onClick={onClose}>
                Done
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="import-preview-title">Import Sessions</h3>
            <p className="import-preview-subtitle">
              {sessions.length} session{sessions.length !== 1 ? "s" : ""} found
              in file:
            </p>

            <div className="import-preview-list">
              {Object.entries(byDomain)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([domain, domainSessions]) => (
                  <div key={domain} className="import-preview-group">
                    <div className="import-preview-domain">{domain}</div>
                    {domainSessions.map((s) => (
                      <div key={s.id} className="import-preview-item">
                        <span className="import-preview-label">{s.label}</span>
                        <span className="cookie-count">
                          {s.cookieCount} cookies
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
            </div>

            <div className="import-preview-warning">
              ⚠ Imported sessions may be expired. A successful import does not
              guarantee the website will accept the session.
            </div>

            {error && <div className="error-text">{error}</div>}

            <div className="confirm-actions">
              <button
                className="btn btn-cancel btn-sm"
                onClick={onClose}
                disabled={busy}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleConfirm}
                disabled={busy}
              >
                {busy ? "Importing…" : "Import"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
