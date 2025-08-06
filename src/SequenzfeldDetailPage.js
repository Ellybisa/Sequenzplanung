import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';    

function SequenzfeldDetailPage({ sequenzfelder, jahrgang, updateSequenzfeldItem }) {
  const { sequenzId } = useParams();
  const navigate = useNavigate();
  const currentJahrgangSequenzfelder = sequenzfelder[jahrgang] || [];
  const feld = currentJahrgangSequenzfelder.find(f => f.id === sequenzId);
  const kompetenzKarten = (feld.items || []).filter(i => i.type === 'KOMPETENZ_KARTE');
  const wissensBestaende = (feld.items || []).filter(i => i.type === 'WISSENSBESTAND');

  // Funktion zum Markieren von Text
  const handleHighlight = useCallback((itemId, type, rowIndex, jahrgangKey, stichpunktIndex, originalText) => {
    const highlightTag = '<span style="background-color: yellow;">';
    const highlightEndTag = '</span>';
    // Hilfsfunktion zum Entfernen eines einzelnen Highlights
    const removeSingleHighlight = (htmlString) => {
      return htmlString.replace(highlightTag, '').replace(highlightEndTag, '');
    };
    let updatedItems;
    if (type === 'WISSENSBESTAND') {
      updatedItems = wissensBestaende.map(wb => {
        if (wb.id === itemId) {
          const newBeschreibung = wb.beschreibung.map((desc, idx) => {
            if (idx === rowIndex) {
              // Umschalten des Highlights für den geklickten Stichpunkt
              return desc.includes(highlightTag) ? removeSingleHighlight(desc) : highlightTag + originalText + highlightEndTag;
            }
            return desc;
          });
          return { ...wb, beschreibung: newBeschreibung };
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
              Object.keys(targetJahrgangStichpunkte).forEach(key => {
                targetJahrgangStichpunkte[key] = targetJahrgangStichpunkte[key].map((stich, sIdx) => {
                  if (key === jahrgangKey && sIdx === stichpunktIndex) {
                    // Umschalten des Highlights für den geklickten Stichpunkt
                    return stich.includes(highlightTag) ? removeSingleHighlight(stich) : highlightTag + originalText + highlightEndTag;
                  }
                  return stich;
                });
              });
              return { ...targetUnterkompetenz, jahrgaenge: targetJahrgangStichpunkte };
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
  }, [sequenzId, feld, wissensBestaende, kompetenzKarten, updateSequenzfeldItem]);



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
                  <th>Kompetenz</th> {}
                  <th>5/6</th>
                  <th>7/8</th>
                  <th>9/10</th>
                </tr>
              </thead>
              <tbody>
                {k.rasterDaten.map((unterkompetenz, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>{unterkompetenz.titel}</td> {}
                    {["5/6", "7/8", "9/10"].map((jahrgangKey, colIndex) => (
                      <td key={colIndex}>
                        <ul>
                          {unterkompetenz.jahrgaenge[jahrgangKey] && unterkompetenz.jahrgaenge[jahrgangKey].map((stichpunkt, stichpunktIndex) => (
                            <li
                              key={stichpunktIndex}
                              dangerouslySetInnerHTML={{ __html: stichpunkt }}
                              onMouseUp={() => handleHighlight(k.id, 'KOMPETENZ_KARTE', rowIndex, jahrgangKey, stichpunktIndex, stichpunkt.replace(/<[^>]*>/g, ''))}
                              style={{ cursor: 'pointer' }}
                            ></li>
                          ))}
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
                      {w.beschreibung.map((desc, index) => (
                        <li
                          key={index}
                          dangerouslySetInnerHTML={{ __html: desc }}
                          onMouseUp={() => handleHighlight(w.id, 'WISSENSBESTAND', index, null, null, desc.replace(/<[^>]*>/g, ''))}
                          style={{ cursor: 'pointer' }}
                        ></li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
        </ul>
      )}
    </div>
  );
}

export default SequenzfeldDetailPage;