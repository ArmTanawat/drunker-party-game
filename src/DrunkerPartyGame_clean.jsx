import { useState, useEffect, useRef } from "react";
import './DrunkerPartyGame.css';

// ── Word bank for Word Imposter ──────────────────────────────────────────────
// Spy only receives "Location" or "Object" — much harder to bluff!
const WORD_PAIRS = [
  // ── LOCATIONS ──
  { normal: "School",          spy: "Location" },
  { normal: "University",      spy: "Location" },
  { normal: "Library",         spy: "Location" },
  { normal: "Temple",          spy: "Location" },
  { normal: "Pub",             spy: "Location" },
  { normal: "Cafe",            spy: "Location" },
  { normal: "Hospital",        spy: "Location" },
  { normal: "Airport",         spy: "Location" },
  { normal: "Market",          spy: "Location" },
  { normal: "Park",            spy: "Location" },
  { normal: "Museum",          spy: "Location" },
  { normal: "Stadium",         spy: "Location" },
  { normal: "Cinema",          spy: "Location" },
  { normal: "Gym",             spy: "Location" },
  { normal: "Supermarket",     spy: "Location" },
  { normal: "Bank",            spy: "Location" },
  { normal: "Church",          spy: "Location" },
  { normal: "Hotel",           spy: "Location" },
  { normal: "Pharmacy",        spy: "Location" },
  { normal: "Police Station",  spy: "Location" },
  { normal: "Train Station",   spy: "Location" },
  { normal: "Prison",          spy: "Location" },
  { normal: "Zoo",             spy: "Location" },
  { normal: "Beach",           spy: "Location" },
  { normal: "Restaurant",      spy: "Location" },
  { normal: "Barbershop",      spy: "Location" },
  { normal: "Nightclub",       spy: "Location" },
  { normal: "Laundromat",      spy: "Location" },
  { normal: "Gas Station",     spy: "Location" },
  { normal: "Post Office",     spy: "Location" },

  // ── OBJECTS ──
  { normal: "Knife",           spy: "Object" },
  { normal: "Pencil",          spy: "Object" },
  { normal: "Backpack",        spy: "Object" },
  { normal: "Umbrella",        spy: "Object" },
  { normal: "Wallet",          spy: "Object" },
  { normal: "Keys",            spy: "Object" },
  { normal: "Bottle",          spy: "Object" },
  { normal: "Fork",            spy: "Object" },
  { normal: "Scissors",        spy: "Object" },
  { normal: "Mirror",          spy: "Object" },
  { normal: "Clock",           spy: "Object" },
  { normal: "Hammer",          spy: "Object" },
  { normal: "Toothbrush",      spy: "Object" },
  { normal: "Glasses",         spy: "Object" },
  { normal: "Lighter",         spy: "Object" },
  { normal: "Notebook",        spy: "Object" },
  { normal: "Charger",         spy: "Object" },
  { normal: "Headphones",      spy: "Object" },
  { normal: "Pillow",          spy: "Object" },
  { normal: "Spoon",           spy: "Object" },
  { normal: "Soap",            spy: "Object" },
  { normal: "Candle",          spy: "Object" },
  { normal: "Rope",            spy: "Object" },
  { normal: "Tape",            spy: "Object" },
  { normal: "Stapler",         spy: "Object" },
  { normal: "Ruler",           spy: "Object" },
  { normal: "Flashlight",      spy: "Object" },
  { normal: "Coin",            spy: "Object" },
  { normal: "Bucket",          spy: "Object" },
  { normal: "Broom",           spy: "Object" },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}



