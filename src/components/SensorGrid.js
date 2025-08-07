import React from 'react';

function SensorGrid({ data }) {
  return (
    <section className="sensor-grid-container">
      <h2>HITAM Air Quality Parameter Readings</h2>
      <div className="grid">
        <div className="card"><h3>Temperature</h3><p id="temperature">{data.temperature}</p></div>
        <div className="card"><h3>Humidity</h3><p id="humidity">{data.humidity}</p></div>
        <div className="card"><h3>PM 2.5</h3><p id="pm25" dangerouslySetInnerHTML={{ __html: data.pm25 }}></p></div>
        <div className="card"><h3>PM 10</h3><p id="pm10" dangerouslySetInnerHTML={{ __html: data.pm10 }}></p></div>
        <div className="card"><h3>CO</h3><p id="co">{data.co}</p></div>
        <div className="card"><h3>Ozone (O₃)</h3><p id="ozone">{data.ozone}</p></div>
      </div>
    </section>
  );
}

export default SensorGrid;