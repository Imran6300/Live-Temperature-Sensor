// Single source of truth for the temperature state colours.
// Same thresholds the gauge card already used (35 / 38).
export function getTempStatus(temp) {
  if (temp < 35) return { key: "normal", color: "#34D399", label: "Normal" };
  if (temp < 38) return { key: "warning", color: "#FBBF24", label: "Warning" };
  return { key: "critical", color: "#F43F5E", label: "Critical" };
}
