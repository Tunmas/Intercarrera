import React from 'react';
import '../Styles/Life.css'; // Asegúrate de crear este archivo CSS

const Life = () => {
  return (
    <div className="life-container">
      <h2 className="life-title">Vida</h2>
      <div className="heart-images">
        {[...Array(5)].map((_, index) => (
          <img 
            key={index}
            src="/Images/pixel-heart.png"
            alt="Corazón"
            className="heart-image"
          />
        ))}
      </div>
    </div>
  );
};

export default Life;
