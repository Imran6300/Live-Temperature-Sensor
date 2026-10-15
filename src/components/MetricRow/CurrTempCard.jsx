import useAnimatedNumber from "../../hooks/useAnimatedNumber";
import { getTempStatus } from "../../utils/tempStatus";

const MIN_TEMP = 0;
const MAX_TEMP = 50;
const LIMIT = 38;

const C = 130; // svg centre
const R = 98; // arc radius
const CIRC = 2 * Math.PI * R;
const TICKS = 50;

const TREND = {
  rising: { label: "Rising", cls: "trend-up", path: "M12 19V5M5 12l7-7 7 7" },
  falling: {
    label: "Falling",
    cls: "trend-down",
    path: "M12 5v14M19 12l-7 7-7-7",
  },
  stable: { label: "Stable", cls: "trend-flat", path: "M5 12h14M12 5l7 7-7 7" },
};

export default function CurrTempCard({
  temperature = 36.8,
  trend = "stable",
  updatedAt = null,
}) {
  const { color, label: statusLabel } = getTempStatus(temperature);
  const { label: trendLabel, cls: trendCls, path } = TREND[trend] || TREND.stable;

  const value = Math.min(Math.max(temperature, MIN_TEMP), MAX_TEMP);
  const frac = (value - MIN_TEMP) / (MAX_TEMP - MIN_TEMP);
  const shown = useAnimatedNumber(temperature);

  const ease = "900ms cubic-bezier(0.22, 1, 0.36, 1)";
  const limitDeg = (LIMIT / MAX_TEMP) * 360;

  return (
    <div className="glass glass-accent lift h-full rounded-3xl p-5 sm:p-6 flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[#9AA4B2]">Current temperature</p>

        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            color,
            background: `color-mix(in srgb, ${color} 14%, transparent)`,
            transition: "color 0.8s, background 0.8s",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            className={`h-3.5 w-3.5 ${trendCls}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={path} />
          </svg>
          {trendLabel}
        </div>
      </div>

      <div className="relative mx-auto my-3 aspect-square w-full max-w-[300px]">
        <svg viewBox="0 0 260 260" className="absolute inset-0 h-full w-full">
          {/* tick ring */}
          {Array.from({ length: TICKS }).map((_, i) => {
            const lit = i <= value;
            const major = i % 5 === 0;
            return (
              <line
                key={i}
                x1={C}
                x2={C}
                y1={C - (major ? 118 : 120)}
                y2={C - 126}
                strokeWidth={major ? 2.2 : 1.4}
                strokeLinecap="round"
                transform={`rotate(${(i / TICKS) * 360} ${C} ${C})`}
                style={{
                  stroke: lit ? color : "rgba(255,255,255,0.14)",
                  opacity: lit ? 0.95 : 1,
                  transition: `stroke 0.6s ease ${i * 8}ms`,
                }}
              />
            );
          })}

          {/* track */}
          <circle
            cx={C}
            cy={C}
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="14"
          />

          {/* value arc */}
          <circle
            cx={C}
            cy={C}
            r={R}
            fill="none"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            transform={`rotate(-90 ${C} ${C})`}
            style={{
              stroke: color,
              strokeDashoffset: CIRC * (1 - frac),
              opacity: frac === 0 ? 0 : 1,
              filter: `drop-shadow(0 0 9px ${color})`,
              transition: `stroke-dashoffset ${ease}, stroke 0.8s ease, opacity 0.4s`,
            }}
          />

          {/* alert-limit notch */}
          <g transform={`rotate(${limitDeg} ${C} ${C})`}>
            <line
              x1={C}
              x2={C}
              y1={C - R - 13}
              y2={C - R + 13}
              stroke="#F43F5E"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.9"
            />
          </g>

          {/* glowing tip */}
          <g
            style={{
              transformOrigin: `${C}px ${C}px`,
              transform: `rotate(${frac * 360}deg)`,
              transition: `transform ${ease}`,
              opacity: frac === 0 ? 0 : 1,
            }}
          >
            <circle cx={C} cy={C - R} r="10" fill={color} opacity="0.25" />
            <circle cx={C} cy={C - R} r="5.5" fill="#fff" />
          </g>
        </svg>

        {/* ripple on every live reading */}
        <span key={updatedAt ?? "init"} className="ripple" style={{ "--c": color }} />

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="num text-[3.9rem] sm:text-[4.3rem] leading-none font-extrabold tracking-tight"
            style={{ color, transition: "color 0.8s" }}
          >
            {shown.toFixed(1)}
          </span>
          <span className="text-xs text-[#9AA4B2] mt-1">°C</span>
          <span
            className="mt-2 rounded-full px-3 py-0.5 text-xs font-semibold"
            style={{
              color,
              background: `color-mix(in srgb, ${color} 14%, transparent)`,
              transition: "color 0.8s, background 0.8s",
            }}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between text-xs text-[#9AA4B2]">
        <span className="num font-semibold">{MIN_TEMP}°</span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-[#F43F5E]" />
          Alert limit {LIMIT}°
        </span>
        <span className="num font-semibold">{MAX_TEMP}°</span>
      </div>

      {temperature > LIMIT && (
        <div className="modal-card mt-4 flex items-center justify-center gap-2 rounded-xl border border-[#F43F5E]/40 bg-[#F43F5E]/10 px-3 py-2 text-sm font-semibold text-[#FB7185]">
          <span className="blink h-2 w-2 rounded-full bg-[#F43F5E]" />
          Temperature alert active
        </div>
      )}
    </div>
  );
}
