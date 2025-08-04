import React, { useState, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { HashRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';

import KompetenzKarte from './KompetenzKarte';
import Wissensbestand from './Wissensbestand';
import Sequenzfeld from './Sequenzfeld';
import './App.css';

// Deine Daten und Komponenten kommen hier
const wissensbestaende = {
    '5/6': [
    { id: 'w1', titel: 'Schreiben',
      beschreibung: ['Funktion & Form Schreibplan','Strategien der Textüberarbeitung und Fehlerberichtigung', 'einfache Merkmale der Textkohärenz: Satzverknüpfung']},
    { id: 'w2', titel: 'analysierendes Lesen',
      beschreibung: ['Lesetechniken: Nutzung von Hilfsmitteln für organisierende Lesetechniken: Markierungen, Zwischenüberschriften, Kernsatz, Schlüsselbegriffe, Stichwörter',''] },
    { id: 'w3', titel: 'Textanalyse',
      beschreibung: ['Merkmale kontinuierlicher und diskontinuierlicher Texte',
        'Funktion und Wirkung ausgewählter sprachkünstlerischer Gestaltungsmittel, z.B. Alliteration, Metapher, Personifikation, Onomatopoesie, Vergleich und Wiederholung',
        'funktionale Bedeutung ausgewählter literarischer Besonderheiten, z.B.: Ort, Zeit, Handlung, Thema, Erzählform (Ich-, Er-/Sie-Erzähler), Aufbau, Figur, Beschreibung literarischer Figuren und Figurenbeziehungen sowie Fiktionssignale → Auswahl → Festlegung?']},
    { id: 'w4', titel: 'Epik',
      beschreibung: ['Märchen (Volks- und Kunstmärchen)','Sage (Heldensage)', 'Fabel', 'Erzählung', 'Gestaltungselemente des lauten (Vor-)lesens'] },
    { id: 'w5', titel: 'Lyrik',
      beschreibung: ['Formmerkmale lyrischer Texte in Funktion und Wirkung: Strophe, Vers, Reim (End-, Haufen-, Paar-, Kreuzreim, umschließender Reim)','Begriffsinhalte: lyrischer Sprecher/ lyrisches Ich und Thema',
        'Rezitation: Betonung, Lautstärke, Sprechtempo, Stimmführung, Körpersprache (Gestik, Mimik und Körperhaltung); Gestaltung von Rezitationen lyrischer Texte']},
    { id: 'w6', titel: 'Textproduktion',
      beschreibung: ['Varianten einfacher textproduktiver Verfahren'] },
    { id: 'w7', titel: 'Rechtschreibung / Grammatik',
      beschreibung: ['Regeln der Interpunktion bei Aufzählung und im zusammengesetzten Satz, wörtliche Rede', 'flektierbarer Wortarten: Substantiv, Verb, Artikel, Adjektiv und Pronomen (Personalpronomen, Possessivpronomen, Demonstrativpronomen, Relativpronomen, Indefinitpronomen)', 'Bildung und Verwendung des Verbs: finite und infinite Formen, Leitformen/Stammformen, (schwache, starke, unregelmäßige Verben), Tempus und Genus verbi', 'unflektierbare Wortarten: Adverb, Präposition, Konjunktion', 'Satzstrukturen: einfacher und zusammengesetzter Satz (Hauptsatz, Nebensatz/Gliedsatz, Gliedteilsatz; Satzreihe/Satzverbindung, Satzgefüge)', 'Satzgliedern: Subjekt, Prädikat (einfaches und mehrgliedriges Prädikat), Objekt (Akkusativ-, Dativ-, Genitiv-, Präpositionalobjekt) und Adverbialbestimmung (Temporal-, Lokal-, Modal-, Kausalbestimmung)',
        'Attribut','Funktion grammatischer Proben: Umstellprobe, Ersatzprobe', 'Satzstruktur: Satzklammer, Feldermodell'] },
    ],
    '7/8': [
    { id: 'w1', titel: 'Sprechen & Zuhören', beschreibung: ['sprachliche Gestaltung der Wiedergabe von Eindrücken, Stimmungen, Gefühlen sowie des Gesamteindrucks (S/Z)']},
    { id: 'w2', titel: 'Argumentation', beschreibung: ['Formen des Argumentierens und Bewertens: Stellungnahme, Streitgespräch, Beurteilung und Schlussfolgerung (S/Z)', 'Merkmale und Verwendung von Behauptung/These, Argument und Beleg/Beispiel (S)', 'Funktionen von verbalen und nonverbalen Mitteln (S/Z)','Formen des Argumentierens und Bewertens: Stellungnahme, Streitgespräch, Beurteilung und Schlussfolgerung (S/Z)', 'Merkmale und Verwendung von Behauptung/These, Argument und Beleg/Beispiel (S)', 'Funktionen von verbalen und nonverbalen Mitteln (S/Z)']},
    { id: 'w3', titel: 'Schreiben', beschreibung: ['Mittel zur Herstellung von Textkohärenz: Ersetzung, Wiederaufnahme (S)',
      'Grundregeln und Formalien des Zitierens (S)',
      'Elemente der Rezeptionssteuerung: Adressatenbezug, Gliederung des Textes und sprachlich-stilistische Gestaltung (T/M)']},
    { id: 'w4', titel: 'Lesen', beschreibung: ['Aspekte und Elemente organisierender Lesetechniken: Textaufbau, strukturmarkierende Hinweise, Text-Mindmap oder Text-Netzwerkkarte, Randnotizen (L)']},
    { id: 'w5', titel: 'pragmatische Texte', beschreibung: ['Merkmale und Funktionen von Sachtexten: Forumsbeitrag? (T/M)', 'Merkmale und Funktionen journalistischer Texte: Ticker, Anzeige, Meldung, Nachricht, Kommentar, Reportage, Interview und Leserbrief, Rezension (T/M)', 'Kriterien der Qualitätsbewertung von Texten: Glaubwürdigkeit der Autorschaft, Medium der Veröffentlichung (T/M)', 'Stilschichten: gehoben, normalsprachlich']},
    { id: 'w6', titel: 'Textanalyse', beschreibung: ['Aufbau und sprachliche Gestaltung der Inhaltsangabe (S)', 'Merkmale der Personencharakteristik, Charakteristik literarischer Figuren (S)', 'Merkmale und Funktionen von Elementen der Texterschließung: Stoff und Motiv (T/M)', 'Funktion und Wirkung sprachkünstlerischer Gestaltungsmittel: Hyperbel, Ellipse, Anapher, rhetorische Frage, Parallelismus, Wortwahl, Sprachklang und Rhythmus (T/M)', 'handschriftliche und digitale Möglichkeiten der Planung, Konzeption, Produktion und Überarbeitung von Texten (S)', 'Aspekte einer Textuntersuchung (S)']},
    { id: 'w7', titel: 'Lyrik', beschreibung: ['gattungstypische Merkmale lyrischer Texte: lyrische Situation, Gestus und lyrisches Bild']},
    { id: 'w7', titel: 'Epik', beschreibung: ['gattungs- und genretypische Merkmale von Kalendergeschichte, Anekdote und Novelle (T/M)', 'Strukturelemente epischer Texte in ihrer funktionalen Bedeutung: Haupt- und Nebenfigur, Komplikationen der Handlungsträger, äußere Handlung und inneres Geschehen, Rahmen und Binnenerzählung, Erzählperspektive (personal, auktorial), Sichtweise des Erzählers (Außensicht, Innensicht) sowie Erzählhaltung (T/M)']},
    { id: 'w7', titel: 'Drama', beschreibung: ['gattungs- und genretypische Merkmale dramatischer Texte: Akt/Aufzug, Szene/Auftritt, Szenenfolge und Nebentext (T/M)', 'Strukturelemente dramatischer Texte in ihren funktionalen Bedeutungen: Thematik, Handlung, Monolog, Dialog, Konflikt und Figurenkonstellation (T/M)']},
    { id: 'w7', titel: 'Rechtschreibung / Grammatik', beschreibung: ['Bildung und Funktion der Modi des Verbs: Indikativ, Konjunktiv I und II sowie Imperativ (SG)'] },
    ],
    '9': [
    { id: 'w1', titel: 'Sprachhandlungen', beschreibung: ['Analysieren und Interpretieren, Erörtern, Referieren (S/Z)'] },
    { id: 'w2', titel: 'textgebundene Erörterung', beschreibung: ['Merkmale einer Diskussion: Diskussionsbeitrag und Diskussionsleitung, Gesprächsphase (S/Z)', 'Aufbau, Struktur und Formen der freien Erörterung: lineare und dialektische Argumentation (S)', 'Strategien der Beeinflussung in Texten (T/M)', 'zwischen Intention und Gestaltung des Textes (T/M)', 'von Texten: Übereinstimmung'] },
    { id: 'w3', titel: 'Bewerbung', beschreibung: ['Merkmale eines Vorstellungsgespräches (S/Z)', 'Formen und Merkmale standardisierter Texte: Lebenslauf und Bewerbung (S)'] },
    { id: 'w4', titel: 'Textanalyse', beschreibung: ['Merkmale von Analyse und Interpretation (S)', 'Regeln der Zitiertechnik (S)', 'Funktion und Wirkung von Wort-, Satz- und Gedankenfiguren: Antithese, Chiasmus, Klimax und Neologismus (T/M)'] },
    { id: 'w5', titel: 'Epik', beschreibung: ['Merkmale und Funktionen der Zeitgestaltung: Zeitdehnung, Zeitdeckung, Zeitraffung; chronologisches und achronologisches Erzählen (T/M)'] },
    { id: 'w6', titel: 'Dramatik', beschreibung: ['Merkmale und Funktionen von Elementen der Texterschließung: Personenverzeichnis, Rollenbiografie, Subtext und Alter-Ego-Technik (T/M)'] },
    { id: 'w7', titel: 'Sprachschulung', beschreibung: ['Stilfärbungen: scherzhaft, vertraulich, ironisch, abwertend und verhüllend (SG)'] },
    ],
    '10': [
    { id: 'w1', titel: 'Redeanalyse', beschreibung: ['Strategien und Techniken des Redeaufbaus (S/Z)', 'Strategien des Argumentierens und Appellierens (S/Z)', 'Funktionen paraverbaler Mittel (S/Z)', 'Sprachhandlungen: Appellieren, Modalisieren, Konzedieren, Positionieren (S/Z)', 'Aspekte der Redeanalyse: Anlass, Redesituation, Argumentationsansatz und Argumentationsstruktur (T/M)'] },
    { id: 'w2', titel: 'textgebundene Erörterung', beschreibung: ['Aufbau, Struktur und Gestaltungsmittel'] },
    { id: 'w3', titel: 'materialgestütztes Schreiben', beschreibung: ['Kriterien der Qualitätsbewertung von Texten: Expertise der Autorschaft, Veröffentlichungskontext (T/M)', 'lexikalische und syntaktische Mittel des Appellierens, Modalisierens, Konzedierens (SG)'] },
    { id: 'w4', titel: 'Formen der Interpretation', beschreibung: ['textimmanent, textextern; linear, aspektorientiert (S)'] },
    { id: 'w5', titel: 'Wort-, Satz- und Gedankenfiguren', beschreibung: ['Allegorie, Akkumulation, Correctio, Euphemismus, Inversion, Ironie,Oxymoron, Paradoxon und Symbol (T/M)'] },
    { id: 'w6', titel: 'Strukturelemente', beschreibung: ['Handlungsverlauf, Figurenkonstellation, Konflikt sowie Konfliktgestaltung (T/M)'] },
    { id: 'w7', titel: 'Werk im Kontext seiner Literaturepoche', beschreibung: [] },
    ],
  };

const SINNABSCHNITTE = [
  {
    kompetenzen: {
      "5/6": "- Sinnabschnitt als individuellen Gliederungsteil verstehen<br />-	Selektionsmechanismen ausprobieren (wie finde ich eine angemessene Anzahl an Sinnabschnitten? z.B. an Figuren oder an Strophen orientiert)",
      "7/8": "-	Sinnabschnitte für Verschriftlichung nutzen können (insbesondere für Inhaltsangabe)<br />-	Anzahlsetzung verstehen (ca. 3-5)",
      "9/10": "-	Verständnis für verschiedene Funktionen im Aufsatz verstehen<br />-	Selektion auch bei variabler Textlänge angemessen einsetzen"
    }
  }
];
const GENERALISIERUNG = [
  {
    kompetenzen: {
      "5/6": "-	Fokus auf Kürze und Präzision",
      "7/8": "-	Sinnabschnitte im Rahmen des Gesamttextes verallgemeinern",
      "9/10": "-	Verallgemeinerung der Sinnabschnitte und Funktionen"
    }
  }
];
const KONKRETISIERUNG = [
  {
    kompetenzen: {
      "5/6": "-	W-Fragen kennen und ansetzen",
      "7/8": "-	Reduktion von konkreten Informationen<br />-	Inbezugsetzen zur Generalisierung",
      "9/10": "-	+ eindeutiger Zusammenhang angesetzten Funktion"
    }
  }
];
const WORTWAHL = [
  {
    kompetenzen: {
      "5/6": "-	Wortschatz ausbauen (Fokus auf Verben, Substantive, Adjektive<br />-	Arbeit mit Synonymen",
      "7/8": "-	Vertiefung Wortschatzarbeit (besonders Fachsprache)<br />-	Sprachstil des Textes verstehen und den Anforderungen der Aufgabenstellung entsprechend schreiben",
      "9/10": "-	Vertiefung Wortschatz (bes. wissenschaftliche Terminologie)<br />-	Sprachstil des Textes verstehen und in angemessener Art und Weise innerhalb der eigenen Sprache professionell umsetzen (z.B. Einsatz direkter Zitate)"
    }
  }
];
const ZUSAMMENFASSUNG = [
  {
    kompetenzen: {
      "5/6": "-	Zusammenfassung Inhalt ohne gehäufte Wiederholung, keine Beurteilung, keine neuen inhaltlichen Ergebnisse",
      "7/8": "-	Eigene Erkenntnisse verallgemeinern (Zsf.)",
      "9/10": "-	Bezug zum Akzent der Hinführung und/ der Hypothese (roter Faden)"
    }
  }
  // Mehr Kompetenzen nach Bedarf
];

// Hilfsfunktion zum Initialisieren der Sequenzfelder für einen Jahrgang
const initializeSequenzfelder = () =>
  Array.from({ length: 12 }, (_, i) => ({
    id: `s${i + 1}`,
    titel: `Sequenz ${i + 1}`,
    items: []
  }));

function SequenzfeldDetailPage({ sequenzfelder, jahrgang }) {
  const { sequenzId } = useParams();
  const navigate = useNavigate();

  // Zugriff auf die Sequenzfelder des aktuellen Jahrgangs
  const currentJahrgangSequenzfelder = sequenzfelder[jahrgang] || [];
  const feld = currentJahrgangSequenzfelder.find(f => f.id === sequenzId);

  if (!feld) {
    return <div>Sequenzfeld nicht gefunden.</div>;
  }

  const kompetenzKarten = (feld.items || []).filter(i => i.type === 'KOMPETENZ_KARTE');
  const wissensBestaende = (feld.items || []).filter(i => i.type === 'WISSENSBESTAND');

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
                  {k.rasterDaten[0] && Object.keys(k.rasterDaten[0].kompetenzen).map(key => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {k.rasterDaten.map((reihe, i) => (
                  <tr key={i}>
                    {Object.values(reihe.kompetenzen).map((text, idx) => (
                      <td key={idx}  dangerouslySetInnerHTML={{ __html: text }}></td>
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
                        <li key={index}>{desc}</li>
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
    { id: 'k1', titel: 'SINNABSCHNITTE', rasterDaten: SINNABSCHNITTE },
    { id: 'k2', titel: 'GENERALISIERUNG', rasterDaten: GENERALISIERUNG },
    { id: 'k3', titel: 'KONKRETISIERUNG', rasterDaten: KONKRETISIERUNG },
    { id: 'k4', titel: 'VERWENDUNG EIGENER WORTWAHL', rasterDaten: WORTWAHL },
    { id: 'k5', titel: 'ZUSAMMENFASSUNG', rasterDaten: ZUSAMMENFASSUNG }
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

  const undoLastAction = () => {
    if (historyIndex > -1) {
      const previousState = history.current[historyIndex];
      setAllSequenzfelder(previousState);
      setHistoryIndex(prevIndex => historyIndex - 1);
    }
  };

  // Funktion zum Ändern des ausgewählten Jahrgangs
  const handleJahrgangChange = (event) => {
    setSelectedJahrgang(event.target.value);
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
            />
          } />
          <Route
            path="/sequenz/:sequenzId"
            element={
              <SequenzfeldDetailPage
                sequenzfelder={allSequenzfelder} // Übergibt alle Sequenzfelder, da die Detailseite den Jahrgang nicht direkt kennt
                jahrgang={selectedJahrgang} // Übergibt den aktuellen Jahrgang an die Detailseite
              />
            }
          />
        </Routes>
      </DndProvider>
    </HashRouter>
  );
}

function MainPage({ kompetenzen, wissensbestaende, sequenzfelder, addItemToSequenzfeld, canUndo, undoLastAction, resetSequenzfelder, selectedJahrgang, onJahrgangChange }) {
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