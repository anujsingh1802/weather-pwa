import { useState } from "react";
import { fetchTrainStatus } from "../../api/trainApi";

function TrainSearch({ setTrainData, setLoading, setError }) {
  const [trainNumber, setTrainNumber] = useState("");

  const handleSearch = async () => {
    if (!trainNumber) {
      setError("Enter train number");
      return;
    }

    try {
      setError("");
      setLoading(true);
      const res = await fetchTrainStatus(trainNumber);
      setTrainData(res);
    } catch (err) {
      setError(err.message);
      setTrainData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <input
        placeholder="Train Number"
        value={trainNumber}
        onChange={(e) => setTrainNumber(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default TrainSearch;
