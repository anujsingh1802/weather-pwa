import { useState } from "react";
import { fetchPnrStatus } from "../../api/trainApi";

function PnrStatus() {
  const [pnr, setPnr] = useState("");
  const [data, setData] = useState(null);

  const checkPNR = async () => {
    const res = await fetchPnrStatus(pnr);
    setData(res.data);
  };

  return (
    <div>
      <input placeholder="Enter PNR" onChange={e => setPnr(e.target.value)} />
      <button onClick={checkPNR}>Check</button>

      {data && (
        <div className="card">
          <h3 className="card-title">🎫 PNR Status</h3>

          <div className="card-row">
            <span>Train</span>
            <strong>{data.train_name}</strong>
          </div>

          <div className="card-row">
            <span>Current Status</span>
            <span className="status-green">
              {data.passenger_status[0].current_status}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default PnrStatus;
