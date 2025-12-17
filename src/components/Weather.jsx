import { useState } from "react";
import "../styles/Weather.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export default function Weather() {
  const [city, setCity] = useState("");
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("theme-sunny");

  async function fetchWeather(e) {
    e.preventDefault();

    if (!city.trim()) {
      setError("Please enter a city");
      return;
    }

    try {
      setError("");

      // Current weather
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      if (!res.ok) throw new Error("City not found");

      const data = await res.json();
      setCurrent(data);
      applyTheme(data.weather[0].id);

      // Forecast
      const fRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const fData = await fRes.json();
      setForecast(getDailyForecast(fData.list));

    } catch (err) {
      setError("City not found ❌");
      setCurrent(null);
      setForecast([]);
    }
  }

  function getDailyForecast(list) {
    const days = {};
    list.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      if (!days[date]) days[date] = item;
    });
    return Object.values(days).slice(0, 5);
  }

  function applyTheme(id) {
    if (id === 800) setTheme("theme-sunny");
    else if (id < 600) setTheme("theme-rainy");
    else if (id < 700) setTheme("theme-snowy");
    else setTheme("theme-stormy");
  }

  function icon(id) {
    if (id < 300) return "⛈️";
    if (id < 600) return "🌧️";
    if (id < 700) return "❄️";
    if (id < 800) return "🌫️";
    return "☀️";
  }

  return (
    <div className={`app ${theme}`}>
      <main className="weather-card apple-card">

        {/* SEARCH */}
        <form onSubmit={fetchWeather} className="search-bar">
          <input
            type="text"
            placeholder="Search city"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
        </form>

        {error && <p className="error">{error}</p>}

        {current && (
          <>
            {/* TOP */}
            <div className="top-section">
              <div className="left-info">
                <div className="big-icon">
                  {icon(current.weather[0].id)}
                </div>
                <p className="condition">
                  {current.weather[0].description}
                </p>
                <div className="minmax">
                  <span className="up">
                    ↑ {Math.round(current.main.temp_max)}°
                  </span>
                  <span className="down">
                    ↓ {Math.round(current.main.temp_min)}°
                  </span>
                </div>
              </div>

              <div className="right-info">
                <h1 className="big-temp">
                  {Math.round(current.main.temp)}°
                </h1>
                <p className="location">📍 {current.name}</p>
              </div>
            </div>

            {/* FORECAST */}
            <div className="forecast apple-forecast">
              {forecast.map((d, i) => (
                <div key={i} className="forecast-card glass-pill">
                  <p className="time">
                    {new Date(d.dt_txt).toLocaleDateString("en", {
                      weekday: "short",
                    })}
                  </p>
                  <span className="small-icon">
                    {icon(d.weather[0].id)}
                  </span>
                  <p className="temp-small">
                    {Math.round(d.main.temp)}°
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
