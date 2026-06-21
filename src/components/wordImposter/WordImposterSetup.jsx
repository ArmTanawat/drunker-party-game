import { useState } from "react";
import "./wordImposter.css";

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;
const DEFAULT_COUNT = 5;

const CATEGORIES = ["Location", "Object"];

export default function WordImposterSetup({ onStart, onBack }) {
  const [count, setCount] = useState(DEFAULT_COUNT);
  const [names, setNames] = useState(Array(DEFAULT_COUNT).fill(""));
  const [spyCount, setSpyCount] = useState(1);
  const [categories, setCategories] = useState([...CATEGORIES]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Max spies = floor(players/2), capped at 3
  const maxSpies = Math.min(Math.floor(count / 2), 3);
  const spyOptions = Array.from({ length: maxSpies }, (_, i) => i + 1);

  const handleCountChange = (n) => {
    setCount(n);
    setNames((prev) => {
      const next = [...prev];
      while (next.length < n) next.push("");
      return next.slice(0, n);
    });
    // Clamp spy count if it exceeds new max
    const newMax = Math.min(Math.floor(n / 2), 3);
    setSpyCount((s) => Math.min(s, newMax));
  };

  const handleName = (i, val) => {
    setNames((prev) => {
      const n = [...prev];
      n[i] = val;
      return n;
    });
  };

  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const allFilled = names.every((n) => n.trim().length > 0);
  const hasCategory = categories.length > 0;
  const canStart = allFilled && hasCategory;

  const countsAvail = [];
  for (let i = MIN_PLAYERS; i <= MAX_PLAYERS; i++) countsAvail.push(i);

  return (
    <div className="container">
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="setup-game-title neon-blue">🕵️ WORD IMPOSTER</div>
      <div style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>
        Configure your crew before the game begins.
      </div>

      <div className="divider" />

      <div className="input-group">
        <label className="input-label">Number of Players</label>
        <div className="player-count-row">
          {countsAvail.map((n) => (
            <button
              key={n}
              className={`count-btn ${count === n ? "active" : ""}`}
              onClick={() => handleCountChange(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">Number of Spies</label>
        <div className="player-count-row">
          {spyOptions.map((n) => (
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
                onChange={(e) => handleName(i, e.target.value)}
                maxLength={20}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className="reveal-toggle-bar"
        style={{ marginBottom: 20 }}
        onClick={() => setShowAdvanced((s) => !s)}
      >
        <span>{showAdvanced ? "🔓 Hide Advanced Settings" : "🔒 Advanced Settings"}</span>
        <span className="toggle-arrow">{showAdvanced ? "▲" : "▼"}</span>
      </div>

      {showAdvanced && (
        <div className="input-group">
          <label className="input-label">Category Selection</label>
          <div className="player-count-row">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${categories.includes(cat) ? "active" : ""}`}
                onClick={() => toggleCategory(cat)}
              >
                {cat === "Location" ? "📍 Location" : "📦 Object"}
              </button>
            ))}
          </div>
          {!hasCategory && (
            <div className="wi-hint-note">Select at least one category to continue.</div>
          )}
        </div>
      )}

      <button
        className="btn-primary btn-blue"
        disabled={!canStart}
        onClick={() => onStart({ players: names.map((n) => n.trim()), spyCount, categories })}
      >
        🎮 Start Game
      </button>

      {!canStart && (
        <div
          style={{
            textAlign: "center",
            color: "var(--muted)",
            fontSize: 12,
            letterSpacing: 2,
            marginTop: 10,
          }}
        >
          {!allFilled
            ? "Fill in all player names to continue"
            : "Select at least one category to continue"}
        </div>
      )}
    </div>
  );
}
