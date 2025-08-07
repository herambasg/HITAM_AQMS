import React, { useState, useEffect } from 'react';
import './App.css'; // Can be empty or removed if not used
import Header from './components/Header';
import Footer from './components/Footer';
import AqiWidget from './components/AqiWidget';
import MainAqiCard from './components/MainAqiCard';
import SensorGrid from './components/SensorGrid';

function App() {
  // State for all dynamic data
  const [lastUpdated, setLastUpdated] = useState('Awaiting data...');
  const [aqi, setAqi] = useState('--');
  const [aqiCategory, setAqiCategory] = useState('Awaiting Data...');
  const [sensorData, setSensorData] = useState({
    temperature: '-- °C',
    humidity: '-- %',
    pm25: '-- &mu;g/m³',
    pm10: '-- &mu;g/m³',
    co: '--',
    ozone: '--',
  });

  // ThingSpeak Channel ID and Read API Key
  const channelID = '3021426';
  const readAPIKey = 'Y8W8UMVX9JBDUQCU';

  const calculateAQI = (pm25, pm10) => {
    const breakpoints = {
      "PM2.5": [[0,30,0,50],[31,60,51,100],[61,90,101,200],[91,120,201,300],[121,250,301,400],[251,Infinity,401,500]],
      "PM10": [[0,50,0,50],[51,100,51,100],[101,250,101,200],[251,350,201,300],[351,430,301,400],[431,Infinity,401,500]]
    };
    const getSubIndex = (value, pollutant) => {
      if (isNaN(value)) return 0;
      const poll_breakpoints = breakpoints[pollutant];
      for (const [Clow, Chigh, Ilow, Ihigh] of poll_breakpoints) {
        if (value >= Clow && value <= Chigh) {
          return Math.round(((Ihigh - Ilow) / (Chigh - Clow)) * (value - Clow) + Ilow);
        }
      }
      if (value > poll_breakpoints[poll_breakpoints.length - 1][1]) {
        return poll_breakpoints[poll_breakpoints.length - 1][3];
      }
      return 0;
    }
    const aqi25 = getSubIndex(pm25, "PM2.5");
    const aqi10 = getSubIndex(pm10, "PM10");
    const overall = Math.max(aqi25, aqi10);
    const category = overall <= 50 ? "Good" :
                     overall <= 100 ? "Moderate" :
                     overall <= 200 ? "Poor" :
                     overall <= 300 ? "Unhealthy" :
                     overall <= 400 ? "Severe" :
                     "Hazardous";
    return { aqi: overall, category: `Air Quality is ${category}` };
  }

  // useEffect to fetch data on component mount and set an interval
  useEffect(() => {
    const fetchThingSpeakData = async () => {
      const url = `https://api.thingspeak.com/channels/${channelID}/feeds/last.json?api_key=${readAPIKey}`;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        const data = await response.json();

        if (data === -1 || !data.field1) throw new Error("Channel is empty or has no data.");

        const temp = parseFloat(data.field1);
        const humidity = parseFloat(data.field2);
        const pm25 = parseFloat(data.field3);
        const pm10 = parseFloat(data.field4);

        setSensorData({
          temperature: isNaN(temp) ? "-- °C" : `${temp.toFixed(2)} °C`,
          humidity: isNaN(humidity) ? "-- %" : `${humidity.toFixed(2)} %`,
          pm25: isNaN(pm25) ? "-- &mu;g/m³" : `${pm25.toFixed(2)} &mu;g/m³`,
          pm10: isNaN(pm10) ? "-- &mu;g/m³" : `${pm10.toFixed(2)} &mu;g/m³`,
          co: '--', // Static values as in original code
          ozone: '--'
        });

        if (!isNaN(pm25) || !isNaN(pm10)) {
          const { aqi, category } = calculateAQI(pm25, pm10);
          setAqi(aqi);
          setAqiCategory(category);
        } else {
          setAqi("--");
          setAqiCategory("Awaiting Data...");
        }

        setLastUpdated(`Last Updated: ${new Date().toLocaleString('en-IN', { timeStyle: 'medium', dateStyle: 'long', hour12: true })}`);

      } catch (error) {
        console.error("Error fetching ThingSpeak data:", error);
        setAqiCategory("Failed to load data.");
      }
    };

    fetchThingSpeakData(); // Fetch initially
    const intervalId = setInterval(fetchThingSpeakData, 15000); // Fetch every 15 seconds

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <div className="dashboard-container">
      <Header />
      <main>
        <p id="last-updated">{lastUpdated}</p>
        <div className="left-column">
          <AqiWidget />
          <MainAqiCard aqi={aqi} category={aqiCategory} />
        </div>
        <div className="right-column">
          <SensorGrid data={sensorData} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;