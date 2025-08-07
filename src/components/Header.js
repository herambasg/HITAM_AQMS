import React from 'react';
import logo from '../assets/Hitam logo.png'; // Import the logo

function Header() {
  return (
    <header>
      <img id="logo" src={logo} alt="HITAM Logo" />
      <h1>⛅ HITAM Weather Dashboard</h1>
      <p>Real-Time Air Quality Monitoring at HITAM</p>
    </header>
  );
}

export default Header;