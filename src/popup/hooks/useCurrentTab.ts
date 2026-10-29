import { useState, useEffect } from "react";

export function useCurrentTab() {
  const [tab, setTab] = useState<chrome.tabs.Tab | null>(null);
  const [domain, setDomain] = useState("");

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0] ?? null;
      setTab(activeTab);
      if (activeTab?.url) {
        try {
          setDomain(new URL(activeTab.url).hostname);
        } catch {
          setDomain("");
        }
      }
    });
  }, []);

  return { tab, domain };
}
