import { useState } from "react";
import "../styles/Weather.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const clickSound = new Audio("/click.mp3");
const swipeSound = new Audio("/swipe.mp3");

export default function Weather() {
  const [city, setCity] = useState("");
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [theme, setTheme] = useState("theme-sunny");
  const [error, setError] = useState("");

  let startX = 0;

  function playClick() {
    clickSound.currentTime = 0;
    clickSound.play();
  }

  function handleTouchStart(e) {
    startX = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 100) {
      swipeSound.play();
    }
  }

  async function fetchWeather(e) {
    e.preventDefault();
    playClick();

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );
      if (!res.ok) throw new Error("City not found");

      const data = await res.json();
      setCurrent(data);
      applyTheme(data.weather[0].id);

      const fRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      const fData = await fRes.json();
      setForecast(extractForecast(fData.list));
      setError("");
    } catch {
      setError("City not found");
    }
  }

  function extractForecast(list) {
    const map = {};
    list.forEach(i => {
      const d = i.dt_txt.split(" ")[0];
      if (!map[d]) map[d] = i;
    });
    return Object.values(map).slice(0, 5);
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
      <div className="particles"></div>

      <div className="splash">
        <div className="splash-logo">🌦 WeatherPro</div>
      </div>

      <main
        className="weather-card"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <form onSubmit={fetchWeather} className="weather-form">
          <input
            placeholder="Enter city"
            value={city}
            onChange={e => setCity(e.target.value)}
          />
          <button>Search</button>
        </form>

        {error && <p className="error">{error}</p>}

        {current && (
          <>
            <h1>{current.name}</h1>
            <div className="weather-icon">{icon(current.weather[0].id)}</div>
            <h2>{Math.round(current.main.temp)}°C</h2>

            <div className="forecast">
              {forecast.map((d, i) => (
                <div key={i} className="forecast-card">
                  <p>{new Date(d.dt_txt).toLocaleDateString("en", { weekday: "short" })}</p>
                  <p>{icon(d.weather[0].id)}</p>
                  <p>{Math.round(d.main.temp)}°</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
