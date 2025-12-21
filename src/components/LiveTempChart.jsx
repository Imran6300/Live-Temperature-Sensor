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
  // Color logic based on latest temperature
  const getColor = (temp) => {
    if (temp < 35) return "#22C55E";
    if (temp < 40) return "#F59E0B";
    return "#EF4444";
  };

  const latestTemp = data.length > 0 ? data[data.length - 1].temp : 0;

  const strokeColor = getColor(latestTemp);

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
          <LineChart data={data}>
            <CartesianGrid stroke="#273043" strokeDasharray="4 4" />

            <XAxis
              dataKey="time"
              tick={{ fill: "#9AA4B2", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{ fill: "#9AA4B2", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={["dataMin - 1", "dataMax + 1"]}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0B0F14",
                border: "1px solid #273043",
                borderRadius: "8px",
                color: "#E6EDF3",
              }}
              labelStyle={{ color: "#9AA4B2" }}
            />

            <Line
              type="monotone"
              dataKey="temp"
              stroke={strokeColor}
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
