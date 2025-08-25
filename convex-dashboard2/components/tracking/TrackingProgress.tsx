"use client";

import React, { useMemo } from "react";

type TrackingEvent = {
  status?: string;
  timestamp?: string;
};

const STAGES: Array<{ key: string; label: string }> = [
  { key: "picked_up", label: "Picked up" },
  { key: "in_transit", label: "In transit" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

function normalizeStatus(raw?: string): string | null {
  if (!raw) return null;
  const s = String(raw).toLowerCase().replace(/\s+/g, "_");
  for (const st of STAGES) {
    if (s.includes(st.key)) return st.key;
  }
  return null;
}

export default function TrackingProgress({
  status,
  events,
  className,
}: {
  status?: string;
  events?: Array<TrackingEvent>;
  className?: string;
}) {
  const currentIndex = useMemo(() => {
    const n = normalizeStatus(status);
    if (n) return Math.max(0, STAGES.findIndex((st) => st.key === n));
    const latest = (events || [])
      .slice()
      .sort((a, b) => new Date(String(b.timestamp)).getTime() - new Date(String(a.timestamp)).getTime())[0];
    const ne = normalizeStatus(latest?.status);
    if (ne) return Math.max(0, STAGES.findIndex((st) => st.key === ne));
    return 0;
  }, [status, events]);

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        {STAGES.map((st, idx) => {
          const reached = idx <= currentIndex;
          return (
            <div key={st.key} className="flex items-center gap-2">
              <div
                className={
                  "h-2 w-10 rounded-full " + (reached ? "bg-blue-600" : "bg-muted")
                }
                aria-label={st.label}
              />
              {idx < STAGES.length - 1 ? (
                <div className="h-1 w-6 rounded-full bg-muted" />
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
        {STAGES.map((st) => (
          <div key={st.key} className="w-10 text-center">
            {st.label}
          </div>
        ))}
      </div>
    </div>
  );
}


