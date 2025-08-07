import React from 'react';

function MainAqiCard({ aqi, category }) {
  return (
    <section className="main-aqi-card">
      <h2>HITAM Air Quality Index</h2>
      <p id="calculated-aqi">{aqi}</p>
      <p id="aqi-category">{category}</p>
    </section>
  );
}

export default MainAqiCard;