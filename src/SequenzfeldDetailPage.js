import React, { useCallback, useMemo, useState } from 'react';
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

  const [showPromptBubble, setShowPromptBubble] = useState(false);

  const generatePrompt = useCallback(() => {
    let prompt = `Erstelle aus den Angaben zum Ablauf und der angehängten Datei eine Unterrichtssequenz für die Klassenstufe ${jahrgang} (Gymnasium in Sachsen-Anhalt).\n\n`;
    prompt += `Ablauf Sequenz\n`;
    prompt += `1. Thematische, problematisierende oder methodische Hinführung (1/2 Stunde)\n`;
    prompt += `2. Verkürzte Einstiegsdiagnose zum antizipierten Endprodukt mit Fokus auf Kernkriterien, die das meiste abrufen (1/2 Stunde, entscheide selbst konkret)\n`;
    prompt += `3. Hinführung zu den ersten Kernkriterien an passenden Inhalten inkl. Übung und Vertiefung (ca.3-8 Stunden, entscheide selbst konkret)\n`;
    prompt += `4. Leistungskontrolle bzw. Übungsphase als Notenmöglichkeit der unter 3. geübten Aspekte (1-2Stunden, entscheide selbst konkret)\n`;
    prompt += `5. Einführung weiterer Kriterien und kurze Elemente der Vertiefung/Übung vorherigen Kriterien (ca. 3-8Stunden, entscheide selbst konkret)\n`;
    prompt += `6. Unter Umständen Leistungskontrolle bzw. Übungsphase als Notenmöglichkeit der unter 3. geübten Aspekte (1-2Stunden, entscheide selbst konkret)\n`;
    prompt += `7. (wähle aus den Varianten aus, ca. 3-8Stunden, entscheide selbst konkret)\n`;
    prompt += `   a. Vertiefende und zusammenfassende Elemente\n`;
    prompt += `   b. Vermehrte Übungsphasen\n`;
    prompt += `   c. Erarbeitungen hin zum Endprodukt\n`;
    prompt += `8. (wähle aus den Varianten aus)\n`;
    prompt += `   a. Enddiagnose zum kompletten Endprodukt inkl. Auswertung (2-4 Stunden, entscheide selbst konkret)\n`;
    prompt += `   b. Präsentations- und Auswertungsphase (2-4Stunden, entscheide selbst konkret)\n`;
    prompt += `Antizipierte Dauer: Minimum 18Stunden, Maximum 30Stunden\n`;
    prompt += `Benenne ruhig konkrete Textbeispiele. Versuche dich aber länger an einzelnen Texten aufzuhalten.\n\n`;

    // Hier könnte man den ganzen Prompt generieren lassen

    return prompt;
  }, [jahrgang]);

  const copyPromptToClipboard = useCallback(() => {
    const promptText = generatePrompt();
    navigator.clipboard.writeText(promptText).then(() => {
      alert('Prompt wurde in die Zwischenablage kopiert!');
    }).catch(err => {
      console.error('Fehler beim Kopieren des Prompts: ', err);
      alert('Fehler beim Kopieren des Prompts.');
    });
  }, [generatePrompt]);

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

  const areAllKompetenzStichpunkteHighlighted = useMemo(() => {
    if (kompetenzKarten.length === 0) return false;
    for (const kk of kompetenzKarten) {
      for (const unterkompetenz of kk.rasterDaten) {
        const stichpunkte = unterkompetenz.jahrgaenge[jahrgang];
        if (stichpunkte) {
          for (let i = 0; i < stichpunkte.length; i++) {
            const highlightState = (unterkompetenz.highlightStates && unterkompetenz.highlightStates[jahrgang] && unterkompetenz.highlightStates[jahrgang][i]) || 0;
            if (highlightState === 0) { // 0 bedeutet keine Markierung
              return false;
            }
          }
        }
      }
    }
    return true;
  }, [kompetenzKarten, jahrgang]);

  const areAllWissensbestandStichpunkteHighlighted = useMemo(() => {
    if (wissensBestaende.length === 0) return false;
    for (const wb of wissensBestaende) {
      if (wb.beschreibung) {
        for (let i = 0; i < wb.beschreibung.length; i++) {
          const highlightState = (wb.highlightStates && wb.highlightStates[i]) || 0;
          if (highlightState === 0) { // 0 bedeutet keine Markierung
            return false;
          }
        }
      }
    }
    return true;
  }, [wissensBestaende]);

  // Highlights exportieren
  const exportHighlightedToTxt = useCallback(() => {
    let exportContent = `Markierte Kompetenzen für Jahrgang ${jahrgang}:\n\n`;
    kompetenzKarten.forEach(kk => {
      kk.rasterDaten.forEach(unterkompetenz => {
        const stichpunkte = unterkompetenz.jahrgaenge[jahrgang];
        if (stichpunkte) {
          stichpunkte.forEach((stichpunkt, stichpunktIndex) => {
            const highlightState = (unterkompetenz.highlightStates && unterkompetenz.highlightStates[jahrgang] && unterkompetenz.highlightStates[jahrgang][stichpunktIndex]) || 0;
            if (highlightState !== 0) { // Nur markierte Stichpunkte exportieren
              exportContent += `- ${removeAllHighlights(stichpunkt)}\n`;
            }
          });
        }
      });
    });
    exportContent += `\nMarkierte Wissensbestände für Jahrgang ${jahrgang}:\n\n`;
    wissensBestaende.forEach(wb => {
      if (wb.beschreibung) {
        wb.beschreibung.forEach((desc, index) => {
          const highlightState = (wb.highlightStates && wb.highlightStates[index]) || 0;
          if (highlightState !== 0) { // Nur markierte Stichpunkte exportieren
            exportContent += `- ${removeAllHighlights(desc)}\n`;
          }
        });
      }
    });

    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `Markierte_Inhalte_Sequenz_${sequenzId}_Jahrgang_${jahrgang}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    alert('Markierte Inhalte wurden exportiert!');
  }, [kompetenzKarten, wissensBestaende, jahrgang, sequenzId]);

  if (!feld) {
    return <div>Sequenzfeld nicht gefunden.</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <button onClick={() => navigate(-1)} style={{ marginRight: 10 }}>
          ← Zurück
        </button>
        <div className={`highlight-checkbox ${areAllKompetenzStichpunkteHighlighted ? 'highlighted' : ''}`}>
          Kompetenzen
        </div>
        <div className={`highlight-checkbox ${areAllWissensbestandStichpunkteHighlighted ? 'highlighted' : ''}`} style={{ marginLeft: 10 }}>
          Wissensbestände
        </div>
      </div>

      <h2>Kompetenzen</h2>
      {kompetenzKarten.length === 0 ? <p>Keine Kompetenzen vorhanden.</p> : (
        kompetenzKarten.map(k => (
          <div key={k.id} style={{ marginBottom: 20 }}>
            <h3>{k.titel}</h3>
            <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Kompetenz</th>
                  <th>{jahrgang}</th>
                </tr>
              </thead>
              <tbody>
                {k.rasterDaten.map((unterkompetenz, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>{unterkompetenz.titel}</td>
                      <td>
                        <ul>
                          {unterkompetenz.jahrgaenge[jahrgang] && unterkompetenz.jahrgaenge[jahrgang].map((stichpunkt, stichpunktIndex) => {
                            const currentHighlightState = unterkompetenz.highlightStates && unterkompetenz.highlightStates[jahrgang]
                              ? unterkompetenz.highlightStates[jahrgang][stichpunktIndex] || 0
                              : 0;
                            return (
                              <li
                                key={stichpunktIndex}
                                dangerouslySetInnerHTML={{ __html: stichpunkt }}
                                onMouseUp={() => handleHighlight(k.id, 'KOMPETENZ_KARTE', rowIndex, jahrgang, stichpunktIndex, stichpunkt.replace(/<[^>]*>/g, ''), currentHighlightState)}
                                style={{ cursor: 'pointer' }}
                              ></li>
                            );
                          })}
                        </ul>
                      </td>
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

      <div className="floating-button-container">
        {showPromptBubble && (
          <div className="floating-button-content">
            <h3>Prompt zum Kopieren</h3>
            <textarea
              value={generatePrompt()}
              readOnly
            />
            <button onClick={copyPromptToClipboard}>In Zwischenablage kopieren</button>
            <button onClick={exportHighlightedToTxt} style={{ backgroundColor: '#007bff' }}>Markierte Inhalte exportieren</button>
          </div>
        )}
        <button className="floating-button" onClick={() => setShowPromptBubble(!showPromptBubble)}>
          💬
        </button>
      </div>
    </div>
  );
}

export default SequenzfeldDetailPage;