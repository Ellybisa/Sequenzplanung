import React from 'react';
import { useDrag } from 'react-dnd';
import './Wissensbestand.css';

function Wissensbestand({ id, titel, beschreibung}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'WISSENSBESTAND',
    item: { id, titel, type: 'WISSENSBESTAND', beschreibung },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [id, titel, beschreibung]);

  return (
    <div
      ref={drag}
      className="wissensbestand-container"
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
    >
      {titel}
    </div>
  );
}

export default Wissensbestand;