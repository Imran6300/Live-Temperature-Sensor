import { ResponsiveContainer, LineChart, Line, Area, YAxis } from "recharts";

export default function PredictCard({ predictedTemp = 41.2, minutes = 10 }) {
  const uncertainty = 1.2;

  const data = [
    {
      t: 0,
      lower: predictedTemp - uncertainty - 1,
      mean: predictedTemp - 1,
      upper: predictedTemp + uncertainty - 1,
    },
    {
      t: minutes,
      lower: predictedTemp - uncertainty,
      mean: predictedTemp,
      upper: predictedTemp + uncertainty,
    },
  ];

  const getRisk = (temp) => {
    if (temp < 35) return { color: "#22C55E", label: "SAFE" };
    if (temp < 40) return { color: "#F59E0B", label: "WARNING" };
    return { color: "#EF4444", label: "CRITICAL" };
  };

  const { color, label } = getRisk(predictedTemp);

  return (
    <div className="bg-[#121826] border border-[#273043] rounded-2xl p-6 flex flex-col justify-between">
      <div>
        <p className="text-sm text-[#9AA4B2]">Temperature Prediction</p>
        <p className="text-xs text-[#9AA4B2] mt-1">
          Next {minutes} minutes (statistical forecast)
        </p>
      </div>

      <div className="h-[140px] mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <YAxis hide domain={["dataMin - 2", "dataMax + 2"]} />

            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill={color}
              fillOpacity={0.22}
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="#121826"
            />

            <Line
              type="monotone"
              dataKey="mean"
              stroke={color}
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-end justify-between mt-4">
        <div>
          <span
            className="text-[3.2rem] font-black leading-none"
            style={{ color }}
          >
            {predictedTemp}°
          </span>
          <p className="text-xs text-[#9AA4B2] mt-1">expected temperature</p>
        </div>

        <div
          className="text-xs font-semibold tracking-widest"
          style={{ color }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
