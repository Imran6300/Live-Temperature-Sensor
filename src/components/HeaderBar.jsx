export default function HeaderBar({
  deviceName = "TempGuard-01",
  status = "online",
  battery = 82,
  onDownload,
}) {
  const isOnline = status === "online";

  return (
    <div
      className="
        relative
        flex items-center justify-between
        bg-[#121826] border border-[#273043]
        rounded-xl px-4 py-3
      "
    >
      {/* Left: Device Name */}
      <div className="text-lg font-semibold tracking-wide text-[#E6EDF3]">
        {deviceName}
      </div>

      {/* Center: Download Button (ABSOLUTE → no height impact) */}
      <button
        onClick={onDownload}
        className="
          absolute left-1/2 -translate-x-1/2
          bg-[#1F6FEB] hover:bg-[#388BFD]
          text-white px-3 py-1.5
          rounded-md text-xs font-medium
          transition cursor-pointer
        "
      >
        ⬇ Download Report
      </button>

      {/* Right: Status + Battery */}
      <div className="flex items-center gap-4 text-sm">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              isOnline ? "bg-[#22C55E]" : "bg-[#EF4444]"
            }`}
          />
          <span className="capitalize text-[#E6EDF3]">{status}</span>
        </div>

        {/* Battery */}
        <div className="flex items-center gap-2">
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
  );
}
