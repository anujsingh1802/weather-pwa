import { useState } from "react";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function Weather() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);

  const fetchWeather = async () => {
    if (!city) return;
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const json = await res.json();
    setData(json);
  };

  return (
    <div>
      <input placeholder="Enter city" onChange={e => setCity(e.target.value)} />
      <button onClick={fetchWeather}>Search</button>

      {data && (
        <div className="card">
          <h3 className="card-title">🌦 {data.name}</h3>
          <p className="card-sub">{data.weather[0].description}</p>

          <div className="card-row">
            <span>🌡 Temp</span>
            <strong>{Math.round(data.main.temp)}°C</strong>
          </div>

          <div className="card-row">
            <span>🤗 Feels Like</span>
            <strong>{Math.round(data.main.feels_like)}°C</strong>
          </div>

          <div className="card-row">
            <span>💧 Humidity</span>
            <strong>{data.main.humidity}%</strong>
          </div>

          <div className="card-row">
            <span>🌬 Wind</span>
            <strong>{data.wind.speed} m/s</strong>
          </div>
        </div>
      )}
    </div>
  );
}

export default Weather;
