import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import './Wissensbestand.css';
import WissensbestandInhalt from './WissensbestandInhalt';

function Wissensbestand({ id, titel, beschreibung }) {
  const [showModal, setShowModal] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'WISSENSBESTAND',
    item: { id, titel, type: 'WISSENSBESTAND', beschreibung },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [id, titel, beschreibung]);

  const handleClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div
        ref={drag}
        className="wissensbestand-container"
        style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
        onClick={handleClick}
      >
        {titel}
      </div>

      {/* Der Inhalt wird hier gerendert */}
      <WissensbestandInhalt
        show={showModal}
        onClose={handleCloseModal}
        titel={titel}
        beschreibung={beschreibung}
      />
    </>
  );
}

export default Wissensbestand;
