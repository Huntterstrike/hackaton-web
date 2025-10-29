import React, { useState } from "react";
import "../App.css";

const phases = [
  {
    title: "Fase 1: La Caça (Attack)",
    subtitle: "La teva Missió: Infiltrar, Explorar, Descobrir.",
    description: `Cada equip comença amb una Raspberry Pi idèntica i un únic punt d'accés: la xarxa. Estàs a cegues. El teu objectiu és auditar el sistema des de fora, com ho faria un atacant real. No hi ha pistes, no hi ha manuals. Només tu contra la màquina.

Hauràs d'escannejar la xarxa, enumerar serveis, analitzar l'aplicació web allotjada i exprimir cada bit d'informació per trobar fallades. Una injecció SQL? Credencials per defecte? Un servei desactualitzat? Cada vulnerabilitat que descobreixis i documentis és una clau que t'acosta a la victòria i una debilitat que hauràs de recordar.

El Repte: Operar en mode black-box per trobar i documentar totes les escletxes de seguretat possibles.

La Clau: Metodologia, creativitat i una ment retorçada.

En el món digital, el número cinc marca el ritme: cinc intents, cinc passos, cinc senyals. Presta atenció a la freqüència.`
  },
  {
    title: "Fase 2: La Fortalesa (Patch)",
    subtitle: "La teva Missió: Parchejar, Fortificar, Sobreviure.",
    description: `Canvi de papers! Ara se't donen les claus del regne: accés d'administrador a la teva pròpia Raspberry Pi. Amb la llista de vulnerabilitats que vas trobar a la fase anterior, el teu equip ha de córrer contra rellotge per segellar cada esquerda i construir una defensa impenetrable.

És el moment de demostrar que no només saps trencar, sinó també construir. Neteja aquest codi, reforça aquestes contrasenyes, actualitza aquests serveis i configura aquest tallafocs com si la teva vida en depengués. Perquè a la següent fase, ho farà. Cada pegat que apliquis serà posat a prova pels millors.

El Repte: Utilitzar la intel·ligència obtinguda per remediar totes les vulnerabilitats i anticipar els moviments de l'enemic.

La Clau: Eficiència, coneixement tècnic i treball en equip sota pressió.

Com un far en la nit, cinc destells guien a qui sap mirar més enllà del vel. No tot és el que sembla a simple vista; la veritable fortalesa està a descobrir allò que altres passen per alt.`
  },
  {
    title: "Fase 3: La Guerra (Capture the Flag)",
    subtitle: "La teva Missió: Hackejar, Dominar, Conquerir.",
    description: `Aquí és on tot esclata. Totes les Raspberry Pi —les vostres, ara "assegurades"— es connecten a una única xarxa de batalla. Comença la guerra total. L'objectiu és simple i brutal: llançar atacs contra els dispositius dels altres equips per capturar les flags (banderes) que amaguen.

Cada flag robada suma punts crucials. Cada segon que el teu sistema resisteix és una petita victòria. Confies en els pegats que vas aplicar? Més et val, perquè tots els teus rivals coneixen les mateixes debilitats que tu vas trobar. És un camp de batalla obert on només l'equip més ràpid, estratègic i complet s'alçarà amb la victòria.

El Repte: Dominar la xarxa i capturar totes les flags possibles.

La Clau: Velocitat, estratègia i atenció als petits detalls.

Cinc tocs discrets en el guardià del coneixement obriran la porta a un joc secret. T'atreveixes a descobrir-ho?`
  }
];

export default function Phases() {
  const [openIndex, setOpenIndex] = useState(null);

  const togglePhase = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="phases" aria-label="Fases de l'esdeveniment amb pistes ocultes">
      {phases.map(({ title, subtitle, description }, i) => (
        <div
          key={i}
          className="phase"
          onClick={() => togglePhase(i)}
          style={{ cursor: "pointer", userSelect: "none" }}
          aria-expanded={openIndex === i}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              togglePhase(i);
            }
          }}
        >
          <h2>{title}</h2>
          {subtitle && (
            <h3
              style={{
                fontWeight: "normal",
                fontStyle: "italic",
                marginTop: "-8px",
                marginBottom: "12px"
              }}
            >
              {subtitle}
            </h3>
          )}
          {openIndex === i && (
            <p style={{ whiteSpace: "pre-line", marginTop: "12px", textAlign: "justify" }}>
              {description}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}