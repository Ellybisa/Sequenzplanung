import React, { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import './KompetenzKarte.css';

function KompetenzKarte({ id, titel, rasterDaten }) {
  const [istUmdreht, setIstUmdreht] = useState(false);
  const rueckseiteRef = useRef(null);
  const [cardDimensions, setCardDimensions] = useState({ width: 200, height: 120 }); // Zustand für dynamische Breite und Höhe

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
      // scrollWidth/scrollHeight geben die tatsächliche Größe des Inhalts zurück, auch wenn er überläuft
      const contentWidth = rueckseiteRef.current.scrollWidth;
      const contentHeight = rueckseiteRef.current.scrollHeight;

      // Setzen der gemessenen Dimensionen, mit einer Mindestgröße
      setCardDimensions({
        width: Math.max(200, contentWidth + 40), // +40 für Padding und etwas Spielraum
        height: Math.max(120, contentHeight + 40) // +40 für Padding und etwas Spielraum
      });

      // Zurücksetzen der temporären Styles, damit CSS wieder die Kontrolle hat
      rueckseiteRef.current.style.width = '';
      rueckseiteRef.current.style.height = '';

    } else if (!istUmdreht) {
      // Zurück zur Standardgröße, wenn nicht umgedreht
      setCardDimensions({ width: 200, height: 120 });
    }
  }, [istUmdreht]);

  return (
    <div
      className={`kompetenzkarte-container${istUmdreht ? ' umgedreht' : ''}`}
      onClick={handleClick}
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        width: cardDimensions.width,   // Dynamische Breite anwenden
        height: cardDimensions.height  // Dynamische Höhe anwenden
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
                {rasterDaten[0] && Object.keys(rasterDaten[0].kompetenzen).map((k) => (
                  <th key={k}>{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rasterDaten.map((reihe, idx) => (
                <tr key={idx}>
                  {Object.values(reihe.kompetenzen).map((text, i) => (
                    <td key={i} dangerouslySetInnerHTML={{ __html: text }}></td>
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
