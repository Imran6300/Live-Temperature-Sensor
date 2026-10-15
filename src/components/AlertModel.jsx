export default function AlertModal({ open, temperature, onStop }) {
  if (!open) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label="Temperature alert"
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
    >
      <div className="modal-card-alert w-full max-w-[380px] rounded-3xl border border-[#F43F5E]/70 bg-[#10131C]/95 p-7 text-center">
        <div className="relative mx-auto mb-5 grid h-20 w-20 place-items-center">
          <span className="siren-ring" />
          <span className="siren-ring" style={{ animationDelay: "0.6s" }} />
          <div className="grid h-20 w-20 place-items-center rounded-full bg-[#F43F5E]/15 text-4xl">
            🚨
          </div>
        </div>

        <h2 className="font-display text-xl font-bold text-[#FB7185]">
          Temperature alert
        </h2>

        <p className="mt-1.5 text-sm text-[#9AA4B2]">
          Temperature has exceeded the safe limit.
        </p>

        <p className="num my-5 text-6xl font-extrabold text-[#F43F5E] drop-shadow-[0_0_18px_rgba(244,63,94,0.6)]">
          {temperature.toFixed(1)}°C
        </p>

        <button
          onClick={onStop}
          className="shimmer w-full cursor-pointer rounded-xl bg-gradient-to-r from-[#F43F5E] to-[#E11D48] py-3 font-semibold text-white shadow-[0_10px_30px_-10px_rgba(244,63,94,0.9)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
        >
          Stop alarm
        </button>
      </div>
    </div>
  );
}
