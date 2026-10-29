import { useState } from "react";
import { useSessions } from "./hooks/useSessions";
import { useCurrentTab } from "./hooks/useCurrentTab";
import { SaveButton } from "./SaveButton";
import { SessionList } from "./SessionList";
import { ImportExportBar } from "./ImportExportBar";
import { ImportPreview } from "./ImportPreview";
import { ConfirmDialog, useConfirm } from "./ConfirmDialog";
import type { Session } from "../types/session";

export function App() {
  const { tab, domain } = useCurrentTab();
  const { sessions, grouped, loading, error, refresh } = useSessions();
  const { isOpen, message, requestConfirm, confirm, cancel } = useConfirm();
  const [importPreview, setImportPreview] = useState<Session[] | null>(null);

  const tabId = tab?.id ?? -1;
  const isValidTab = tabId !== -1 && domain.length > 0;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Session Switcher</h1>
      </header>

      {!isValidTab ? (
        <div className="empty-state">
          Navigate to a website to save or switch sessions.
        </div>
      ) : (
        <>
          <SaveButton tabId={tabId} domain={domain} onSaved={refresh} />

          <ImportExportBar
            sessions={sessions}
            onImportReady={(incoming) => setImportPreview(incoming)}
          />

          <div className="divider" />

          {loading ? (
            <div className="loading">Loading sessions…</div>
          ) : error ? (
            <div className="error-text">{error}</div>
          ) : (
            <SessionList
              grouped={grouped}
              tabId={tabId}
              onUpdate={refresh}
              onRequestConfirm={requestConfirm}
            />
          )}
        </>
      )}

      {isOpen && (
        <ConfirmDialog
          message={message}
          onConfirm={confirm}
          onCancel={cancel}
        />
      )}

      {importPreview && (
        <ImportPreview
          sessions={importPreview}
          onClose={() => setImportPreview(null)}
          onImported={refresh}
        />
      )}

      <footer className="app-footer">
        <span className="warning-text">
          ⚠ Sessions contain sensitive auth data
        </span>
      </footer>
    </div>
  );
}
