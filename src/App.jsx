import { useState, useEffect } from "react";

import HeaderBar from "./components/HeaderBar";
import CurrTempCard from "./components/MetricRow/CurrTempCard";
import PredictCard from "./components/MetricRow/PredictCard";
import MetricRow from "./components/MetricRow/MetricRow";
import LiveTempChart from "./components/LiveTempChart";
import FooterStatus from "./components/FooterStatus";
import AlertModal from "./components/AlertModel";

import useTemperatureAlert from "./hooks/alert";
import { enableAlarmSound } from "./utils/AlaramAudio";

const ALERT_THRESHOLD = 38;

function App() {
  const [currentTemp, setCurrentTemp] = useState(32.9);
  const [alertActive, setAlertActive] = useState(false);
  const [alertAcknowledged, setAlertAcknowledged] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const [data, setData] = useState([]);

  useTemperatureAlert(alertActive);

  // 🔔 Alert logic
  useEffect(() => {
    if (currentTemp > ALERT_THRESHOLD && !alertAcknowledged && soundEnabled) {
      setAlertActive(true);
    }
    if (currentTemp <= ALERT_THRESHOLD) {
      setAlertActive(false);
      setAlertAcknowledged(false);
    }
  }, [currentTemp, alertAcknowledged, soundEnabled]);

  // 🌡️ LIVE TEMPERATURE UPDATE (FIXED)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemp((prevTemp) => {
        const nextTemp = +(prevTemp + 0.4).toFixed(1);
        const finalTemp = nextTemp > 41 ? 32.5 : nextTemp;

        // ✅ Chart update uses SAME temperature
        setData((prevData) => [
          ...prevData.slice(-10),
          {
            time: Date.now(),
            temp: finalTemp,
          },
        ]);

        return finalTemp;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleStopAlarm = () => {
    setAlertActive(false);
    setAlertAcknowledged(true);
  };

  return (
    <div className="bg-[#0B0F14] min-h-screen text-[#E6EDF3] p-3 space-y-4">
      <HeaderBar deviceName="TempGuard-01" status="online" battery={80} />

      {/* Sound permission modal */}
      {!soundEnabled && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#161B22] p-6 rounded-lg max-w-sm mx-4 text-center space-y-5 border border-[#30363D]">
            <h3 className="text-xl font-semibold">Enable Alert Sound?</h3>
            <p className="text-sm text-[#8B949E] leading-relaxed">
              This app can play an audible alarm when the temperature exceeds{" "}
              {ALERT_THRESHOLD}°C.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  enableAlarmSound()
                    .then(() => setSoundEnabled(true))
                    .catch(() => setSoundEnabled(false));
                }}
                className="px-6 py-2.5 cursor-pointer bg-[#238636] rounded-lg text-white"
              >
                Allow Sound
              </button>
              <button
                onClick={() => setSoundEnabled(false)}
                className="px-6 py-2.5 cursor-pointer bg-[#30363D] rounded-lg"
              >
                No Thanks
              </button>
            </div>
          </div>
        </div>
      )}

      <MetricRow>
        <CurrTempCard temperature={currentTemp} trend="rising" />
        <PredictCard predictedTemp={41.2} minutes={15} />
      </MetricRow>

      <LiveTempChart data={data} />

      <FooterStatus
        online={true}
        battery={80}
        lastUpdate="3s ago"
        mode="Live"
      />

      <AlertModal
        open={alertActive}
        temperature={currentTemp}
        onStop={handleStopAlarm}
      />
    </div>
  );
}

export default App;
