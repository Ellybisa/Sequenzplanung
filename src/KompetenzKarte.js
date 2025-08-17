import React, { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import './KompetenzKarte.css';

function KompetenzKarte({ id, titel, rasterDaten }) {
  const [istUmdreht, setIstUmdreht] = useState(false);
  const rueckseiteRef = useRef(null);
  const [cardDimensions, setCardDimensions] = useState({ width: 200, height: 80 });

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'KOMPETENZ_KARTE',
    item: { id, titel, type: 'KOMPETENZ_KARTE', rasterDaten },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [id, titel, rasterDaten]);

  const handleClick = () => setIstUmdreht(prev => !prev);

  // Effekt, um die Höhe und Breite der Rückseite zu messen, wenn sie sichtbar wird
  useEffect(() => {
    if (istUmdreht && rueckseiteRef.current) {
      // Temporär die Dimensionen auf 'auto' setzen, um die natürliche Größe zu ermitteln
      rueckseiteRef.current.style.width = 'auto';
      rueckseiteRef.current.style.height = 'auto';

      // Messen der benötigten Breite und Höhe
      const contentWidth = rueckseiteRef.current.scrollWidth;
      const contentHeight = rueckseiteRef.current.scrollHeight;

      // Setzen der gemessenen Dimensionen, mit einer Mindestgröße
      setCardDimensions({
        width: Math.max(200, contentWidth + 40), // +40 für Padding und etwas Spielraum
        height: Math.max(80, contentHeight + 40)
      });
      // Zurücksetzen der Stile, um die automatische Größe zu entfernen
      rueckseiteRef.current.style.width = '';
      rueckseiteRef.current.style.height = '';

    } else if (!istUmdreht) {
      setCardDimensions({ width: 200, height: 80 });
    }
  }, [istUmdreht]);

  return (
    <div
      className={`kompetenzkarte-container${istUmdreht ? ' umgedreht' : ''}`}
      onClick={handleClick}
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        width: cardDimensions.width,
        height: cardDimensions.height
      }}
    >
      {!istUmdreht && (
        <div className="karte-vorderseite">{titel}</div>
      )}

      {istUmdreht && (
        <div className="karte-rueckseite" ref={rueckseiteRef}>
          <table>
            <thead>
              <tr>
                <th>Kompetenz</th> {}
                <th>5/6</th>
                <th>7/8</th>
                <th>9/10</th>
              </tr>
            </thead>
            <tbody>
              {rasterDaten.map((unterkompetenz, idx) => (
                <tr key={idx}>
                  <td>{unterkompetenz.titel}</td> {}
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
      )}
    </div>
  );
}

export default KompetenzKarte;
