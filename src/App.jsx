import { useState, useEffect } from "react";
import { io } from "socket.io-client";

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
const BACKEND_URL = "https://temp-backend-production-4599.up.railway.app";
const socket = io(BACKEND_URL);

function App() {
  // 🌡️ Core dashboard states
  const [currentTemp, setCurrentTemp] = useState(0);
  const [prediction, setPrediction] = useState(0);
  const [battery, setBattery] = useState(0);
  const [online, setOnline] = useState(false);
  const [trend, setTrend] = useState("stable");

  // ⏱️ Last update tracking (FIXED)
  const [lastUpdateTs, setLastUpdateTs] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(0);

  // 📊 Chart data
  const [data, setData] = useState([]);

  // 🔔 Alert states
  const [alertActive, setAlertActive] = useState(false);
  const [alertAcknowledged, setAlertAcknowledged] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useTemperatureAlert(alertActive);

  // 🧠 Trend calculation
  const calculateTrend = (prev, current) => {
    if (current - prev > 0.2) return "rising";
    if (prev - current > 0.2) return "falling";
    return "stable";
  };

  // 🔹 INITIAL DASHBOARD LOAD (REST)
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/dashboard`)
      .then((res) => res.json())
      .then((d) => {
        setCurrentTemp(d.temperature);
        setPrediction(d.tempprediction);
        setBattery(d.battery);
        setOnline(d.online);
        setTrend("stable");

        // ✅ reset timestamp
        setLastUpdateTs(Date.now());

        setData([
          {
            time: Date.now(),
            temp: d.temperature,
          },
        ]);
      })
      .catch((err) => console.error("Dashboard fetch error:", err));
  }, []);

  // 🔹 LIVE SOCKET UPDATES
  useEffect(() => {
    socket.on("temperature-update", (d) => {
      setCurrentTemp((prevTemp) => {
        const newTrend = calculateTrend(prevTemp, d.temperature);
        setTrend(newTrend);
        return d.temperature;
      });

      setPrediction(d.tempprediction);
      setBattery(d.battery);
      setOnline(d.online);

      // ✅ reset timestamp on every update
      setLastUpdateTs(Date.now());

      setData((prev) => [
        ...prev.slice(-10),
        {
          time: Date.now(),
          temp: d.temperature,
        },
      ]);
    });

    return () => socket.off("temperature-update");
  }, []);

  // ⏱️ LAST UPDATE TIMER (MAIN FIX)
  useEffect(() => {
    if (!lastUpdateTs) return;

    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - lastUpdateTs) / 1000);
      setSecondsAgo(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdateTs]);

  // 🔔 ALERT LOGIC
  useEffect(() => {
    if (currentTemp > ALERT_THRESHOLD && !alertAcknowledged && soundEnabled) {
      setAlertActive(true);
    }

    if (currentTemp <= ALERT_THRESHOLD) {
      setAlertActive(false);
      setAlertAcknowledged(false);
    }
  }, [currentTemp, alertAcknowledged, soundEnabled]);

  const handleStopAlarm = () => {
    setAlertActive(false);
    setAlertAcknowledged(true);
  };

  return (
    <div className="bg-[#0B0F14] min-h-screen text-[#E6EDF3] p-3 space-y-4">
      <HeaderBar
        deviceName="TempGuard-01"
        status={online ? "online" : "offline"}
        battery={battery}
      />

      {/* 🔊 Sound permission modal */}
      {!soundEnabled && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#161B22] p-6 rounded-lg max-w-sm mx-4 text-center space-y-5 border border-[#30363D]">
            <h3 className="text-xl font-semibold">Enable Alert Sound?</h3>
            <p className="text-sm text-[#8B949E]">
              This app can play an alarm when temperature exceeds{" "}
              {ALERT_THRESHOLD}°C.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  enableAlarmSound()
                    .then(() => setSoundEnabled(true))
                    .catch(() => setSoundEnabled(false));
                }}
                className="px-6 py-2.5 bg-[#238636] rounded-lg text-white"
              >
                Allow Sound
              </button>
              <button
                onClick={() => setSoundEnabled(false)}
                className="px-6 py-2.5 bg-[#30363D] rounded-lg"
              >
                No Thanks
              </button>
            </div>
          </div>
        </div>
      )}

      <MetricRow>
        <CurrTempCard temperature={currentTemp} trend={trend} />
        <PredictCard predictedTemp={prediction} minutes={15} />
      </MetricRow>

      <LiveTempChart data={data} />

      <FooterStatus
        online={online}
        battery={battery}
        lastUpdate={`${secondsAgo}s ago`}
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
