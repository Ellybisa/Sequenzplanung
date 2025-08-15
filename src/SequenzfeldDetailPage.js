import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const HIGHLIGHT_COLORS = [
  '', // No highlight
  'yellow', 
  'orange', 
  'red' 
];

function SequenzfeldDetailPage({ sequenzfelder, jahrgang, updateSequenzfeldItem, sequenzNotes, onSequenzNoteChange }) {
  const { sequenzId } = useParams();
  const navigate = useNavigate();
  const currentJahrgangSequenzfelder = sequenzfelder[jahrgang] || [];
  const feld = currentJahrgangSequenzfelder.find(f => f.id === sequenzId);

  const kompetenzKarten = React.useMemo(() => (feld.items || []).filter(i => i.type === 'KOMPETENZ_KARTE'), [feld.items]);
  const wissensBestaende = React.useMemo(() => (feld.items || []).filter(i => i.type === 'WISSENSBESTAND'), [feld.items]);

  const currentSequenzNotes = sequenzNotes[sequenzId] || '';
  const handleDetailNotesChange = (event) => {
    onSequenzNoteChange(sequenzId, event.target.value);
  };

  // Funktion zum Entfernen aller Highlight-Tags
  const removeAllHighlights = (htmlString) => {
    return htmlString.replace(/<span style="background-color: (yellow|orange|red);">/g, '').replace(/<\/span>/g, '');
  };

  // Funktion zum Markieren von Text
  const handleHighlight = useCallback((itemId, type, rowIndex, jahrgangKey, stichpunktIndex, originalText, currentHighlightState = 0) => {
    let updatedItems;
    let nextHighlightState = (currentHighlightState + 1) % HIGHLIGHT_COLORS.length;
    const newColor = HIGHLIGHT_COLORS[nextHighlightState];
    const highlightTag = newColor ? `<span style="background-color: ${newColor};">` : '';
    const highlightEndTag = newColor ? '</span>' : '';

    if (type === 'WISSENSBESTAND') {
      updatedItems = wissensBestaende.map(wb => {
        if (wb.id === itemId) {
          const newBeschreibung = wb.beschreibung.map((desc, idx) => {
            if (idx === rowIndex) {
              const cleanText = removeAllHighlights(originalText);
              return highlightTag + cleanText + highlightEndTag;
            }
            return desc;
          });
          // Speichern des Highlight-Zustands für Wissensbestände
          const newHighlightStates = wb.highlightStates ? [...wb.highlightStates] : Array(wb.beschreibung.length).fill(0);
          newHighlightStates[rowIndex] = nextHighlightState;

          return { ...wb, beschreibung: newBeschreibung, highlightStates: newHighlightStates };
        }
        return wb;
      });
    } else if (type === 'KOMPETENZ_KARTE') {
      updatedItems = kompetenzKarten.map(kk => {
        if (kk.id === itemId) {
          const newRasterDaten = kk.rasterDaten.map((unterkompetenz, uIdx) => {
            if (uIdx === rowIndex) {
              const targetUnterkompetenz = { ...unterkompetenz };
              const targetJahrgangStichpunkte = { ...targetUnterkompetenz.jahrgaenge };
              const newHighlightStates = unterkompetenz.highlightStates ? { ...unterkompetenz.highlightStates } : {};

              Object.keys(targetJahrgangStichpunkte).forEach(key => {
                targetJahrgangStichpunkte[key] = targetJahrgangStichpunkte[key].map((stich, sIdx) => {
                  if (key === jahrgangKey && sIdx === stichpunktIndex) {
                    const cleanText = removeAllHighlights(originalText);
                    // Speichern des Highlight-Zustands für Kompetenzkarten
                    if (!newHighlightStates[key]) newHighlightStates[key] = [];
                    newHighlightStates[key][sIdx] = nextHighlightState;
                    return highlightTag + cleanText + highlightEndTag;
                  }
                  return stich;
                });
              });
              return { ...targetUnterkompetenz, jahrgaenge: targetJahrgangStichpunkte, highlightStates: newHighlightStates };
            }
            return unterkompetenz;
          });
          return { ...kk, rasterDaten: newRasterDaten };
        }
        return kk;
      });
    }

    updateSequenzfeldItem(sequenzId, {
      ...feld,
      items: feld.items.map(item => {
        if (item.type === type && item.id === itemId) {
          return updatedItems.find(updatedItem => updatedItem.id === itemId) || item;
        }
        return item;
      })
    });
  }, [sequenzId, feld, updateSequenzfeldItem, kompetenzKarten, wissensBestaende]);


  if (!feld) {
    return <div>Sequenzfeld nicht gefunden.</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        ← Zurück
      </button>

      <h1>{feld.titel} - Details</h1>

      <h2>Kompetenzen</h2>
      {kompetenzKarten.length === 0 ? <p>Keine Kompetenzen vorhanden.</p> : (
        kompetenzKarten.map(k => (
          <div key={k.id} style={{ marginBottom: 20 }}>
            <h3>{k.titel}</h3>
            <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Kompetenz</th>
                  <th>5/6</th>
                  <th>7/8</th>
                  <th>9/10</th>
                </tr>
              </thead>
              <tbody>
                {k.rasterDaten.map((unterkompetenz, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>{unterkompetenz.titel}</td>
                    {["5/6", "7/8", "9/10"].map((jahrgangKey, colIndex) => (
                      <td key={colIndex}>
                        <ul>
                          {unterkompetenz.jahrgaenge[jahrgangKey] && unterkompetenz.jahrgaenge[jahrgangKey].map((stichpunkt, stichpunktIndex) => {
                            const currentHighlightState = unterkompetenz.highlightStates && unterkompetenz.highlightStates[jahrgangKey]
                              ? unterkompetenz.highlightStates[jahrgangKey][stichpunktIndex] || 0
                              : 0;
                            return (
                              <li
                                key={stichpunktIndex}
                                dangerouslySetInnerHTML={{ __html: stichpunkt }}
                                onMouseUp={() => handleHighlight(k.id, 'KOMPETENZ_KARTE', rowIndex, jahrgangKey, stichpunktIndex, stichpunkt.replace(/<[^>]*>/g, ''), currentHighlightState)}
                                style={{ cursor: 'pointer' }}
                              ></li>
                            );
                          })}
                        </ul>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      <h2>Wissensbestände</h2>
      {wissensBestaende.length === 0 ? <p>Keine Wissensbestände vorhanden.</p> : (
        <ul>
          {wissensBestaende.map(w => (
            <li key={w.id}>
              <strong>{w.titel}</strong>
              {w.beschreibung && w.beschreibung.length > 0 && (
                <ul>
                  {w.beschreibung.map((desc, index) => {
                    const currentHighlightState = w.highlightStates ? w.highlightStates[index] || 0 : 0;
                    return (
                      <li
                        key={index}
                        dangerouslySetInnerHTML={{ __html: desc }}
                        onMouseUp={() => handleHighlight(w.id, 'WISSENSBESTAND', index, null, null, desc.replace(/<[^>]*>/g, ''), currentHighlightState)}
                        style={{ cursor: 'pointer' }}
                      ></li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="notes-section-detail">
        <h2>Notizen für {feld.titel}</h2>
        <textarea
          value={currentSequenzNotes}
          onChange={handleDetailNotesChange}
          placeholder={`Notizen für ${feld.titel}...`}
        />
      </div>
    </div>
  );
}

export default SequenzfeldDetailPage;