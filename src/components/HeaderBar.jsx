import { useEffect, useState } from "react";

export default function HeaderBar({
  deviceName = "TempGuard-01",
  status = "online",
  battery = 82,
  onDownload,
}) {
  const isOnline = status === "online";
  const [downloading, setDownloading] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const handleDownloadClick = () => {
    if (!onDownload || downloading) return;

    setDownloading(true);

    try {
      // 🔥 MUST be direct call (browser security rule)
      onDownload();
    } finally {
      // UX delay only
      setTimeout(() => setDownloading(false), 1200);
    }
  };

  const batteryColor =
    battery > 50 ? "#34D399" : battery > 20 ? "#FACC15" : "#F43F5E";
  const level = Math.min(Math.max(battery, 0), 100);

  return (
    <div className="glass rounded-2xl px-4 py-2.5 sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        {/* Device */}
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--accent) 35%, transparent), rgba(255,255,255,0.04))",
              border: "1px solid color-mix(in srgb, var(--accent) 40%, transparent)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-display truncate text-lg font-bold leading-tight text-[#E6EDF3] sm:text-xl">
              {deviceName}
            </p>
            <p className="truncate text-xs text-[#9AA4B2]">
              TMP117 sensor, streaming over MQTT
            </p>
          </div>
        </div>

        {/* Clock */}
        <div className="hidden text-center md:block">
          <p className="num text-2xl font-bold leading-none tracking-tight text-[#E6EDF3]">
            {now.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
          <p className="mt-1 text-xs text-[#9AA4B2]">
            {now.toLocaleDateString([], {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        {/* Status, battery, download */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{
              background: isOnline ? "rgba(52,211,153,0.1)" : "rgba(244,63,94,0.1)",
            }}
          >
            <span
              className={`h-2 w-2 rounded-full ${isOnline ? "ping bg-[#34D399]" : "bg-[#F43F5E]"}`}
            />
            <span
              className="text-sm font-semibold capitalize"
              style={{ color: isOnline ? "#34D399" : "#FB7185" }}
            >
              {status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <svg viewBox="0 0 28 16" className="h-4 w-7">
              <rect x="0.75" y="0.75" width="23" height="14.5" rx="3.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
              <rect x="25" y="5" width="2.5" height="6" rx="1" fill="rgba(255,255,255,0.35)" />
              <rect
                x="2.5"
                y="2.5"
                height="11"
                rx="2"
                fill={batteryColor}
                style={{
                  width: `${(level / 100) * 19.5}px`,
                  transition: "width 1s cubic-bezier(0.22,1,0.36,1), fill 0.6s",
                }}
              />
            </svg>
            <span className="num text-sm font-semibold text-[#E6EDF3]">{battery}%</span>
          </div>

          <button
            onClick={handleDownloadClick}
            disabled={!isOnline || downloading}
            className={`shimmer flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-5 py-2 text-sm font-semibold transition-all duration-300 ${
              !isOnline || downloading
                ? "cursor-not-allowed bg-white/5 text-[#8B949E]"
                : "cursor-pointer bg-gradient-to-r from-[#2563EB] to-[#38BDF8] text-white shadow-[0_8px_24px_-8px_rgba(56,189,248,0.7)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(56,189,248,0.9)] active:translate-y-0 active:scale-95"
            }`}
          >
            {downloading ? (
              <>
                <svg viewBox="0 0 24 24" className="spin h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 3a9 9 0 1 0 9 9" />
                </svg>
                Preparing report
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
                </svg>
                Download report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
