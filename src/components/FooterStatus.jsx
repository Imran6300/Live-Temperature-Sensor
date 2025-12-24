export default function FooterStatus({
  online = true,
  battery = 80,
  lastUpdate = "3s ago",
  mode = "Live",
}) {
  const statusColor = online ? "#22C55E" : "#EF4444";
  const batteryColor =
    battery > 40 ? "#22C55E" : battery > 20 ? "#F59E0B" : "#EF4444";

  return (
    <div className="bg-[#0B0F14] border border-[#273043] rounded-xl px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-sm">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: statusColor }}
        />
        <span className="text-[#E6EDF3]">
          Device {online ? "Online" : "Offline"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[#9AA4B2]">Battery</span>
        <span style={{ color: batteryColor }}>{battery}%</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[#9AA4B2]">Last update</span>
        <span className="text-[#E6EDF3]">{lastUpdate}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[#9AA4B2]">Mode</span>
        <span className="text-[#E6EDF3] font-medium">{mode}</span>
      </div>
    </div>
  );
}
