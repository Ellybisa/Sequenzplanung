import React, { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import './KompetenzKarte.css';
import KompetenzKarteInhalt from './KompetenzKarteInhalt';

function KompetenzKarte({ id, titel, rasterDaten }) {
  const [showModal, setShowModal] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'KOMPETENZ_KARTE',
    item: { id, titel, type: 'KOMPETENZ_KARTE', rasterDaten },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [id, titel, rasterDaten]);

  const handleClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div
        className="kompetenzkarte-container"
        onClick={handleClick}
        ref={drag}
        style={{
          opacity: isDragging ? 0.5 : 1,
          width: 200,
          height: 80,
        }}
      >
        <div className="karte-vorderseite">{titel}</div>
      </div>

      {/* Die Tabelle wird hier gerendert */}
      <KompetenzKarteInhalt
        show={showModal}
        onClose={handleCloseModal}
        titel={titel}
        rasterDaten={rasterDaten}
      />
    </>
  );
}

export default KompetenzKarte;
