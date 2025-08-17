import React from 'react';
import './KompetenzKarteInhalt.css';

function KompetenzKarteInhalt({ show, onClose, titel, rasterDaten }) {
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
          <table>
            <thead>
              <tr>
                <th>Kompetenz</th>
                <th>5/6</th>
                <th>7/8</th>
                <th>9/10</th>
              </tr>
            </thead>
            <tbody>
              {rasterDaten.map((unterkompetenz, idx) => (
                <tr key={idx}>
                  <td>{unterkompetenz.titel}</td>
                  {["5/6", "7/8", "9/10"].map((jahrgang, i) => (
                    <td key={i}>
                      <ul>
                        {unterkompetenz.jahrgaenge[jahrgang] && unterkompetenz.jahrgaenge[jahrgang].map((stichpunkt, j) => (
                          <li key={j} dangerouslySetInnerHTML={{ __html: stichpunkt }}></li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default KompetenzKarteInhalt;
