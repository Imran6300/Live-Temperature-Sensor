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
const BACKEND_URL = "https://temp-backend-production-a0ec.up.railway.app";

/* 🔥 SOCKET.IO — RAILWAY SAFE */
const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  secure: true,
});

function App() {
  const [currentTemp, setCurrentTemp] = useState(0);
  const [prediction, setPrediction] = useState(0); // still from REST
  const [battery, setBattery] = useState(0);
  const [online, setOnline] = useState(false);
  const [trend, setTrend] = useState("stable");

  const [lastUpdateTs, setLastUpdateTs] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [data, setData] = useState([]);

  const [alertActive, setAlertActive] = useState(false);
  const [alertAcknowledged, setAlertAcknowledged] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useTemperatureAlert(alertActive);

  const calculateTrend = (prev, current) => {
    if (current - prev > 0.2) return "rising";
    if (prev - current > 0.2) return "falling";
    return "stable";
  };

  /* 🟢 INITIAL LOAD (REST API) */
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/dashboard`)
      .then((res) => res.json())
      .then((d) => {
        setCurrentTemp(d.temperature || 0);
        setPrediction(d.tempprediction || 0);
        setBattery(d.battery || 0);
        setOnline(d.temperature !== 0);
        setLastUpdateTs(Date.now());

        setData([{ time: Date.now(), temp: d.temperature || 0 }]);
      })
      .catch(console.error);
  }, []);

  /* 🔥 LIVE SOCKET UPDATES (MQTT → SOCKET.IO) */
  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    socket.on("sensor:update", (d) => {
      console.log("🔥 LIVE MQTT DATA:", d);

      setCurrentTemp((prev) => {
        setTrend(calculateTrend(prev, d.temperature));
        return d.temperature;
      });

      setBattery(d.battery ?? battery);
      setOnline(true);
      setLastUpdateTs(Date.now());

      setData((prev) => [
        ...prev.slice(-10),
        { time: Date.now(), temp: d.temperature },
      ]);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
      setOnline(false);
    });

    return () => {
      socket.off("sensor:update");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [battery]);

  /* ⏱ LAST UPDATE TIMER */
  useEffect(() => {
    if (!lastUpdateTs) return;

    const i = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdateTs) / 1000));
    }, 1000);

    return () => clearInterval(i);
  }, [lastUpdateTs]);

  /* 🚨 ALERT LOGIC */
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

  /* 📥 DOWNLOAD REPORT */
  const handleDownloadReport = async () => {
    const res = await fetch(`${BACKEND_URL}/api/dashboard/download-report`);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `temperature-report-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0B0F14] min-h-screen text-[#E6EDF3] p-3 space-y-4">
      <HeaderBar
        deviceName="TempGuard-01"
        status={online ? "online" : "offline"}
        battery={battery}
        onDownload={handleDownloadReport}
      />

      {!soundEnabled && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#161B22] p-6 rounded-lg max-w-sm text-center space-y-5 border border-[#30363D]">
            <h3 className="text-xl font-semibold">Enable Alert Sound?</h3>
            <p className="text-sm text-[#8B949E]">
              Alarm plays when temperature exceeds {ALERT_THRESHOLD}°C
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() =>
                  enableAlarmSound()
                    .then(() => setSoundEnabled(true))
                    .catch(() => setSoundEnabled(false))
                }
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
        <PredictCard predictedTemp={prediction} minutes={10} />
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
