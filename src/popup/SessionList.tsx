import type { Session } from "../types/session";
import { DomainGroup } from "./DomainGroup";

interface Props {
  grouped: Record<string, Session[]>;
  tabId: number;
  onUpdate: () => void;
  onRequestConfirm: (message: string, action: () => void) => void;
}

export function SessionList({
  grouped,
  tabId,
  onUpdate,
  onRequestConfirm,
}: Props) {
  const domains = Object.keys(grouped).sort();

  if (domains.length === 0) {
    return (
      <div className="empty-state">
        No saved sessions yet. Save your first session above.
      </div>
    );
  }

  return (
    <div className="session-list">
      {domains.map((domain) => (
        <DomainGroup
          key={domain}
          domain={domain}
          sessions={grouped[domain]}
          tabId={tabId}
          onUpdate={onUpdate}
          onRequestConfirm={onRequestConfirm}
        />
      ))}
    </div>
  );
}
