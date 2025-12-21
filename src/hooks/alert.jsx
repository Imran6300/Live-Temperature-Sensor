import { useEffect } from "react";
import { playAlarm, stopAlarm } from "../utils/AlaramAudio";

export default function useTemperatureAlert(alertActive) {
  useEffect(() => {
    if (alertActive) {
      playAlarm();
    } else {
      stopAlarm();
    }
  }, [alertActive]);
}
