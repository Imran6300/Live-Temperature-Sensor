import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

import HeaderBar from "./components/HeaderBar";
import CurrTempCard from "./components/MetricRow/CurrTempCard";
import PredictCard from "./components/MetricRow/PredictCard";
import MetricRow from "./components/MetricRow/MetricRow";
import LiveTempChart from "./components/LiveTempChart";
import FooterStatus from "./components/FooterStatus";
import AlertModal from "./components/AlertModel";

import { Analytics } from "@vercel/analytics/react";

import useTemperatureAlert from "./hooks/alert";
import { enableAlarmSound } from "./utils/AlaramAudio";
import { getTempStatus } from "./utils/tempStatus";

const ALERT_THRESHOLD = 38;
const BACKEND_URL = "https://myiotapp.dpdns.org";

function App() {
  const [currentTemp, setCurrentTemp] = useState(0);
  const [prediction, setPrediction] = useState(0); // still from REST
  const [battery, setBattery] = useState(0);
  const [online, setOnline] = useState(false);
  const [trend, setTrend] = useState("stable");
  const socketRef = useRef(null);

  const [lastUpdateTs, setLastUpdateTs] = useState(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [data, setData] = useState([]);

  const [alertActive, setAlertActive] = useState(false);
  const [alertAcknowledged, setAlertAcknowledged] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showSoundPrompt, setShowSoundPrompt] = useState(true);

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

  useEffect(() => {
    socketRef.current = io(BACKEND_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
    });

    socketRef.current.on("connect", () => {
      console.log("🟢 Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("sensor:update", (d) => {
      console.log("🔥 LIVE MQTT DATA:", d);

      setCurrentTemp((prev) => {
        setTrend(calculateTrend(prev, d.temperature));
        return d.temperature;
      });

      setBattery(d.battery ?? 0);
      setOnline(true);
      setLastUpdateTs(Date.now());

      setData((prev) => [
        ...prev.slice(-10),
        { time: Date.now(), temp: d.temperature },
      ]);
    });

    socketRef.current.on("connect_error", (err) => {
      console.log("❌ Socket error:", err.message);
    });

    socketRef.current.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
      setOnline(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

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

  const status = getTempStatus(currentTemp);
  const accent = online ? status.color : "#64748B";
  const isCritical = online && currentTemp > ALERT_THRESHOLD;

  return (
    <div className="app-shell text-[#E6EDF3]" style={{ "--accent": accent }}>
      <div className="ambient" aria-hidden="true" />
      {isCritical && <div className="alarm-vignette" aria-hidden="true" />}

      <div className="relative z-10 mx-auto max-w-6xl space-y-4 p-3 sm:p-5">
        <div className="reveal" style={{ "--i": 0 }}>
          <HeaderBar
            deviceName="TempGuard-01"
            status={online ? "online" : "offline"}
            battery={battery}
            onDownload={handleDownloadReport}
          />
        </div>

        <MetricRow>
          <div className="reveal h-full" style={{ "--i": 1 }}>
            <CurrTempCard
              temperature={currentTemp}
              trend={trend}
              updatedAt={lastUpdateTs}
            />
          </div>
          <div className="reveal h-full" style={{ "--i": 2 }}>
            <PredictCard
              predictedTemp={prediction}
              minutes={10}
              currentTemp={currentTemp}
            />
          </div>
        </MetricRow>

        <div className="reveal" style={{ "--i": 3 }}>
          <LiveTempChart data={data} />
        </div>

        <div className="reveal" style={{ "--i": 4 }}>
          <FooterStatus
            online={online}
            battery={battery}
            lastUpdate={`${secondsAgo}s ago`}
            mode="Live"
          />
        </div>
      </div>

      {showSoundPrompt && !soundEnabled && (
        <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="modal-card w-full max-w-sm space-y-5 rounded-3xl border border-white/10 bg-[#10131C]/95 p-7 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#34D399]/10">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">Enable alert sound?</h3>
              <p className="mt-1.5 text-sm text-[#9AA4B2]">
                Alarm plays when temperature exceeds {ALERT_THRESHOLD}°C
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() =>
                  enableAlarmSound()
                    .then(() => setSoundEnabled(true))
                    .catch(() => setSoundEnabled(false))
                    .finally(() => setShowSoundPrompt(false))
                }
                className="shimmer cursor-pointer rounded-xl bg-gradient-to-r from-[#059669] to-[#34D399] px-6 py-2.5 font-semibold text-[#04130D] transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              >
                Allow sound
              </button>
              <button
                onClick={() => {
                  setSoundEnabled(false);
                  setShowSoundPrompt(false);
                }}
                className="cursor-pointer rounded-xl bg-white/[0.07] px-6 py-2.5 font-medium text-[#E6EDF3] transition-all duration-300 hover:bg-white/[0.12] active:scale-95"
              >
                No thanks
              </button>
            </div>
          </div>
        </div>
      )}

      <AlertModal
        open={alertActive}
        temperature={currentTemp}
        onStop={handleStopAlarm}
      />
      <Analytics />
    </div>
  );
}

export default App;
