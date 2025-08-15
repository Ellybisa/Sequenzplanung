// MultipleFiles/App.js
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';

import KompetenzKarte from './KompetenzKarte';
import Wissensbestand from './Wissensbestand';
import Sequenzfeld from './Sequenzfeld';
import SequenzfeldDetailPage from './SequenzfeldDetailPage';
import './App.css';
// Importieren der Daten
import wissensbestaende from './wissensbestaendeData';
import {
  INHALTSANGABE,
  SCHLUSSTEIL,
  EINLEITUNG,
  STOFFSAMMLUNG,
  REZITATION,
  HAUPTTEIL_DES_MGS,
  ANALYSETEIL,
  DEUTUNG,
  PRAESENTATION,
  SPRACHE,
  EROERTERUNG_ARGUMENTATION
} from './kompetenzData';


const initializeSequenzfelder = () =>
  Array.from({ length: 12 }, (_, i) => ({
    id: `s${i + 1}`,
    titel: `Sequenz ${i + 1}`,
    items: []
  }));

function App() {
  
  const [kompetenzen] = useState([
  { id: 'k1', titel: 'INHALTSANGABE', rasterDaten: INHALTSANGABE },
  { id: 'k2', titel: 'SCHLUSSTEIL', rasterDaten: SCHLUSSTEIL },
  { id: 'k3', titel: 'EINLEITUNG', rasterDaten: EINLEITUNG },
  { id: 'k4', titel: 'STOFFSAMMLUNG', rasterDaten: STOFFSAMMLUNG },
  { id: 'k5', titel: 'REZITATION', rasterDaten: REZITATION },
  { id: 'k6', titel: 'HAUPTTEIL DES MGS', rasterDaten: HAUPTTEIL_DES_MGS },
  { id: 'k7', titel: 'ANALYSETEIL', rasterDaten: ANALYSETEIL },
  { id: 'k8', titel: 'DEUTUNG', rasterDaten: DEUTUNG },
  { id: 'k9', titel: 'PRÄSENTATION', rasterDaten: PRAESENTATION },
  { id: 'k10', titel: 'SPRACHE', rasterDaten: SPRACHE },
  { id: 'k11', titel: 'ERÖRTERUNG / ARGUMENTATION', rasterDaten: EROERTERUNG_ARGUMENTATION }
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
  }, [historyIndex, selectedJahrgang, allSequenzfelder]);

  const updateSequenzfeldTitle = useCallback((sequenzId, newTitle) => {
    const currentAllSequenzfelder = JSON.parse(JSON.stringify(allSequenzfelder));
    history.current = history.current.slice(0, historyIndex + 1);
    history.current.push(currentAllSequenzfelder);
    setHistoryIndex(history.current.length - 1);
    setAllSequenzfelder(prevAllFelder => {
      const currentJahrgangFelder = prevAllFelder[selectedJahrgang];
      if (!currentJahrgangFelder) return prevAllFelder;
      const updatedFelder = currentJahrgangFelder.map(feld =>
        feld.id === sequenzId ? { ...feld, titel: newTitle } : feld
      );
      return {
        ...prevAllFelder,
        [selectedJahrgang]: updatedFelder,
      };
    });
  }, [historyIndex, selectedJahrgang, allSequenzfelder]);


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
  
  const [mainPageNotes, setMainPageNotes] = useState({
    '5/6': '',
    '7/8': '',
    '9': '',
    '10': '',
  });
  const [sequenzNotes, setSequenzNotes] = useState({});

  const handleMainPageNoteChange = (event) => {
    setMainPageNotes(prevNotes => ({
      ...prevNotes,
      [selectedJahrgang]: event.target.value, // Aktualisiere Notizen für den aktuellen Jahrgang
    }));
  };

  const handleSequenzNoteChange = useCallback((sequenzId, notes) => {
    setSequenzNotes(prevNotes => ({
      ...prevNotes,
      [sequenzId]: notes,
    }));
  }, []);

  //FUNKTIONEN FÜR SPEICHERN UND LADEN
  const handleSave = async () => {
    const dataToSave = {
      sequenzfelder: allSequenzfelder,
      selectedJahrgang: selectedJahrgang,
      mainPageNotes: mainPageNotes,
      sequenzNotes: sequenzNotes,
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
        setAllSequenzfelder(
          result.data.sequenzfelder &&
          typeof result.data.sequenzfelder === 'object' &&
          Object.keys(result.data.sequenzfelder).length === 4
            ? result.data.sequenzfelder
            : {
                '5/6': initializeSequenzfelder(),
                '7/8': initializeSequenzfelder(),
                '9': initializeSequenzfelder(),
                '10': initializeSequenzfelder(),
              }
        );
        setSelectedJahrgang(result.data.selectedJahrgang || '5/6');
        setMainPageNotes(result.data.mainPageNotes && typeof result.data.mainPageNotes === 'object'
          ? result.data.mainPageNotes
          : { '5/6': '', '7/8': '', '9': '', '10': '' }
        );
        setSequenzNotes(result.data.sequenzNotes || {});
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
              undoLastAction={undoLastAction}
              onSave={handleSave}
              onLoad={handleLoad}
              mainPageNotes={mainPageNotes[selectedJahrgang]}
              onMainPageNoteChange={handleMainPageNoteChange}
              updateSequenzfeldTitel={updateSequenzfeldTitle}
            />
          } />
          <Route
            path="/sequenz/:sequenzId"
            element={
              <SequenzfeldDetailPage
                sequenzfelder={allSequenzfelder}
                jahrgang={selectedJahrgang}
                updateSequenzfeldItem={updateSequenzfeldItem}
                sequenzNotes={sequenzNotes}
                onSequenzNoteChange={handleSequenzNoteChange}
              />
            }
          />
        </Routes>
      </DndProvider>
    </HashRouter>
  );
}

function MainPage({ onSave, onLoad, kompetenzen, wissensbestaende, sequenzfelder, addItemToSequenzfeld, canUndo,
  undoLastAction, resetSequenzfelder, selectedJahrgang, onJahrgangChange, mainPageNotes, onMainPageNoteChange,
  updateSequenzfeldTitel }) {
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
                onTitleChange={updateSequenzfeldTitel}
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
      <div className = "bottom-sections-container">
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

        <div className="notes-section-main">
          <h2>Allgemeine Notizen für {selectedJahrgang}</h2>
            <textarea
              value={mainPageNotes}
              onChange={onMainPageNoteChange}
              placeholder="Platz für Notizen..."
            />
        </div>
      </div>
    </div>
  );
}

export default App;
