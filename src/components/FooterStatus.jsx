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

  const tile = "rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3";

  return (
    <div className="glass rounded-2xl p-2.5">
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <div className={tile}>
          <p className="text-xs text-[#9AA4B2]">Device</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${online ? "ping" : ""}`}
              style={{ backgroundColor: statusColor }}
            />
            <span className="text-sm font-semibold text-[#E6EDF3]">
              {online ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <div className={tile}>
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#9AA4B2]">Battery</p>
            <span className="num text-sm font-semibold" style={{ color: batteryColor }}>
              {battery}%
            </span>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
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
        </div>

        <div className={tile}>
          <p className="text-xs text-[#9AA4B2]">Last update</p>
          <p className="num mt-1.5 text-sm font-semibold text-[#E6EDF3]">{lastUpdate}</p>
        </div>

        <div className={tile}>
          <p className="text-xs text-[#9AA4B2]">Mode</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-sm font-semibold text-[#E6EDF3]">{mode}</span>
            <span className="blink rounded-full bg-[#34D399]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#34D399]">
              ON AIR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
