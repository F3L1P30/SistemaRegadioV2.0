import React from 'react';
import './css/footer.css';
import logo from './logo/Recurso-1.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
    </footer>
  );
}

export default Footer;
