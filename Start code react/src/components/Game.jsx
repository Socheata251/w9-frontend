import React, { useState } from "react";

// ----------------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------------------------------------

// Generate a random value in the range [min, max)
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Create an attack log
function createLogAttack(isPlayer, damage) {
  return {
    isPlayer: isPlayer,
    isDamage: true,
    text: ` takes ${damage} damages`,
  };
}

// Create a healing log
function createLogHeal(healing) {
  return {
    isPlayer: true,
    isDamage: false,
    text: ` heal ${healing} life points`,
  };
}

function Game() {
  // ----------------------------------------------------------------------------------------------------------
  // STATES & VARIABLES
  // ----------------------------------------------------------------------------------------------------------

  const [playerHP, setPlayerHP]   = useState(100); 
  const [monsterHP, setMonsterHP] = useState(100); 
  const [turn, setTurn]           = useState(0);   
  const [logs, setLogs]           = useState([]); 
  const isGameOver = playerHP <= 0 || monsterHP <= 0;
  const gameResult =
    playerHP <= 0 && monsterHP <= 0 ? "draw" :
    monsterHP <= 0                  ? "win"  :
    playerHP  <= 0                  ? "lose" : null;
  const specialReady = turn > 0 && turn % 3 === 0;

  // ----------------------------------------------------------------------------------------------------------
  // BUTTONS EVENT FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------
  function clampHP(value) {
    return Math.max(0, Math.min(100, value));
  }
  function addLogs(newEntries) {
    setLogs((prev) => [...prev, ...newEntries].slice(-50));
  }
  function monsterAttack(currentPlayerHP) {
    const dmg = getRandomValue(8, 20);
    setPlayerHP(clampHP(currentPlayerHP - dmg));
    return createLogAttack(false, dmg); 
  }
  function handleAttack() {
    const dmg        = getRandomValue(5, 15);
    const newMonHP   = clampHP(monsterHP - dmg);
    const playerLog  = createLogAttack(true, dmg); 

    setMonsterHP(newMonHP);
    setTurn((t) => t + 1);

    if (newMonHP > 0) {
      const monsterLog = monsterAttack(playerHP);
      addLogs([playerLog, monsterLog]);
    } else {
      addLogs([playerLog]);
    }
  }

  function handleSpecial() {
    const dmg       = getRandomValue(12, 25);
    const newMonHP  = clampHP(monsterHP - dmg);
    const playerLog = createLogAttack(true, dmg);

    setMonsterHP(newMonHP);
    setTurn((t) => t + 1);

    if (newMonHP > 0) {
      const monsterLog = monsterAttack(playerHP);
      addLogs([playerLog, monsterLog]);
    } else {
      addLogs([playerLog]);
    }
  }

  function handleHeal() {
    const healing    = getRandomValue(10, 20);
    const newPlHP    = clampHP(playerHP + healing);
    const healLog    = createLogHeal(healing);

    setPlayerHP(newPlHP);         
    const monsterLog = monsterAttack(newPlHP); 
    addLogs([healLog, monsterLog]);
    setTurn((t) => t + 1);
  }


  function handleSurrender() {
    setPlayerHP(0);
    addLogs([{ isPlayer: true, isDamage: true, text: " gave up and died." }]);
    setTurn((t) => t + 1);
  }

  function handleNewGame() {
    setPlayerHP(100);
    setMonsterHP(100);
    setTurn(0);
    setLogs([]);
  }

  // ----------------------------------------------------------------------------------------------------------
  // JSX FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------

  function renderHealthBar(label, hp) {
    return (
      <section className="container">
        <h2>{label} Health</h2>
        <div className="healthbar">
          <div
            className="healthbar__value"
            style={{ width: `${hp}%` }}
          />
        </div>
      </section>
    );
  }

  function renderGameOver() {
    if (!isGameOver) return null;
    return (
      <section className="container">
        <h2>Game Over!</h2>
        {gameResult === "win"  && <h3>You won! </h3>}
        {gameResult === "lose" && <h3>You lost! </h3>}
        {gameResult === "draw" && <h3>It's a draw! </h3>}
        <button onClick={handleNewGame}>Start New Game</button>
      </section>
    );
  }

  function renderControls() {
    if (isGameOver) return null;
    return (
      <section id="controls">
        <button onClick={handleAttack}>ATTACK</button>
        <button onClick={handleSpecial} disabled={!specialReady}>
          SPECIAL {specialReady ? "!" : `(${3 - (turn % 3)} turns)`}
        </button>
        <button onClick={handleHeal}>HEAL</button>
        <button onClick={handleSurrender}>KILL YOURSELF</button>
      </section>
    );
  }

  function renderLogs() {
    return (
      <section id="log" className="container">
        <h2>Battle Log</h2>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>
              <span className={log.isPlayer ? "log--player" : "log--monster"}>
                {log.isPlayer ? "Player" : "Monster"}
              </span>
              <span className={log.isDamage ? "log--damage" : "log--heal"}>
                {log.text}
              </span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  // ----------------------------------------------------------------------------------------------------------
  // MAIN TEMPLATE
  // ----------------------------------------------------------------------------------------------------------
  return (
    <>
      {renderHealthBar("Monster", monsterHP)}
      {renderHealthBar("Your", playerHP)}
      {renderGameOver()}
      {renderControls()}
      {renderLogs()}
    </>
  );
}

export default Game;