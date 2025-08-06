// MultipleFiles/App.js
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { HashRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';

import KompetenzKarte from './KompetenzKarte';
import Wissensbestand from './Wissensbestand';
import Sequenzfeld from './Sequenzfeld';
import './App.css';
// Importieren der Daten
import wissensbestaende from './Data/wissensbestaendeData';
import { INHALTSANGABE, SCHLUSSTEIL } from './Data/kompetenzData';

const initializeSequenzfelder = () =>
  Array.from({ length: 12 }, (_, i) => ({
    id: `s${i + 1}`,
    titel: `Sequenz ${i + 1}`,
    items: []
  }));

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

function App() {
  const [kompetenzen] = useState([
    { id: 'k1', titel: 'INHALTSANGABE', rasterDaten: INHALTSANGABE },
    { id: 'k1', titel: 'INHALTSANGABE', rasterDaten: SCHLUSSTEIL },
  ]);

  // Zustand für den aktuell ausgewählten Jahrgang
  const [selectedJahrgang, setSelectedJahrgang] = useState('5/6'); // Standardwert
  // Wissensbestände basierend auf dem ausgewählten Jahrgang
  const currentWissensbestaende = wissensbestaende[selectedJahrgang] || [];
  // Zustand für die Sequenzfelder, organisiert nach Jahrgang
  const [allSequenzfelder, setAllSequenzfelder] = useState({
    '5/6': initializeSequenzfelder(),
    '7/8': initializeSequenzfelder(),
    '9': initializeSequenzfelder(),
    '10': initializeSequenzfelder(),
  });
  // Undo Button
  const history = useRef([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addItemToSequenzfeld = (sequenzId, item) => {
    // Save for Undo
    const currentAllSequenzfelder = JSON.parse(JSON.stringify(allSequenzfelder));
    history.current = history.current.slice(0, historyIndex + 1);
    history.current.push(currentAllSequenzfelder);
    setHistoryIndex(history.current.length - 1);

    setAllSequenzfelder((prevAllFelder) => {
      const currentJahrgangFelder = prevAllFelder[selectedJahrgang];
      if (!currentJahrgangFelder) return prevAllFelder; // Sollte nicht passieren

      const updatedFelder = currentJahrgangFelder.map(feld => {
        if (feld.id === sequenzId) {
          if (!feld.items.find(i => i.id === item.id)) {
            return { ...feld, items: [...feld.items, item] };
          }
        }
        return feld;
      });


      return {
        ...prevAllFelder,
        [selectedJahrgang]: updatedFelder,
      };
    });
  };

  // Funktion zum Aktualisieren eines Items in einem Sequenzfeld
  const updateSequenzfeldItem = useCallback((sequenzId, updatedFeld) => {
    // Save for Undo
    const currentAllSequenzfelder = JSON.parse(JSON.stringify(allSequenzfelder));
    history.current = history.current.slice(0, historyIndex + 1);
    history.current.push(currentAllSequenzfelder);
    setHistoryIndex(history.current.length - 1);

    setAllSequenzfelder(prevAllFelder => {
      const currentJahrgangFelder = prevAllFelder[selectedJahrgang];
      if (!currentJahrgangFelder) return prevAllFelder;

      const updatedFelder = currentJahrgangFelder.map(feld =>
        feld.id === sequenzId ? updatedFeld : feld
      );

      return {
        ...prevAllFelder,
        [selectedJahrgang]: updatedFelder,
      };
    });
  }, [allSequenzfelder, historyIndex, selectedJahrgang]);


  const resetSequenzfelder = () => {
    //aktueller Zustand für Undo speichern
    const currentAllSequenzfelder = JSON.parse(JSON.stringify(allSequenzfelder));
    history.current = history.current.slice(0, historyIndex + 1);
    history.current.push(currentAllSequenzfelder);
    setHistoryIndex(history.current.length - 1);

    setAllSequenzfelder(prevAllFelder => ({
      ...prevAllFelder,
      [selectedJahrgang]: initializeSequenzfelder(), // Setzt nur die Sequenzen des aktuellen Jahrgangs zurück
    }));
  };

  const undoLastAction = useCallback(() => {
    if (historyIndex > -1) {
      const previousState = history.current[historyIndex];
      setAllSequenzfelder(previousState);
      setHistoryIndex(prevIndex => historyIndex - 1);
    }
  }, [historyIndex]);

  // Hotkey für Undo (Strg+Z)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault(); // Verhindert Standard-Browser-Undo
        undoLastAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undoLastAction]);


  // Funktion zum Ändern des ausgewählten Jahrgangs
  const handleJahrgangChange = (event) => {
    setSelectedJahrgang(event.target.value);
  };

    //FUNKTIONEN FÜR SPEICHERN UND LADEN
  const handleSave = async () => {
    const dataToSave = {
      sequenzfelder: allSequenzfelder,
      selectedJahrgang: selectedJahrgang,
      // Hier weitere Sachen, falls man mehr speichern will
    };
    // Überprüfen, ob die Electron-API verfügbar ist
    if (window.electron && window.electron.saveData) {
      const result = await window.electron.saveData(dataToSave);
      if (result.success) {
        alert(result.message);
      } else {
        alert(`Fehler: ${result.message}`);
      }
    } else {
      alert('Electron API nicht verfügbar. Speichern nur in Electron-Umgebung möglich.');
      console.warn('window.electron.saveData ist nicht definiert. Läuft die App in Electron?');
    }
  };
  const handleLoad = async () => {
    if (window.electron && window.electron.loadData) {
      const result = await window.electron.loadData();
      if (result.success && result.data) {
        setAllSequenzfelder(result.data.sequenzfelder || initializeSequenzfelder());
        setSelectedJahrgang(result.data.selectedJahrgang || '5/6');
        // Setzen Sie hier auch andere geladene Zustände
        alert('Projekt erfolgreich geladen!');
        // Zurücksetzen des Undo-History
        history.current = [];
        setHistoryIndex(-1);
      } else {
        alert(`Fehler: ${result.message}`);
      }
    } else {
      alert('Electron API nicht verfügbar. Laden nur in Electron-Umgebung möglich.');
      console.warn('window.electron.loadData ist nicht definiert. Läuft die App in Electron?');
    }
  };

  return (
    <HashRouter>
      <DndProvider backend={HTML5Backend}>
        <Routes>
          <Route path="/" element={
            <MainPage
              kompetenzen={kompetenzen}
              wissensbestaende={currentWissensbestaende}
              sequenzfelder={allSequenzfelder[selectedJahrgang]}
              addItemToSequenzfeld={addItemToSequenzfeld}
              resetSequenzfelder={resetSequenzfelder}
              selectedJahrgang={selectedJahrgang}
              onJahrgangChange={handleJahrgangChange}
              canUndo={historyIndex > -1} // Zustand Undo Button
              undoLastAction={undoLastAction} // Undo Funktion
              onSave={handleSave} // Speichern Funktion
              onLoad={handleLoad} // Laden Funktion
            />
          } />
          <Route
            path="/sequenz/:sequenzId"
            element={
              <SequenzfeldDetailPage
                sequenzfelder={allSequenzfelder} // Übergibt alle Sequenzfelder, da die Detailseite den Jahrgang nicht direkt kennt
                jahrgang={selectedJahrgang} // Übergibt den aktuellen Jahrgang an die Detailseite
                updateSequenzfeldItem={updateSequenzfeldItem} // Neue Prop übergeben
              />
            }
          />
        </Routes>
      </DndProvider>
    </HashRouter>
  );
}

function MainPage({ onSave, onLoad, kompetenzen, wissensbestaende, sequenzfelder, addItemToSequenzfeld, canUndo, undoLastAction, resetSequenzfelder, selectedJahrgang, onJahrgangChange }) {
  const navigate = useNavigate();

  return (
    <div className="main-page-container">
      <div className="header-section">
        <div className="title-selector">
          <select value={selectedJahrgang} onChange={onJahrgangChange}>
            <option value="5/6">5/6</option>
            <option value="7/8">7/8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
          <button onClick={resetSequenzfelder} className="reset-button">
            🔄 Reset
          </button>
          <button onClick={undoLastAction} disabled={!canUndo} className="reset-button">
            ↩️ Undo
          </button>
          <button onClick={onSave} className="reset-button" style={{ backgroundColor: '#28a745' }}>
            💾 Speichern
          </button>
          <button onClick={onLoad} className="reset-button" style={{ backgroundColor: '#007bff' }}>
            📂 Laden
          </button>
        </div>
      </div>

      <div className="content-area">
        <div className="sequenzfelder-section">
          <div className="sequenzfelder-header">
          </div>
          <div className="sequenzfelder-grid-container">
            {sequenzfelder.map(feld => (
              <Sequenzfeld
                key={feld.id}
                id={feld.id}
                titel={feld.titel}
                onDropItem={(item) => addItemToSequenzfeld(feld.id, item)}
                onClick={() => navigate(`/sequenz/${feld.id}`)}
              />
            ))}
          </div>
        </div>

        <div className="wissensbestaende-section">
          <div className="wissensbestaende-list">
            {wissensbestaende.map(w => (
              <Wissensbestand key={w.id} id={w.id} titel={w.titel} beschreibung={w.beschreibung} />
            ))}
          </div>
        </div>
      </div>

      <div className="kompetenzkarten-section">
        <div className="kompetenzkarten-list">
          {kompetenzen.map(k => (
            <KompetenzKarte
              key={k.id}
              id={k.id}
              titel={k.titel}
              rasterDaten={k.rasterDaten}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
