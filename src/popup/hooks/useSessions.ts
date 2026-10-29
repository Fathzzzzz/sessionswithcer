import { useState, useEffect, useCallback } from "react";
import type { Session } from "../../types/session";
import { getSessions } from "../../messaging/client";

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await getSessions();
      if (resp.success && resp.data) {
        setSessions(resp.data);
      } else {
        setError(resp.error ?? "Failed to load sessions");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Group sessions by domain
  const grouped = sessions.reduce<Record<string, Session[]>>((acc, s) => {
    (acc[s.domain] ??= []).push(s);
    return acc;
  }, {});

  return { sessions, grouped, loading, error, refresh };
}
