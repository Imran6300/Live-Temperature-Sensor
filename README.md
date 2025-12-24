# Live Temperature Monitoring Sensor Frontend - TempGuard01

This repository contains the **frontend** for a real-time temperature monitoring system called **TempGuard01**. It is a responsive React + Vite web dashboard that visualizes live temperature data from IoT sensors, displays current readings, trends, predictions, alerts, and historical charts.

The frontend connects to the backend API (Node.js/Express + Socket.IO) to receive real-time updates and fetch historical data.

**Live Demo**: https://live-temperature-sensor.vercel.app

## Screenshots

![Alt text description](screenshots/temp-dashboard.png)
![Alt text description](screenshots/alert-popup.png)


## Features

- **Real-time Temperature Display**: Circular gauge with color-coded status (Normal / Rising / Critical).
- **Temperature Prediction**: Statistical forecast for the next 15 minutes with alert thresholds.
- **Live Line Chart**: Real-time updating chart of temperature readings using Recharts.
- **Alert System**: Audio alarm and visual warnings when temperature exceeds safe limits.
- **Report Download**: Export current data/report as PDF or CSV.
- **Device Status**: Shows sensor online/offline status, battery level, and last update time.
- **Responsive Design**: Works on desktop and mobile browsers.
- **Dark Mode UI**: Modern, clean dark theme for better visibility.

## Tech Stack

- **React** (v18+): For building the UI components.
- **Vite**: Fast development server and build tool.
- **Recharts**: Beautiful and responsive charts (line chart for live data).
- **Socket.IO Client**: Real-time bidirectional communication with the backend.
- **Howler.js** (or similar in utils): For alarm audio playback.
- Other libraries: Axios (for API calls), date-fns, etc. (as per `package.json`).

## Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/temp-frontend.git
   cd temp-frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration** (Optional):
   Create a `.env` file in the root directory:
   ```
   VITE_BACKEND_URL=https://temp-backend-production-4599.up.railway.app
   VITE_SOCKET_URL=https://temp-backend-production-4599.up.railway.app
   ```
   - If not set, it will default to your backend URL or localhost during development.

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 (or the port shown) in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```
   Deploy the contents of the `dist/` folder (e.g., to Vercel, Netlify, etc.).

## Backend Connection

This frontend connects to the following backend endpoints (from https://github.com/Imran6300/Temp-Backend):

- **GET Dashboard Data**: `GET /api/dashboard` → Fetches historical/latest readings for charts.
- **POST Sensor Data** (optional for testing): `POST /api/sensor/data`
- **WebSocket**: Connects to `/` for real-time `newTemperature` events.

Ensure your backend is running and CORS is configured to allow this frontend origin.

## File Structure

```
front
├── node_modules              # Dependencies (git-ignored)
├── public
│   └── beep.mp3              # Alarm sound file
├── src
│   ├── components
│   │   ├── MetricRow          # (Folder with MetricRow.jsx – displays min/max metrics)
│   │   ├── CurrTempCard.jsx   # Current temperature gauge card
│   │   ├── MetricRCw.jsx      # Metric row component variation
│   │   ├── PredictCard.jsx    # Temperature prediction card
│   │   ├── AlertModel.jsx     # Alert modal or notification component
│   │   ├── FooterStatus.jsx   # Footer with device status, battery, etc.
│   │   ├── HeaderBar.jsx      # Top header with title and download button
│   │   └── LiveTempChart.jsx  # Recharts live line chart component
│   ├── hooks
│   │   └── alerts.jsx         # Custom hook for alert logic
│   └── utils
│       ├── AlarmAudio.js      # Handles alarm sound playback
│       ├── App.jsx            # Main App component
│       ├── main.jsx           # Entry point (renders App)
│       ├── gitignore          # (Possibly a misplaced file – should be root .gitignore)
│       ├── eslint.config.js   # ESLint configuration
│       ├── index.html         # HTML template
│       ├── package-lock.json  # Dependency lockfile
│       ├── package.json       # Project metadata and dependencies
│       ├── README.md          # This file
│       └── vite.config.js     # Vite configuration
```

- **src/components/**: Reusable UI components for different sections of the dashboard.
- **src/utils/**: Utility functions, especially for audio alarms.
- **src/hooks/**: Custom React hooks for managing alerts and state.
- **public/**: Static assets like the alarm sound.

## Contributing

Contributions are welcome! Please:
1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a Pull Request.
