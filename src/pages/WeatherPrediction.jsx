// Add this at the top with other imports
import { useEffect, useState } from "react";
import { ImSearch } from "react-icons/im";
import { CiLocationOn } from "react-icons/ci";

import rainPng from "../assets/images/rain.png";
import sunPng from "../assets/images/sun.png";
import windPng from "../assets/images/wind.png";
import cloudPng from "../assets/images/cloud.png";

import sunny from "../assets/images/sunny.png";
import cloudysun from "../assets/images/cloudysun.png";
import rainy from "../assets/images/rainy.png";
import suncloudy from "../assets/images/sunwithclould.png";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const WeatherPrediction = () => {
  const [weather, setWeather] = useState(null);
  const [isDay, setIsDay] = useState(true);
  const [search, setSearch] = useState("");
  const [isCelsius, setIsCelsius] = useState(true);
  const [dateParts, setDateParts] = useState({
    weekday: "",
    day: "",
    month: "",
    year: "",
  });

  const [user, setUser] = useState(Cookies.get("email"));

  const navigate = useNavigate();

  useEffect(() => {
    updateDate();
    checkUser();
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );

      const data = await response.json();
      setWeather(data);
      const now = Date.now() / 1000;
      const isDayTime = now > data.sys.sunrise && now < data.sys.sunset;
      setIsDay(isDayTime);
    });

    const intervalId = setInterval(updateDate, 1000 * 60);
    return () => clearInterval(intervalId);
  }, []);

  const checkUser = () =>{
    const email = Cookies.get("email");
    if (!email) {
      navigate("/");
    } else {
      setUser(email.split("@")[0]);
    }
  }

  const updateDate = () => {
    const now = new Date();
    const options = { weekday: "long" };
    const weekday = now.toLocaleDateString("en-US", options);
    const day = now.getDate();
    const month = now.toLocaleString("en-US", { month: "short" });
    const year = now.getFullYear();

    setDateParts({ weekday, day, month, year });
  };

  const searchByCity = async () => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    if (data.cod === 200) {
      setWeather(data);
      setSearch("");
      const now = Date.now() / 1000;
      const isDayTime = now > data.sys.sunrise && now < data.sys.sunset;
      setIsDay(isDayTime);
    } else {
      alert("City not found! Please try again.");
    }
  };

  const convertTemp = (temp) => (isCelsius ? temp : (temp * 9) / 5 + 32);

  const getWeatherIcon = () => {
    const main = weather.weather[0]?.main?.toLowerCase();
    if (main === "clear") return sunny;
    if (main === "clouds") return cloudysun;
    if (main === "rain") return rainy;
    return suncloudy;
  };

  if (!weather) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Loading weather info...
        </p>
      </div>
    );
  }

  const handelLogout = () =>{
    Cookies.remove("email");
    navigate("/")
  }

  // Styles
  const backgroundColor = isDay ? "bg-blue-50" : "bg-gray-900";
  const textColor = isDay ? "text-gray-900" : "text-white";
  const cardBgColor = isDay ? "bg-white" : "bg-gray-800";
  const inputBg = isDay ? "bg-white" : "bg-gray-700";
  const inputText = isDay ? "text-gray-800" : "text-white";
  const placeholderColor = isDay
    ? "placeholder-gray-500"
    : "placeholder-gray-400";
  const borderColor = isDay ? "border-gray-300" : "border-gray-600";
  const headerBg = isDay ? "bg-white" : "bg-gray-800";

  return (
    <div className={`min-h-screen ${backgroundColor} ${textColor}`}>
      <header
        className={`w-full px-6 py-4 flex flex-wrap sm:flex-nowrap gap-4 justify-between items-center shadow-md ${headerBg} sticky top-0 z-10`}
      >
        <h1
          className={`text-xl font-bold ${
            isDay ? "text-gray-800" : "text-white"
          }`}
        >
          Weather Check
        </h1>

        <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-4 justify-end">
          {/* Search */}
          <div
            className={`flex items-center border ${borderColor} ${inputBg} rounded-full w-full sm:max-w-xs`}
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cities..."
              className={`flex-1 px-4 py-2 bg-transparent outline-none ${inputText} ${placeholderColor}`}
            />
            <button
              className={`px-4 py-2 transition duration-200 
        ${
          isDay
            ? "bg-gray-100 hover:bg-gray-200"
            : "bg-gray-800 hover:bg-gray-700"
        } 
        rounded-tr-full rounded-br-full border-l-2 border-gray-500`}
              onClick={searchByCity}
            >
              <ImSearch
                className={`text-xl ${
                  isDay ? "text-gray-600" : "text-gray-300"
                }`}
              />
            </button>
          </div>

          {/* Profile / Logout */}
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-1 rounded-full font-medium border ${
                isDay ? "bg-white text-gray-800" : "bg-gray-700 text-white"
              }`}
            >
              {/* {Cookies.get("email")} */}
              {user}
            </span>
            <button onClick={handelLogout} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${cardBgColor} p-2 md:p-5 rounded-xl shadow-sm`}>
          <div className="flex justify-between items-center mb-4">
            <h2
              className={`flex items-center gap-2 px-5 py-2 rounded-full border shadow-sm transition-colors duration-300 ${
                isDay
                  ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                  : "bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
              }`}
            >
              <span className="text-lg font-semibold">{weather.name}</span>
              <CiLocationOn className="text-xl" />
            </h2>

            <div className="flex border rounded-full overflow-hidden">
              <button
                onClick={() => setIsCelsius(false)}
                className={`px-3 py-1 font-medium text-sm transition ${
                  !isCelsius
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-100 dark:hover:bg-blue-100"
                }`}
              >
                °F
              </button>
              <button
                onClick={() => setIsCelsius(true)}
                className={`px-3 py-1 font-medium text-sm transition ${
                  isCelsius
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-100 dark:hover:bg-blue-100"
                }`}
              >
                °C
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <div className="mb-12">
                <div className="text-5xl font-bold">{dateParts.weekday}</div>
                <div className="text-lg text-gray-500 dark:text-gray-400">
                  {dateParts.day} {dateParts.month}, {dateParts.year}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-6xl font-extrabold">
                  {Math.round(convertTemp(weather.main.temp))}°
                  {isCelsius ? "C" : "F"}
                </p>
                <div className="flex gap-4 text-lg text-gray-500 dark:text-gray-400">
                  <p>High: {Math.round(convertTemp(weather.main.temp_max))}°</p>
                  <p>Low: {Math.round(convertTemp(weather.main.temp_min))}°</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 mt-6 md:mt-0">
              <img
                src={getWeatherIcon()}
                alt="weather icon"
                className="w-28 h-28"
              />
              <p className="text-lg font-semibold">
                {weather.weather[0]?.main}
              </p>
              <p className="text-lg font-semibold">
                Feels like: {Math.round(convertTemp(weather.main.feels_like))}°
                {isCelsius ? "C" : "F"}
              </p>
            </div>
          </div>
        </div>

        {/* Grid 2: Today Highlight */}
        <div className={`${cardBgColor} p-2 md:p-5 rounded-xl shadow-sm`}>
          <h2 className="text-xl font-semibold mb-4">Today’s Highlights</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Rain */}
            <div
              className={`flex flex-col items-center p-4 rounded-lg shadow-sm border ${borderColor} ${inputBg} group cursor-pointer `}
            >
              <img src={rainPng} alt="Rain" className="w-12 h-12 mb-2" />
              <h3 className={`text-sm font-medium ${textColor}`}>
                Chance of Rain
              </h3>
              <p className="text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                --%
              </p>
            </div>

            {/* UV Index */}
            <div
              className={`flex flex-col items-center p-4 rounded-lg shadow-sm border ${borderColor} ${inputBg} group cursor-pointer `}
            >
              <img src={sunPng} alt="UV Index" className="w-12 h-12 mb-2" />
              <h3 className={`text-sm font-medium ${textColor}`}>UV Index</h3>
              <p className="text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                --
              </p>
            </div>

            {/* Wind */}
            <div
              className={`flex flex-col items-center p-4 rounded-lg shadow-sm border ${borderColor} ${inputBg} group cursor-pointer `}
            >
              <img src={windPng} alt="Wind" className="w-12 h-12 mb-2" />
              <h3 className={`text-sm font-medium ${textColor}`}>
                Wind Status
              </h3>
              <p className="text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {weather.wind.speed} m/s
              </p>
            </div>

            {/* Humidity */}
            <div
              className={`flex flex-col items-center p-4 rounded-lg shadow-sm border ${borderColor} ${inputBg} group cursor-pointer `}
            >
              <img src={cloudPng} alt="Humidity" className="w-12 h-12 mb-2" />
              <h3 className={`text-sm font-medium ${textColor}`}>Humidity</h3>
              <p className="text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {weather.main.humidity}%
              </p>
            </div>
          </div>
        </div>

        {/* Grid 3: Today / Week */}
        <div className={`${cardBgColor} p-2 md:p-5 rounded-xl shadow-sm`}>
          <h2 className="text-xl font-semibold mb-4">Today / Week</h2>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left: Time Chart & Tomorrow */}
            <div className="flex-1 space-y-4">
              {/* Time Chart */}
              <div className="flex divide-x divide-gray-300 dark:divide-gray-600 border rounded-lg overflow-hidden">
                {[
                  { time: "1PM", temp: "20°" },
                  { time: "2PM", temp: "24°" },
                  { time: "3PM", temp: "22°" },
                  { time: "4PM", temp: "21°" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center flex-1 p-2"
                  >
                    <p className="text-sm font-medium">{item.time}</p>
                    <img src={suncloudy} alt="Icon" className="w-8 h-8 my-1" />
                    <p className="text-sm font-semibold">{item.temp}</p>
                  </div>
                ))}
              </div>

              {/* Tomorrow Update */}
              <div
                className={`p-4 rounded-lg border ${borderColor} ${inputBg} flex items-center justify-evenly`}
              >
                <p className="text-md font-semibold text-gray-500 dark:text-gray-400 flex flex-col">
                  Tomorrow
                  <span className="text-sm font-light"> Thunder Storm</span>
                </p>
                <h2 className="text-xl font-bold">14°C</h2>
              </div>
            </div>

            {/* Right: Sunrise / Sunset */}
            <div className="">
              <div
                className={`h-full p-6 rounded-[30px] border ${borderColor} ${inputBg} flex flex-col justify-center items-center gap-6`}
              >
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-500 dark:text-gray-400">
                    Sunrise
                  </p>
                  <p>
                    {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-500 dark:text-gray-400">
                    Sunset
                  </p>
                  <p>
                    {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-gray-500 dark:text-gray-400">
                    Length of Day
                  </p>
                  <p>
                    {(() => {
                      const durationInSeconds =
                        weather.sys.sunset - weather.sys.sunrise;
                      const hours = Math.floor(durationInSeconds / 3600);
                      const minutes = Math.floor(
                        (durationInSeconds % 3600) / 60
                      );
                      return `${hours}h ${minutes}m`;
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid 4: Other Countries */}
        <div className={`${cardBgColor} p-2 md:p-5 rounded-xl shadow-sm`}>
          {/* Heading */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Other Countries</h2>
            <button
              className={`px-4 py-1 rounded-full cursor-pointer font-medium border-2 
    ${isDay ? "bg-white text-gray-800" : "bg-gray-700 text-white"}`}
            >
              Show All
            </button>
          </div>

          {/* Country Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "USA", temp: "14 °C" },
              { name: "Canada", temp: "19 °C" },
              { name: "Japan", temp: "20 °C" },
              { name: "UK", temp: "10 °C" },
            ].map((country, index) => (
              <div
                key={index}
                className={`cursor-pointer flex items-center justify-between p-4 rounded-xl border ${borderColor} ${inputBg} shadow-sm`}
              >
                <div>
                  <p className={`text-lg font-semibold ${textColor}`}>
                    {country.temp}
                  </p>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {country.name}
                  </span>
                </div>
                <img src={suncloudy} alt={country.name} className="w-10 h-10" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeatherPrediction;
