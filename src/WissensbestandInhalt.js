import React from 'react';
import './WissensbestandInhalt.css'; // CSS von Kompetenzkarte gejoinked

function WissensbestandInhalt({ show, onClose, titel, beschreibung }) {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{titel}</h2>
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {beschreibung && beschreibung.length > 0 ? (
            <ul>
              {beschreibung.map((item, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
              ))}
            </ul>
          ) : (
            <p>Keine Beschreibung verfügbar.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default WissensbestandInhalt;
