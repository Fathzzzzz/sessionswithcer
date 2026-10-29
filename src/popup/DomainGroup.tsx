import { useState } from "react";
import type { Session } from "../types/session";
import { SessionCard } from "./SessionCard";

interface Props {
  domain: string;
  sessions: Session[];
  tabId: number;
  onUpdate: () => void;
  onRequestConfirm: (message: string, action: () => void) => void;
}

export function DomainGroup({
  domain,
  sessions,
  tabId,
  onUpdate,
  onRequestConfirm,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="domain-group">
      <button
        className="domain-header"
        onClick={() => setCollapsed(!collapsed)}
      >
        <span className="domain-chevron">{collapsed ? "▸" : "▾"}</span>
        <span className="domain-name">{domain}</span>
        <span className="domain-count">
          {sessions.length} session{sessions.length !== 1 ? "s" : ""}
        </span>
      </button>

      {!collapsed && (
        <div className="domain-sessions">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              tabId={tabId}
              onUpdate={onUpdate}
              onRequestConfirm={onRequestConfirm}
            />
          ))}
        </div>
      )}
    </div>
  );
}
