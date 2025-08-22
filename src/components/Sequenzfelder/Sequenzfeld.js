import React from 'react';
import { useDrop } from 'react-dnd';

function Sequenzfeld({ titel, onDropItem, onClick, id, onTitleChange }) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTitel, setEditedTitel] = React.useState(titel);
  
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

  const handleContextMenu = (e) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setEditedTitel(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editedTitel.trim() !== '' && editedTitel !== titel) {
      onTitleChange(id, editedTitel);
    } else {
      setEditedTitel(titel);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div
      ref={drop}
      onClick={!isEditing ? onClick : undefined}
      onContextMenu={handleContextMenu}
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
      {isEditing ? (
        <input
          type="text"
          value={editedTitel}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            width: '90%',
            padding: '5px',
            fontSize: '1rem',
            textAlign: 'center',
            border: '1px solid #ccc',
            borderRadius: '5px',
          }}
        />
      ) : (
        <span>{titel}</span>
      )}
    </div>
  );
}

export default Sequenzfeld;
