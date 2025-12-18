import { useState } from "react";

/* ===== WEATHER ===== */
import Weather from "./components/weather/Weather";

/* ===== TRAIN MODULES ===== */
import TrainSearch from "./components/train/TrainSearch";
import TrainStatus from "./components/train/TrainStatus";
import PnrStatus from "./components/train/PnrStatus";
import LiveStation from "./components/train/LiveStation";

/* ===== STYLES ===== */
import "./styles/Weather.css";
import "./styles/Train.css";

function App() {
  const [activeTab, setActiveTab] = useState("weather");

  // Live train shared state
  const [trainData, setTrainData] = useState(null);
  const [trainLoading, setTrainLoading] = useState(false);
  const [trainError, setTrainError] = useState("");

  return (
    <div className="app-container">
      {/* ===== TOP NAV ===== */}
      <div className="tab-bar">
        <button
          className={activeTab === "weather" ? "active" : ""}
          onClick={() => setActiveTab("weather")}
        >
          🌦 Weather
        </button>

        <button
          className={activeTab === "train" ? "active" : ""}
          onClick={() => setActiveTab("train")}
        >
          🚆 Live Train
        </button>

        <button
          className={activeTab === "pnr" ? "active" : ""}
          onClick={() => setActiveTab("pnr")}
        >
          🎫 PNR
        </button>

        <button
          className={activeTab === "station" ? "active" : ""}
          onClick={() => setActiveTab("station")}
        >
          🚉 Station
        </button>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="content">
        {/* 1️⃣ WEATHER */}
        {activeTab === "weather" && <Weather />}

        {/* 2️⃣ LIVE TRAIN */}
        {activeTab === "train" && (
          <>
            <TrainSearch
              setTrainData={setTrainData}
              setLoading={setTrainLoading}
              setError={setTrainError}
            />

            <TrainStatus
              trainData={trainData}
              loading={trainLoading}
              error={trainError}
            />
          </>
        )}

        {/* 3️⃣ PNR STATUS */}
        {activeTab === "pnr" && <PnrStatus />}

        {/* 4️⃣ LIVE STATION */}
        {activeTab === "station" && <LiveStation />}
      </div>
    </div>
  );
}

export default App;
