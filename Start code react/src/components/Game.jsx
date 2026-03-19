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

  // ============================================================
  // STATES
  // ============================================================

  const [playerHP,  setPlayerHP]  = useState(100); // player starts with 100 HP
  const [monsterHP, setMonsterHP] = useState(100); // monster starts with 100 HP
  const [turn,      setTurn]      = useState(0);   // counts how many turns passed
  const [logs,      setLogs]      = useState([]);  // list of battle messages

  const isGameOver = playerHP <= 0 || monsterHP <= 0;
  let gameResult = null;
  if (playerHP <= 0 && monsterHP <= 0) {
    gameResult = "draw"; 
  } else if (monsterHP <= 0) {
    gameResult = "win";  
  } else if (playerHP <= 0) {
    gameResult = "lose"; 
  }
  const specialReady = turn > 0 && turn % 3 === 0;
  function clampHP(hp) {
    if (hp < 0)   return 0;   
    if (hp > 100) return 100; 
    return hp;                
  }

  function addLog(message) {
    setLogs(function(oldLogs) {
      return [...oldLogs, message];
    });
  }


  // ============================================================
  // BUTTON FUNCTIONS
  // ============================================================
  function handleAttack() {
 
    const playerDamage = getRandomValue(5, 15);
    const newMonsterHP = clampHP(monsterHP - playerDamage);
    setMonsterHP(newMonsterHP);
    addLog(" Player attacks Monster for " + playerDamage + " damage!");

    if (newMonsterHP > 0) {
      const monsterDamage = getRandomValue(8, 20);
      setPlayerHP(clampHP(playerHP - monsterDamage));
      addLog(" Monster attacks Player for " + monsterDamage + " damage!");
    }

    setTurn(turn + 1);
  }

  function handleSpecial() {
    const playerDamage = getRandomValue(12, 25);
    const newMonsterHP = clampHP(monsterHP - playerDamage);
    setMonsterHP(newMonsterHP);
    addLog(" Player uses SPECIAL for " + playerDamage + " damage!");
    if (newMonsterHP > 0) {
      const monsterDamage = getRandomValue(8, 20);
      setPlayerHP(clampHP(playerHP - monsterDamage));
      addLog("Monster attacks Player for " + monsterDamage + " damage!");
    }
    setTurn(turn + 1);
  }
  function handleHeal() {
    const healAmount  = getRandomValue(10, 20);
    const newPlayerHP = clampHP(playerHP + healAmount);
    setPlayerHP(newPlayerHP);
    addLog("Player heals for " + healAmount + " HP!");

    const monsterDamage = getRandomValue(8, 20);
    setPlayerHP(clampHP(newPlayerHP - monsterDamage));
    addLog(" Monster attacks Player for " + monsterDamage + " damage!");
    setTurn(turn + 1);
  }

  function handleSurrender() {
    setPlayerHP(0);
    addLog(" Player gave up!");
  }
  function handleNewGame() {
    setPlayerHP(100);
    setMonsterHP(100);
    setTurn(0);
    setLogs([]);
  }


  // ============================================================
  //JSX
  // ============================================================
  return (
    <>
      <section className="container">
        <h2>Monster Health</h2>
        <div className="healthbar">
          <div className="healthbar__value" style={{ width: monsterHP + "%" }} />
        </div>
      </section>

      <section className="container">
        <h2>Your Health</h2>
        <div className="healthbar">
      
          <div className="healthbar__value" style={{ width: playerHP + "%" }} />
        </div>
      </section>
      {isGameOver && (
        <section className="container">
          <h2>Game Over!</h2>
          {gameResult === "win"  && <h3>You won! </h3>}
          {gameResult === "lose" && <h3>You lost! </h3>}
          {gameResult === "draw" && <h3>It's a draw! </h3>}
          <button onClick={handleNewGame}>Start New Game</button>
        </section>
      )}

      {!isGameOver && (
        <section id="controls">
          <button onClick={handleAttack}>ATTACK</button>

         
          <button onClick={handleSpecial} disabled={!specialReady}>
            {specialReady ? "SPECIAL !" : "SPECIAL (not ready)"}
          </button>

          <button onClick={handleHeal}>HEAL</button>
          <button onClick={handleSurrender}>KILL YOURSELF</button>
        </section>
      )}

      <section id="log" className="container">
        <h2>Battle Log</h2>
        <ul>
          {logs.map(function(message, index) {
            return <li key={index}>{message}</li>;
          })}
        </ul>
      </section>

    </>
  );
}

export default Game;