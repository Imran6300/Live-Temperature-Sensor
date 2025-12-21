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
    if (temp < 37.5) return "#22C55E"; // Normal - Green
    if (temp < 38) return "#F59E0B"; // Warning - Amber
    return "#EF4444"; // Critical - Red
  };

  const latestTemp = data.length > 0 ? data[data.length - 1].temp : 0;
  const strokeColor = getColor(latestTemp);

  // Pure JS formatter: timestamp → "HH:mm"
  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Tooltip shows seconds too
  const formatTooltipLabel = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
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
