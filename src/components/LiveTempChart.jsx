import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

const pad = (n) => String(n).padStart(2, "0");

export default function LiveTempChart({ data = [] }) {
  const getColor = (temp) => {
    if (temp < 37.5) return "#34D399"; // Normal
    if (temp < 38) return "#FBBF24"; // Warning
    return "#F43F5E"; // Critical
  };

  const latestTemp = data.length > 0 ? data[data.length - 1].temp : 0;
  const strokeColor = getColor(latestTemp);

  const temps = data.map((d) => d.temp);
  const hasData = temps.length > 0;
  const lo = hasData ? Math.min(...temps) : 0;
  const hi = hasData ? Math.max(...temps) : 0;
  const avg = hasData ? temps.reduce((a, b) => a + b, 0) / temps.length : 0;

  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours() % 12 || 12;
    return `${hours}:${pad(date.getMinutes())}`;
  };

  const formatTooltipLabel = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours() % 12 || 12;
    return `${hours}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const renderDot = (props) => {
    const { cx, cy, index } = props;
    if (cx == null || cy == null) return null;

    if (index !== data.length - 1) {
      return (
        <circle
          key={`dot-${index}`}
          cx={cx}
          cy={cy}
          r={3}
          fill="#0B0F14"
          stroke={strokeColor}
          strokeWidth={2}
        />
      );
    }

    return (
      <g key={`dot-${index}`}>
        <circle className="live-dot-ring" cx={cx} cy={cy} r={6} fill={strokeColor} />
        <circle cx={cx} cy={cy} r={5.5} fill="#fff" stroke={strokeColor} strokeWidth={3} />
      </g>
    );
  };

  const stats = [
    { label: "Low", value: lo },
    { label: "Average", value: avg },
    { label: "High", value: hi },
  ];

  return (
    <div className="glass lift rounded-3xl p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-[#9AA4B2]">Live temperature</p>
            <span className="flex items-center gap-1.5 rounded-full bg-[#34D399]/10 px-2 py-0.5 text-[10px] font-semibold text-[#34D399]">
              <span className="blink h-1.5 w-1.5 rounded-full bg-[#34D399]" />
              Streaming
            </span>
          </div>
          <p className="text-xs text-[#9AA4B2]/80 mt-1">Real-time sensor readings</p>
        </div>

        <div className="flex gap-5">
          {stats.map((s) => (
            <div key={s.label} className="text-right">
              <p className="text-[11px] text-[#9AA4B2]">{s.label}</p>
              <p className="num text-base font-bold text-[#E6EDF3]">
                {hasData ? `${s.value.toFixed(1)}°` : "--"}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[260px] sm:h-[300px] -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 10, right: 14, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="liveFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity={0.4} />
                <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="3 6"
              vertical={false}
            />

            <XAxis
              dataKey="time"
              tick={{ fill: "#9AA4B2", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatXAxis}
              interval="preserveStartEnd"
              minTickGap={28}
            />

            <YAxis
              tick={{ fill: "#9AA4B2", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={38}
              domain={["dataMin - 0.5", "dataMax + 0.5"]}
              tickFormatter={(v) => v.toFixed(1)}
            />

            <ReferenceLine
              y={38}
              stroke="#F43F5E"
              strokeDasharray="5 5"
              strokeOpacity={0.7}
              ifOverflow="hidden"
              label={{
                value: "Limit 38°",
                position: "insideTopRight",
                fill: "#FB7185",
                fontSize: 11,
              }}
            />

            <Tooltip
              cursor={{ stroke: "rgba(255,255,255,0.18)", strokeDasharray: "4 4" }}
              contentStyle={{
                backgroundColor: "rgba(8,11,18,0.92)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#E6EDF3",
                backdropFilter: "blur(8px)",
              }}
              labelStyle={{ color: "#9AA4B2" }}
              labelFormatter={formatTooltipLabel}
              formatter={(value) => [`${value}°C`, "Temperature"]}
            />

            <Area
              type="monotone"
              dataKey="temp"
              stroke="none"
              fill="url(#liveFill)"
              isAnimationActive
              animationDuration={700}
            />

            <Line
              type="monotone"
              dataKey="temp"
              stroke={strokeColor}
              strokeWidth={3}
              style={{ filter: `drop-shadow(0 0 7px ${strokeColor})` }}
              dot={renderDot}
              activeDot={{ r: 6, fill: "#fff", stroke: strokeColor, strokeWidth: 3 }}
              isAnimationActive
              animationDuration={700}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
