import { useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import useAnimatedNumber from "../../hooks/useAnimatedNumber";

const STEPS = 5;

const getRisk = (temp) => {
  if (temp < 35) return { color: "#34D399", label: "Safe" };
  if (temp < 40) return { color: "#FBBF24", label: "Warning" };
  return { color: "#F43F5E", label: "Critical" };
};

export default function PredictCard({
  predictedTemp = 41.2,
  minutes = 10,
  currentTemp = null,
}) {
  const { color, label } = getRisk(predictedTemp);
  const shown = useAnimatedNumber(predictedTemp);

  const hasCurrent = currentTemp !== null && currentTemp > 0;
  const delta = hasCurrent ? predictedTemp - currentTemp : null;

  // Forecast cone: starts at "now" and widens as we look further ahead.
  const { data, domain } = useMemo(() => {
    const start = hasCurrent ? currentTemp : predictedTemp;
    const rows = Array.from({ length: STEPS + 1 }, (_, i) => {
      const p = i / STEPS;
      const mean = start + (predictedTemp - start) * p;
      const spread = 0.15 + (1.2 - 0.15) * p;
      return {
        t: Math.round(minutes * p),
        mean,
        range: [mean - spread, mean + spread],
      };
    });
    const lows = rows.map((r) => r.range[0]);
    const highs = rows.map((r) => r.range[1]);
    return {
      data: rows,
      domain: [Math.min(...lows) - 0.6, Math.max(...highs) + 0.6],
    };
  }, [predictedTemp, currentTemp, hasCurrent, minutes]);

  return (
    <div className="glass lift flex h-full min-h-0 flex-col gap-4 rounded-3xl p-5 sm:p-6 lg:flex-row lg:gap-6">
      {/* Left: headline numbers */}
      <div className="flex shrink-0 flex-col justify-between gap-4 lg:w-[40%] xl:w-[36%]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="whitespace-nowrap text-base font-medium text-[#9AA4B2]">
              Temperature prediction
            </p>
            <p className="mt-1 text-xs text-[#9AA4B2]/80">
              Next {minutes} minutes, statistical forecast
            </p>
          </div>

          <div
            className="flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold"
            style={{
              color,
              background: `color-mix(in srgb, ${color} 14%, transparent)`,
            }}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                label === "Critical" ? "blink" : ""
              }`}
              style={{ background: color }}
            />
            {label}
          </div>
        </div>

        <div>
          <span
            className="num text-5xl font-extrabold leading-none xl:text-6xl 2xl:text-7xl"
            style={{ color, transition: "color 0.8s" }}
          >
            {shown.toFixed(1)}°
          </span>
          <p className="mt-2 flex flex-wrap items-baseline gap-x-2 text-sm text-[#9AA4B2]">
            <span>expected temperature</span>
            {delta !== null && (
              <span className="whitespace-nowrap">
                <span
                  className="num text-base font-bold"
                  style={{
                    color:
                      delta > 0.05 ? "#FB923C" : delta < -0.05 ? "#38BDF8" : "#9AA4B2",
                  }}
                >
                  {delta > 0 ? "+" : ""}
                  {delta.toFixed(1)}°
                </span>{" "}
                vs now
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Right: forecast cone */}
      <div className="relative h-[170px] min-w-0 flex-1 lg:h-auto lg:min-h-0">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 10, right: 16, left: 24, bottom: 0 }}
            >
              <defs>
                <linearGradient id="predBand" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={color} stopOpacity={0.08} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.38} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="t"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#9AA4B2", fontSize: 12 }}
                tickFormatter={(v) => (v === 0 ? "now" : `+${v}m`)}
                interval="preserveStartEnd"
              />
              <YAxis hide domain={domain} />

              <Area
                type="monotone"
                dataKey="range"
                stroke="none"
                fill="url(#predBand)"
                activeDot={false}
                isAnimationActive
                animationDuration={1100}
              />
              <Line
                type="monotone"
                dataKey="mean"
                stroke={color}
                strokeWidth={3}
                strokeDasharray="7 6"
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 6px ${color})` }}
                dot={false}
                activeDot={{ r: 5 }}
                isAnimationActive
                animationDuration={1100}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
