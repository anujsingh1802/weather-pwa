import { useState } from "react";
import { fetchLiveStation } from "../../api/trainApi";

function LiveStation() {
  const [station, setStation] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!station.trim()) {
      setError("Enter station code like JBP or NDLS");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const res = await fetchLiveStation(station.toUpperCase());
      console.log("LIVE STATION API RESPONSE ✅", res); // debug
      setResponse(res);

    } catch (err) {
      setError(err.message);
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  /* =================================================
     ✅ FIXED DATA PATH (THIS WAS THE BUG)
     trainApi.js returns:
     {
       success: true,
       trains: {
         source,
         trainCount,
         trains: []
       }
     }
  ================================================= */

  const trains = response?.trains?.trains || [];
  const trainCount = response?.trains?.trainCount || 0;

  return (
    <div style={{ padding: "16px", textAlign: "center" }}>
      <input
        placeholder="Station Code (JBP)"
        value={station}
        onChange={(e) => setStation(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>⏳ Loading live station board...</p>}
      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      {/* ===== RENDER TRAINS ===== */}
      {trains.length > 0 && (
        <>
          <p>
            <strong>Total Trains:</strong> {trainCount}
          </p>

          {trains.map((t, i) => (
            <div key={i} style={styles.card}>
              <p><strong>{t.trainName}</strong></p>
              <p>Train No: {t.trainNumber}</p>
              <p>
                Arrival: {t.expectedArrival} | Departure: {t.expectedDeparture}
              </p>
              <p>Delay: {t.delay}</p>
              <p>Platform: {t.platform || "TBA"}</p>
            </div>
          ))}
        </>
      )}

      {/* ===== EMPTY STATE ===== */}
      {response && trains.length === 0 && (
        <p>No trains found for this station</p>
      )}
    </div>
  );
}

export default LiveStation;

/* ===== Styles ===== */
const styles = {
  card: {
    background: "#f5f5f5",
    padding: "12px",
    margin: "10px auto",
    maxWidth: "420px",
    borderRadius: "8px",
    textAlign: "left",
  },
};
