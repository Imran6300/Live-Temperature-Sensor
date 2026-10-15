export default function FooterStatus({
  online = true,
  battery = 80,
  lastUpdate = "3s ago",
  mode = "Live",
}) {
  const statusColor = online ? "#34D399" : "#F43F5E";
  const batteryColor =
    battery > 40 ? "#34D399" : battery > 20 ? "#FBBF24" : "#F43F5E";
  const level = Math.min(Math.max(battery, 0), 100);

  return (
    <div className="glass rounded-2xl px-4 py-2.5 sm:px-5">
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 md:flex md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={`h-2.5 w-2.5 rounded-full ${online ? "ping" : ""}`}
            style={{ backgroundColor: statusColor }}
          />
          <span className="text-xs text-[#9AA4B2]">Device</span>
          <span className="text-sm font-semibold text-[#E6EDF3]">
            {online ? "Online" : "Offline"}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-[#9AA4B2]">Battery</span>
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10 sm:w-28">
            <div
              className="h-full rounded-full"
              style={{
                width: `${level}%`,
                background: batteryColor,
                boxShadow: `0 0 10px ${batteryColor}`,
                transition: "width 1s cubic-bezier(0.22,1,0.36,1), background 0.6s",
              }}
            />
          </div>
          <span className="num text-sm font-semibold" style={{ color: batteryColor }}>
            {battery}%
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-[#9AA4B2]">Last update</span>
          <span className="num text-sm font-semibold text-[#E6EDF3]">{lastUpdate}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-[#9AA4B2]">Mode</span>
          <span className="text-sm font-semibold text-[#E6EDF3]">{mode}</span>
          <span className="blink rounded-full bg-[#34D399]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#34D399]">
            ON AIR
          </span>
        </div>
      </div>
    </div>
  );
}
