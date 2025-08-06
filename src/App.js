// MultipleFiles/App.js
import React, { useState, useRef, useCallback, useEffect } from 'react';
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
      beschreibung: ['Lesetechniken: Nutzung von Hilfsmitteln für organisierende Lesetechniken: Markierungen, Zwischenüberschriften, Kernsatz, Schlüsselbegriffe, Stichwörter'] },
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
// Inhaltsangabe Kompetenz
const INHALTSANGABE = [
  {
    titel: "SINNABSCHNITTE (INKL. LÄNGE)",
    jahrgaenge: {
      "5/6" : [
        "Sinnabschnitte als individuelle Gliederungsteile verstehen",
        "Selektionsmechanismen ausprobieren (wie finde ich eine angemessene Anzahl an Sinnabschnitten? z.B. an Figuren oder an Strophen orientiert)"
      ],
      "7/8" : [
        "Sinnabschnitte für Verschriftlichung nutzen können (insbesondere für Inhaltsangabe)",
        "Anzahlsetzung verstehen (ca. 3-5)"
      ],
      "9/10" : [
        "Verständnis für verschiedene Funktionen im Aufsatz verstehen",
        "Selektion auch bei variabler Textlänge angemessen einsetzen"
      ]
    }
  },
  {
    titel: "GENERALISIERUNG",
    jahrgaenge: {
      "5/6" : [
        "Fokus auf Kürze und Präzision",
        "Sinnabschnitte im Rahmen des Gesamttextes verallgemeinern"
      ],
      "7/8" : [
        "Sinnabschnitte im Rahmen des Gesamttextes verallgemeinern"
      ],
      "9/10" : [
        "Verallgemeinerung der Sinnabschnitte und Funktionen"
      ]
    }
  },
  {
    titel: "KONKRETISIERUNG",
    jahrgaenge: {
      "5/6" : [
        "W-Fragen kennen und ansetzen"
      ],
      "7/8" : [
        "Reduktion von konkreten Informationen",
        "Inbezugsetzen zur Generalisierung"
      ],
      "9/10" : [
        "+ eindeutiger Zusammenhang angesetzten Funktion"
      ]
    }
  },
  {
    titel: "VERWENDUNG EIGENER WORTWAHL",
    jahrgaenge: {
      "5/6" : [
        "Wortschatz ausbauen (Fokus auf Verben, Substantive, Adjektive",
        "Arbeit mit Synonymen"
      ],
      "7/8" : [
        "Vertiefung Wortschatzarbeit (besonders Fachsprache)",
        "Sprachstil des Textes verstehen und den Anforderungen der Aufgabenstellung entsprechend schreiben"
      ],
      "9/10" : [
        "Vertiefung Wortschatz (bes. wissenschaftliche Terminologie)",
        "Sprachstil des Textes verstehen und in angemessener Art und Weise innerhalb der eigenen Sprache professionell umsetzen (z.B. Einsatz direkter Zitate)"
      ]
    }
  },
];
// Schlussteil Kompetenz
const SCHLUSSTEIL = [
  {
    titel: "ZUSAMMENFASSUNG",
    jahrgaenge: {
      "5/6" : [
        "Zusammenfassung des Inhalts ohne gehäufte Wiederholung",
        "keine Beurteilung, keine neuen inhaltlichen Ergebnisse"
      ],
      "7/8" : [
        "Eigene Erkenntnisse verallgemeinern (Zsf.)"
      ],
      "9/10" : [
        "Bezug zum Akzent der Hinführung und/ der Hypothese (roter Faden)"
      ]
    }
  },
  {
    titel: "SCHLUSSFOLGERUNG",
    jahrgaenge: {
      "5/6" : [
        "Schlussfolgerung als angeleitet",
      ],
      "7/8" : [
        "Ansaätze einer sinnvollen Schlussfolgerung",
      ],
      "9/10" : [
        "Schlussfolgerung in Bezug eines eigenen Akzentes (z.B. Aktualisierung, Historisierung, Politisierung)"
      ]
    }
  }
];

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
