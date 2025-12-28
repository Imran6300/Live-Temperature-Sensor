import { useState } from "react";

export default function HeaderBar({
  deviceName = "TempGuard-01",
  status = "online",
  battery = 82,
  onDownload,
}) {
  const isOnline = status === "online";
  const [downloading, setDownloading] = useState(false);

  const handleDownloadClick = () => {
    if (!onDownload || !isOnline || downloading) return;

    setDownloading(true);

    try {
      // 🔥 MUST be direct call (browser security rule)
      onDownload();
    } finally {
      // UX delay only
      setTimeout(() => setDownloading(false), 1200);
    }
  };

  return (
    <div className="bg-[#121826] border border-[#273043] rounded-xl px-4 py-3">
      <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-3 sm:items-center sm:gap-y-0">
        {/* Device Name */}
        <div className="text-left sm:order-1">
          <span className="text-base sm:text-lg font-semibold text-[#E6EDF3] truncate">
            {deviceName}
          </span>
        </div>

        {/* Download Button */}
        <div className="flex justify-center sm:order-2">
          <button
            onClick={handleDownloadClick}
            disabled={!isOnline || downloading}
            className={`
              w-full sm:w-auto
              px-4 py-1.5 rounded-lg
              text-sm font-medium
              transition whitespace-nowrap
              ${
                !isOnline || downloading
                  ? "bg-[#30363D] text-[#8B949E] cursor-not-allowed"
                  : "bg-[#1F6FEB] hover:bg-[#388BFD] text-white"
              }
            `}
          >
            {downloading ? "⏳ Downloading..." : "⬇ Download Report"}
          </button>
        </div>

        {/* Status & Battery */}
        <div className="flex justify-center sm:justify-end items-center gap-4 text-sm sm:order-3">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                isOnline ? "bg-[#22C55E]" : "bg-[#EF4444]"
              }`}
            />
            <span className="capitalize text-[#E6EDF3] text-xs sm:text-sm">
              {status}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span
              className={`text-lg ${
                battery > 50
                  ? "text-[#22C55E]"
                  : battery > 20
                  ? "text-[#FACC15]"
                  : "text-[#EF4444]"
              }`}
            >
              🔋
            </span>
            <span className="text-[#E6EDF3]">{battery}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
