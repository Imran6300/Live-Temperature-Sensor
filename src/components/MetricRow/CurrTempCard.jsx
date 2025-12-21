import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

export default function CurrTempCard({ temperature = 36.8, trend = "rising" }) {
  // 🔥 LIVE COLOR LOGIC BASED ON TEMPERATURE
  const getTempStatus = (temp) => {
    if (temp < 35) return { color: "#22C55E", label: "Normal" };
    if (temp < 38) return { color: "#F59E0B", label: "Warning" };
    return { color: "#EF4444", label: "Critical" };
  };

  const { color, label: statusLabel } = getTempStatus(temperature);

  const trendConfig = {
    rising: { icon: "↑", label: "Rising" },
    stable: { icon: "→", label: "Stable" },
    falling: { icon: "↓", label: "Falling" },
  };

  const { icon, label: trendLabel } = trendConfig[trend];

  const minTemp = 0;
  const maxTemp = 50;
  const value = Math.min(Math.max(temperature, minTemp), maxTemp);

  const data = [
    {
      name: "temp",
      value,
      fill: color,
    },
  ];

  return (
    <div className="bg-[#1A2233] border border-[#273043] rounded-2xl p-6">
      {/* Title */}
      <p className="text-sm text-[#9AA4B2] mb-3 text-center">
        Current Temperature
      </p>

      {/* Gauge + Side Info */}
      <div className="flex items-center justify-between">
        {/* Min */}
        <div className="text-center">
          <p className="text-xs text-[#9AA4B2]">MIN</p>
          <p className="text-sm font-semibold text-[#9AA4B2]">{minTemp}°</p>
        </div>

        {/* 🔧 Reduced Circular Gauge */}
        <div className="relative w-[245px] h-[245px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              data={data}
            >
              <PolarAngleAxis
                type="number"
                domain={[minTemp, maxTemp]}
                tick={false}
              />

              {/* 🔧 Slightly thinner bar */}
              <RadialBar
                dataKey="value"
                background={{ fill: "#273043" }}
                cornerRadius={50}
                barSize={16}
              />
            </RadialBarChart>
          </ResponsiveContainer>

          {temperature > 38 && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-[#3B0F14] text-[#EF4444] text-sm font-semibold text-center">
              🚨 Temperature Alert Active
            </div>
          )}

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {/* 🔧 Slightly smaller value */}
            <span
              className="text-[3.8rem] leading-none font-black tracking-tight"
              style={{ color }}
            >
              {temperature.toFixed(1)}
            </span>

            <span className="text-xs text-[#9AA4B2] -mt-1">° Celsius</span>

            <span className="mt-1 text-sm font-semibold" style={{ color }}>
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Max */}
        <div className="text-center">
          <p className="text-xs text-[#9AA4B2]">MAX</p>
          <p className="text-sm font-semibold text-[#9AA4B2]">{maxTemp}°</p>
        </div>
      </div>

      {/* Trend Indicator */}
      <div
        className="mt-3 flex items-center justify-center gap-2 text-sm font-medium"
        style={{ color }}
      >
        <span className="text-lg">{icon}</span>
        <span>{trendLabel}</span>
      </div>
    </div>
  );
}