// ── Confirm Modal ─────────────────────────────────────────────────────────────
function ConfirmModal({ title, text, onConfirm, onCancel, confirmLabel = "Confirm", confirmClass = "btn-red" }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{title}</div>
        <div className="modal-text">{text}</div>
        <div className="btn-row">
          <button className="btn-primary btn-ghost" onClick={onCancel}>Cancel</button>
          <button className={`btn-primary ${confirmClass}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ── HOME SCREEN ───────────────────────────────────────────────────────────────
function HomeScreen({ onSelectGame }) {
  const games = [
    {
      id: "wordImposter",
      emoji: "🕵️",
      title: "WORD IMPOSTER",
      desc: "Everyone shares a secret word — except the Spy. Can the crew sniff them out before time's up?",
      tag: "3–12 Players",
      accent: "var(--neon-blue)",
      available: true,
    },
    {
      id: "truthOrShot",
      emoji: "🥃",
      title: "TRUTH OR SHOT",
      desc: "Answer the truth or take the shot. No escape, no mercy. Coming soon...",
      tag: "2–10 Players",
      accent: "var(--neon-red)",
      available: false,
    },
    {
      id: "neverHaveI",
      emoji: "🤙",
      title: "NEVER HAVE I EVER",
      desc: "Classic confessions with a dangerous twist. Coming soon...",
      tag: "3–12 Players",
      accent: "var(--neon-green)",
      available: false,
    },
  ];

  return (
    <div className="container">
      <div className="logo-wrap" style={{ marginBottom: 8 }}>
        <div className="logo-title flicker">
          <span className="neon-red">DRUNKER</span><br />
          <span className="neon-blue">PARTY</span>&nbsp;
          <span className="neon-green">GAME</span>
        </div>
        <div className="logo-sub">🍺 Pass & Play · No Extra Devices 🍺</div>
      </div>

      <div className="divider" />

      <div className="section-title">— Choose Your Poison —</div>

      <div className="games-grid">
        {games.map(g => (
          <div
            key={g.id}
            className={`game-card ${!g.available ? "coming-soon-card" : ""}`}
            style={{ "--accent-a": g.accent }}
            onClick={() => g.available && onSelectGame(g.id)}
          >
            <div className="game-card-accent" />
            <span className="game-card-emoji">{g.emoji}</span>
            <div className="game-card-title">{g.title}</div>
            <div className="game-card-desc">{g.desc}</div>
            <div className="game-card-tag">{g.available ? g.tag : "🔒 Coming Soon"}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "auto", paddingTop: 40, textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: "var(--muted)", textTransform: "uppercase" }}>
          Drink responsibly. Play chaotically.
        </div>
      </div>
    </div>
  );
}

// ── SETUP SCREEN ──────────────────────────────────────────────────────────────
const GAME_META = {
  wordImposter: {
    title: "WORD IMPOSTER",
    color: "neon-blue",
    emoji: "🕵️",
    minPlayers: 3,
    maxPlayers: 12,
    defaultCount: 5,
  },
};

function SetupScreen({ gameId, onStart, onBack }) {
  const meta = GAME_META[gameId];
  const [count, setCount] = useState(meta.defaultCount);
  const [names, setNames] = useState(Array(meta.defaultCount).fill(""));
  const [spyCount, setSpyCount] = useState(1);

  // Max spies = floor(players/2), capped at 3
  const maxSpies = Math.min(Math.floor(count / 2), 3);
  const spyOptions = Array.from({ length: maxSpies }, (_, i) => i + 1);

  const handleCountChange = (n) => {
    setCount(n);
    setNames(prev => {
      const next = [...prev];
      while (next.length < n) next.push("");
      return next.slice(0, n);
    });
    // Clamp spy count if it exceeds new max
    const newMax = Math.min(Math.floor(n / 2), 3);
    setSpyCount(s => Math.min(s, newMax));
  };

  const handleName = (i, val) => {
    setNames(prev => { const n = [...prev]; n[i] = val; return n; });
  };

  const allFilled = names.every(n => n.trim().length > 0);

  const countsAvail = [];
  for (let i = meta.minPlayers; i <= meta.maxPlayers; i++) countsAvail.push(i);

  return (
    <div className="container">
      <button className="back-btn" onClick={onBack}>← Back</button>

      <div className={`setup-game-title ${meta.color}`}>{meta.emoji} {meta.title}</div>
      <div style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>Configure your crew before the game begins.</div>

      <div className="divider" />

      <div className="input-group">
        <label className="input-label">Number of Players</label>
        <div className="player-count-row">
          {countsAvail.map(n => (
            <button key={n} className={`count-btn ${count === n ? "active" : ""}`} onClick={() => handleCountChange(n)}>{n}</button>
          ))}
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">Number of Spies</label>
        <div className="player-count-row">
          {spyOptions.map(n => (
            <button
              key={n}
              className={`count-btn ${spyCount === n ? "active-red" : ""}`}
              onClick={() => setSpyCount(n)}
            >
              {n}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: "var(--muted)", letterSpacing: 1 }}>
          {spyCount === 1
            ? "1 spy lurking among the crew"
            : `${spyCount} spies working as a team — much harder!`}
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">Player Names</label>
        <div className="players-list">
          {names.map((name, i) => (
            <div className="player-input-row" key={i}>
              <span className="player-num">#{i + 1}</span>
              <input
                className="styled-input"
                placeholder={`Player ${i + 1}`}
                value={name}
                onChange={e => handleName(i, e.target.value)}
                maxLength={20}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        className="btn-primary btn-blue"
        disabled={!allFilled}
        onClick={() => onStart({ players: names.map(n => n.trim()), count, spyCount })}
      >
        🎮 Start Game
      </button>

      {!allFilled && (
        <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 12, letterSpacing: 2, marginTop: 10 }}>
          Fill in all player names to continue
        </div>
      )}
    </div>
  );
}

// ── WORD IMPOSTER GAME ────────────────────────────────────────────────────────
function assignRoles(players, spyCount) {
  const wordPair = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];

  // 1. Pick spy indices randomly
  const spyIndices = new Set(shuffle([...Array(players.length).keys()]).slice(0, spyCount));
  const roles = players.map((name, i) => ({
    name,
    isSpy: spyIndices.has(i),
    word: spyIndices.has(i) ? wordPair.spy : wordPair.normal,
    normalWord: wordPair.normal,
    spyWord: wordPair.spy,
  }));

  // 2. Shuffle reveal order so spies aren't predictably first
  return shuffle(roles);
}

function WordImposterGame({ players, spyCount, onExit, onRestart }) {
  const [roles] = useState(() => assignRoles(players, spyCount));
  const [phase, setPhase] = useState("reveal"); // 'reveal' | 'end'
  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [modal, setModal] = useState(null); // 'exit' | 'restart'

  const current = roles[currentIdx];
  const total = roles.length;

  const handleReveal = () => setRevealed(true);
  const handleNext = () => {
    if (currentIdx < total - 1) {
      setRevealed(false);
      setCurrentIdx(i => i + 1);
    } else {
      setPhase("end");
    }
  };

  const [rolesRevealed, setRolesRevealed] = useState(false);
  const [wordRevealed, setWordRevealed] = useState(false);

  if (phase === "end") {
    return (
      <>
        {modal === "exit" && (
          <ConfirmModal
            title="Exit Game?"
            text="You'll return to the main menu. Any current game progress will be lost."
            onConfirm={onExit}
            onCancel={() => setModal(null)}
            confirmLabel="Exit"
          />
        )}
        {modal === "restart" && (
          <ConfirmModal
            title="Restart Game?"
            text="Roles will be reshuffled. Start fresh?"
            onConfirm={onRestart}
            onCancel={() => setModal(null)}
            confirmLabel="Restart"
            confirmClass="btn-green"
          />
        )}
        <div className="container">
          <div className="game-header">
            <div className="game-title-small neon-blue">🕵️ WORD IMPOSTER</div>
            <div className="header-btns">
              <button className="icon-btn" onClick={() => setModal("restart")}>↺ Restart</button>
              <button className="icon-btn danger" onClick={() => setModal("exit")}>✕ Exit</button>
            </div>
          </div>

          <div className="end-screen">
            <div className="end-title neon-yellow">🎉 Roles Assigned!</div>
            <div className="end-subtitle">
              All players have seen their words.<br />
              Now discuss, vote, and catch the spy!
            </div>

            {/* Role list — hidden until toggled */}
            <div className="reveal-toggle-bar" onClick={() => setRolesRevealed(r => !r)}>
              <span>{rolesRevealed ? "🔓 Hide Roles" : "🔒 Reveal Roles"}</span>
              <span className="toggle-arrow">{rolesRevealed ? "▲" : "▼"}</span>
            </div>

            {rolesRevealed && (
              <div className="role-list" style={{ marginTop: 12 }}>
                {roles.map((r, i) => (
                  <div className="role-row" key={i}>
                    <span className="role-name">{r.name}</span>
                    <span className={`role-badge ${r.isSpy ? "spy" : "crewmate"}`}>
                      {r.isSpy ? "🔴 SPY" : "🟢 CREW"}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Word info — hidden until toggled */}
            <div className="reveal-toggle-bar" style={{ marginTop: 10 }} onClick={() => setWordRevealed(w => !w)}>
              <span>{wordRevealed ? "🔓 Hide Word Info" : "🔒 Reveal Word Info"}</span>
              <span className="toggle-arrow">{wordRevealed ? "▲" : "▼"}</span>
            </div>

            {wordRevealed && (
              <div className="word-info-box">
                <div className="word-info-row">
                  <span className="word-info-label">The word was</span>
                  <span className="neon-green" style={{ fontFamily: "Orbitron, sans-serif", fontSize: 18 }}>{roles[0].normalWord}</span>
                </div>
                <div className="word-info-divider" />
                <div className="word-info-row">
                  <span className="word-info-label">Category</span>
                  <span className="neon-blue">{roles[0].spyWord === "Location" ? "📍 Location" : "📦 Object"}</span>
                </div>
                <div className="word-info-divider" />
                <div className="word-info-row">
                  <span className="word-info-label">Spy's only hint</span>
                  <span className="neon-red" style={{ fontFamily: "Orbitron, sans-serif", fontSize: 18 }}>{roles[0].spyWord}</span>
                </div>
              </div>
            )}
          </div>

          <div className="instructions-box">
            <h3>📋 How to Play</h3>
            <ul>
              <li>Everyone got a secret word — except the <span className="neon-red">SPY</span>, who only knows the category.</li>
              <li>Take turns giving ONE clue related to your word. Don't be too obvious!</li>
              <li>After all clues, vote on who you think the <span className="neon-red">SPY</span> is.</li>
              <li>Crew votes out the spy → <span className="neon-green">Crew wins!</span> Wrong vote → <span className="neon-red">Spy wins!</span></li>
              <li>Spy can also win by correctly guessing the real word after being voted out.</li>
            </ul>
          </div>

          <div className="btn-row">
            <button className="btn-primary btn-green" onClick={onRestart}>↺ Play Again</button>
            <button className="btn-primary btn-ghost" onClick={onExit}>🏠 Home</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {modal === "exit" && (
        <ConfirmModal
          title="Exit Game?"
          text="You'll lose all current game progress. Are you sure?"
          onConfirm={onExit}
          onCancel={() => setModal(null)}
          confirmLabel="Exit"
        />
      )}
      {modal === "restart" && (
        <ConfirmModal
          title="Restart Game?"
          text="Everyone's roles will be reshuffled. Restart?"
          onConfirm={onRestart}
          onCancel={() => setModal(null)}
          confirmLabel="Restart"
          confirmClass="btn-green"
        />
      )}

      <div className="container">
        <div className="game-header">
          <div className="game-title-small neon-blue">🕵️ WORD IMPOSTER</div>
          <div className="header-btns">
            <button className="icon-btn" onClick={() => setModal("restart")}>↺ Restart</button>
            <button className="icon-btn danger" onClick={() => setModal("exit")}>✕ Exit</button>
          </div>
        </div>

        <div className="progress-dots" style={{ marginBottom: 24 }}>
          {roles.map((_, i) => (
            <div key={i} className={`dot ${i < currentIdx ? "done" : i === currentIdx ? "current" : ""}`} />
          ))}
        </div>

        <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 12, letterSpacing: 3, marginBottom: 20, textTransform: "uppercase" }}>
          Player {currentIdx + 1} of {total}
        </div>

        <div className="reveal-card">
          <div className="player-turn-label">It's your turn</div>
          <div className="player-turn-name">{current.name}</div>

          {!revealed ? (
            <>
              <div className="word-hidden">🔒 &nbsp; Tap below to reveal your secret word &nbsp; 🔒</div>
              <button className="btn-primary btn-blue" onClick={handleReveal}>
                👁 Reveal My Word
              </button>
              <div style={{ marginTop: 14, fontSize: 12, color: "var(--muted)", letterSpacing: 1 }}>
                Make sure no one else is looking!
              </div>
            </>
          ) : (
            <>
              <div className="word-revealed-wrap">
                <div className="word-label">{current.isSpy ? "You are" : "Secret word"}</div>
                <div className={`word-value ${current.isSpy ? "spy" : "normal"}`}>
                  {current.isSpy ? "🔴 SPY" : current.word}
                </div>
                {current.isSpy ? (
                  <div className="spy-hint">
                    Only hint you get: the word is a&nbsp;
                    <strong style={{ color: "var(--neon-yellow)", fontSize: 15 }}>{current.word}</strong>
                    <br />Bluff your way through — good luck! 😈
                    {roles.filter(r => r.isSpy && r.name !== current.name).length > 0 && (
                      <div className="spy-team-box">
                        <div className="spy-team-label">🤝 Your spy teammate{roles.filter(r => r.isSpy && r.name !== current.name).length > 1 ? "s" : ""}:</div>
                        {roles.filter(r => r.isSpy && r.name !== current.name).map((r, i) => (
                          <div key={i} className="spy-team-name">{r.name}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)", letterSpacing: 1 }}>
                    Category: <span style={{ color: "var(--neon-blue)" }}>
                      {current.spyWord === "Location" ? "📍 Location" : "📦 Object"}
                    </span>
                  </div>
                )}
              </div>

              <button
                className={`btn-primary ${currentIdx < total - 1 ? "btn-green" : "btn-yellow"}`}
                style={currentIdx === total - 1 ? {
                  background: "linear-gradient(135deg, rgba(255,230,0,0.2), rgba(255,230,0,0.08))",
                  border: "1px solid var(--neon-yellow)",
                  color: "var(--neon-yellow)",
                  boxShadow: "0 0 20px rgba(255,230,0,0.2)"
                } : {}}
                onClick={handleNext}
              >
                {currentIdx < total - 1 ? `✓ Done · Pass to ${roles[currentIdx + 1].name}` : "🎉 Everyone's Ready!"}
              </button>
              <div style={{ marginTop: 12, fontSize: 11, color: "var(--muted)", letterSpacing: 1 }}>
                Memorise your word, then pass the device.
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("home"); // home | setup | game
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameConfig, setGameConfig] = useState(null);
  const [gameKey, setGameKey] = useState(0);

  const handleSelectGame = (id) => { setSelectedGame(id); setScreen("setup"); };
  const handleStart = (config) => { setGameConfig(config); setScreen("game"); };
  const handleExit = () => { setScreen("home"); setSelectedGame(null); setGameConfig(null); };
  const handleRestart = () => { setGameKey(k => k + 1); };

  return (
    <>
      <div className="app-root">
        {screen === "home" && <HomeScreen onSelectGame={handleSelectGame} />}
        {screen === "setup" && selectedGame && (
          <SetupScreen gameId={selectedGame} onStart={handleStart} onBack={() => setScreen("home")} />
        )}
        {screen === "game" && selectedGame === "wordImposter" && gameConfig && (
          <WordImposterGame
            key={gameKey}
            players={gameConfig.players}
            spyCount={gameConfig.spyCount}
            onExit={handleExit}
            onRestart={handleRestart}
          />
        )}
      </div>
    </>
  );
}
