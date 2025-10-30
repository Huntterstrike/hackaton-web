// src/components/Phases.jsx
import React, { useState } from "react";
import "../style/Phases.css";

const phases = [
  {
    title: "Fase 1: La Caça (Attack)",
    subtitle: "La teva Missió: Infiltrar, Explorar, Descobrir.",
    description: `Cada equip comença amb una Raspberry Pi idèntica i un únic punt d'accés: la xarxa. Estàs a cegues. El teu objectiu és auditar el sistema des de fora, com ho faria un atacant real. No hi ha pistes, no hi ha manuals. Només tu contra la màquina.

Hauràs d'escanejar la xarxa, enumerar serveis, analitzar l'aplicació web allotjada i esprémer cada bit d'informació per trobar fallades. Una injecció SQL? Credencials per defecte? Un servei desactualitzat? Cada vulnerabilitat que descobreixis i documentis és una clau que t'acosta a la victòria i una debilitat que hauràs de recordar.

El Repte: Operar en mode black-box per trobar i documentar totes les escletxes de seguretat possibles.

La Clau: Metodologia, creativitat i una ment retorçada.

En el món digital, el número cinc marca el ritme: cinc intents, cinc passos, cinc senyals. Presta atenció a la freqüència.`
  },
  {
    title: "Fase 2: La Fortalesa (Patch)",
    subtitle: "La teva Missió: Parchejar, Fortificar, Sobreviure.",
    description: `Canvi de papers! Ara se't donen les claus del regne: accés d'administrador a la teva pròpia Raspberry Pi. Amb la llista de vulnerabilitats que vas trobar a la fase anterior, el teu equip ha de córrer contra rellotge per segellar cada esquerda i construir una defensa impenetrable.

És el moment de demostrar que no només saps trencar, sinó també construir. Neteja aquest codi, reforça aquestes contrasenyes, actualitza aquests serveis i configura aquest tallafoc com si la teva vida en depengués. Perquè a la següent fase, ho farà. Cada pegat que apliquis serà posat a prova pels millors.

El Repte: Utilitzar la intel·ligència obtinguda per remeiar totes les vulnerabilitats i anticipar els moviments de l'enemic.

La Clau: Eficiència, coneixement tècnic i treball en equip sota pressió.

Com un far en la nit, cinc centelleigs guien a qui sap mirar més enllà del vel. No tot és el que sembla a simple vista; la veritable fortalesa està a descobrir allò que altres passen per alt.`
  },
  {
    title: "Fase 3: La Guerra (Capture the Flag)",
    subtitle: "La teva Missió: Hackejar, Dominar, Conquerir.",
    description: `Aquí és on tot esclata. Totes les Raspberry Pi —les vostres, ara "assegurades"— es connecten a una única xarxa de batalla. Comença la guerra total. L'objectiu és simple i brutal: llançar atacs contra els dispositius dels altres equips per capturar les flags (banderes) que amaguen.

Cada flag robada suma punts crucials. Cada segon que el teu sistema resisteix és una petita victòria. Confies en els pegats que vas aplicar? Et convé, perquè tots els teus rivals coneixen les mateixes debilitats que tu vas trobar. És un camp de batalla obert on només l'equip més ràpid, estratègic i complet s'alçarà amb la victòria.

El Repte: Dominar la xarxa i capturar totes les flags possibles.

La Clau: Velocitat, estratègia i atenció als petits detalls.

Cinc tocs discrets en el guardià del coneixement obriran la porta a un joc secret. T'atreveixes a descobrir-ho?`
  }
];

export default function Phases() {
  const [openIndex, setOpenIndex] = useState(null);

  const togglePhase = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleKey = (e, i) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      togglePhase(i);
    }
  };

  return (
    <section className="phases" aria-label="Fases de l'esdeveniment amb pistes ocultes">
      {phases.map(({ title, subtitle, description }, i) => {
        // Convertir el bloque de texto en párrafos reales separando por dobles saltos de línea
        const paragraphs = description
          .split(/\n{2,}/)      // separa por una o más líneas en blanco
          .map((p) => p.trim())
          .filter(Boolean);     // elimina posibles entradas vacías

        return (
          <div
            key={i}
            className={`phase ${openIndex === i ? "expanded" : ""}`}
            onClick={() => togglePhase(i)}
            role="button"
            tabIndex={0}
            aria-expanded={openIndex === i}
            onKeyDown={(e) => handleKey(e, i)}
          >
            <h2 className="phase-title">{title}</h2>

            {subtitle && <h3 className="phase-subtitle">{subtitle}</h3>}

            {/* Contenedor de la descripción (siempre en DOM para que traductores la detecten) */}
            <div
              className={`phase-description ${openIndex === i ? "open" : ""}`}
              aria-hidden={openIndex === i ? "false" : "true"}
              lang="ca"
            >
              {paragraphs.map((para, idx) => (
                <p key={idx} className="phase-paragraph">
                  {para}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}