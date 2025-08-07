import React, { useEffect } from 'react';

function AqiWidget() {
  useEffect(() => {
    // Find the widget content that was rendered in public/index.html
    const widgetSource = document.getElementById('hyd-aqi-widget-source');

    // Find the container within our React component
    const widgetContainer = document.getElementById('aqi-widget-container');

    // If both exist and the container is empty, move the widget into place.
    if (widgetSource && widgetContainer && widgetContainer.childElementCount === 0) {
      // Append all children from the source (the widget iframe) to the target container
      while (widgetSource.firstChild) {
        widgetContainer.appendChild(widgetSource.firstChild);
      }
    }
  }, []); // The empty array ensures this runs only once after the component mounts.

  return (
    <section className="aqi-comparision">
      <h2>Hyderabad Air Quality Index (Live)</h2>
      {/* This is now just a simple, stable container.
        The useEffect hook will populate it with the widget.
      */}
      <div id="aqi-widget-container" className="aqi-widget"></div>
    </section>
  );
}

export default AqiWidget;