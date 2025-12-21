export default function AlertModal({ open, temperature, onStop }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#121826] border border-[#EF4444] rounded-2xl p-6 w-[360px] text-center">
        {/* Icon */}
        <div className="text-5xl mb-3">🚨</div>

        {/* Title */}
        <h2 className="text-xl font-bold text-[#EF4444] mb-2">
          Temperature Alert
        </h2>

        {/* Message */}
        <p className="text-sm text-[#E6EDF3] mb-4">
          Temperature has exceeded the safe limit.
        </p>

        {/* Value */}
        <p className="text-4xl font-black text-[#EF4444] mb-5">
          {temperature.toFixed(1)}°C
        </p>

        {/* Action */}
        <button
          onClick={onStop}
          className="w-full bg-[#EF4444] hover:bg-[#dc2626] text-white py-2.5 rounded-lg font-semibold transition cursor-pointer"
        >
          Stop Alarm
        </button>
      </div>
    </div>
  );
}
