import React from 'react';
import '../Styles/Temperatura.css'; // Asegúrate de crear este archivo CSS

const Temperatura = () => {
  return (
    <div className="temperatura-container">
      <h2 className="Temperatura-title">Temperatura</h2>
      <h3 className="Temperatura-value">25°</h3>
    </div>
  );
};

export default Temperatura;
