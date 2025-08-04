import React from 'react';
import { useDrop } from 'react-dnd';

function Sequenzfeld({ titel, onDropItem, onClick }) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ['KOMPETENZ_KARTE', 'WISSENSBESTAND'],
    drop: (item) => {
      if (onDropItem) {
        onDropItem(item);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [onDropItem]);

  return (
    <div
      ref={drop}
      onClick={onClick}
      style={{
        width: 200,
        height: 120,
        margin: 10,
        border: '2px dashed gray',
        borderRadius: 10,
        backgroundColor: isOver && canDrop ? '#f0f8ff' : 'white',
        cursor: 'pointer',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        textAlign: 'center',
      }}
    >
      {titel}
    </div>
  );
}

export default Sequenzfeld;
