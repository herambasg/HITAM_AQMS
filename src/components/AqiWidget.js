import React, { useEffect, useRef } from 'react';

function AqiWidget() {
  const widgetRef = useRef(null);

  useEffect(() => {
    // Prevent script from being added multiple times
    if (widgetRef.current && !widgetRef.current.querySelector('script')) {
      const script = document.createElement('script');
      script.src = 'https://www.aqi.in/scripts/widget.min.js';
      script.async = true;
      widgetRef.current.appendChild(script);
    }
  }, []); // Empty dependency array ensures this runs only once

  return (
    <section className="aqi-comparision">
      <h2>Hyderabad Air Quality Index (Live)</h2>
      <div className="aqi-widget">
        <div data-aqi-widget-payload='{"o_w":1,"o_w_t_u":"c","o_t":"c","w_t_i":2,"ls":[{"s":"india/telangana/hyderabad"}]}' ref={widgetRef}>
        </div>
      </div>
    </section>
  );
}

export default AqiWidget;