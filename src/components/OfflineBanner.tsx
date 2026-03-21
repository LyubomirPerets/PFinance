"use client";

import { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => {
      setOffline(false);
      setJustReconnected(true);
      setTimeout(() => setJustReconnected(false), 3000);
    };

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline && !justReconnected) return null;

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-medium shadow-xl transition-all duration-300 flex items-center gap-2 ${
        offline
          ? "bg-red-900 border border-red-500/40 text-red-200"
          : "bg-emerald-900 border border-emerald-500/40 text-emerald-200"
      }`}
    >
      <span>{offline ? "⚠️" : "✓"}</span>
      {offline
        ? "You're offline — check your connection"
        : "Back online!"}
    </div>
  );
}
