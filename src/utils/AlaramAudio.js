let audio = null;
let enabled = false;

export function enableAlarmSound() {
  if (!audio) {
    audio = new Audio("/beep.mp3");
    audio.loop = true;
  }

  return audio.play().then(() => {
    audio.pause();
    audio.currentTime = 0;
    enabled = true;
  });
}

export function playAlarm() {
  if (audio && enabled) {
    audio.play().catch(() => {});
  }
}

export function stopAlarm() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}
