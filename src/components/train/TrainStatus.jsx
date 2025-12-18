function TrainStatus({ trainData, loading, error }) {
  if (loading) return <p>⏳ Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!trainData?.data) return null;

  const d = trainData.data;

  return (
    <div className="card">
      <h3 className="card-title">🚆 {d.train_name}</h3>
      <span className="tag">Train No: {d.train_number}</span>

      <div className="card-row">
        <span>📍 Current</span>
        <strong>{d.current_station_name}</strong>
      </div>

      <div className="card-row">
        <span>⏰ ETA</span>
        <strong>{d.eta}</strong>
      </div>

      <div className="card-row">
        <span>⏳ Delay</span>
        <span className={d.delay > 60 ? "status-red" : "status-green"}>
          {d.delay} min
        </span>
      </div>

      <p className="card-sub">
        {d.current_location_info?.[0]?.label}
      </p>
    </div>
  );
}

export default TrainStatus;
