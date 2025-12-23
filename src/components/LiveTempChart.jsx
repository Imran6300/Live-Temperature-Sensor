import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function LiveTempChart({ data = [] }) {
  // Color logic based on latest temperature (>38°C critical)
  const getColor = (temp) => {
    if (temp < 37.5) return "#22C55E"; // Normal
    if (temp < 38) return "#F59E0B"; // Warning
    return "#EF4444"; // Critical
  };

  const latestTemp = data.length > 0 ? data[data.length - 1].temp : 0;
  const strokeColor = getColor(latestTemp);

  // ⏰ X-Axis: 12-hour time (H:M)
  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours() % 12 || 12; // ✅ 12-hour conversion
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
  };

  // ⏰ Tooltip: 12-hour time (H:M:S)
  const formatTooltipLabel = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours() % 12 || 12; // ✅ 12-hour conversion
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="bg-[#121826] border border-[#273043] rounded-2xl p-6">
      {/* Header */}
      <div className="mb-4">
        <p className="text-sm text-[#9AA4B2]">Live Temperature</p>
        <p className="text-xs text-[#9AA4B2] mt-1">Real-time sensor readings</p>
      </div>

      {/* Chart */}
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid stroke="#273043" strokeDasharray="4 4" />

            <XAxis
              dataKey="time"
              tick={{ fill: "#9AA4B2", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatXAxis}
              interval="preserveStartEnd"
            />

            <YAxis
              tick={{ fill: "#9AA4B2", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={["dataMin - 0.5", "dataMax + 0.5"]}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0B0F14",
                border: "1px solid #273043",
                borderRadius: "8px",
                color: "#E6EDF3",
              }}
              labelStyle={{ color: "#9AA4B2" }}
              labelFormatter={formatTooltipLabel}
              formatter={(value) => [`${value}°C`, "Temperature"]}
            />

            <Line
              type="monotone"
              dataKey="temp"
              stroke={strokeColor}
              strokeWidth={3}
              dot={{ fill: strokeColor, r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
