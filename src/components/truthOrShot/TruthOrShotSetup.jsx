import { useState } from "react";
import { QUESTIONS } from "../../data/truthOrShotQuestions";
import "./truthOrShot.css";

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 10;
const DEFAULT_COUNT = 5;
const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20, 25, 30, 40, 50, "All"];

function tiersForProgression(progressionMode, difficulties) {
  const ordered = ["easy", "normal", "brutal"].filter((t) => difficulties.includes(t));
  if (progressionMode === "sequential") return [...ordered, "secret"];
  return ordered;
}

function availableCount(progressionMode, difficulties) {
  const tiers = tiersForProgression(progressionMode, difficulties);
  return QUESTIONS.filter((q) => tiers.includes(q.tier)).length;
}

export default function TruthOrShotSetup({ onStart, onBack }) {
  const [count, setCount] = useState(DEFAULT_COUNT);
  const [names, setNames] = useState(Array(DEFAULT_COUNT).fill(""));

  const [difficulties, setDifficulties] = useState(["easy"]); // subset of 'easy' | 'normal' | 'brutal'
  const [showHint, setShowHint] = useState("hide"); // 'show' | 'hide'
  const [progressionMode, setProgressionMode] = useState("randomize"); // 'randomize' | 'sequential'
  const [questionCount, setQuestionCount] = useState(10);
  const [playerSequence, setPlayerSequence] = useState("sequential"); // 'sequential' | 'randomize'
  const [drinkTrackingMode, setDrinkTrackingMode] = useState("honor"); // 'honor' | 'track'

  const handleCountChange = (n) => {
    setCount(n);
    setNames((prev) => {
      const next = [...prev];
      while (next.length < n) next.push("");
      return next.slice(0, n);
    });
  };

  const handleName = (i, val) => {
    setNames((prev) => {
      const n = [...prev];
      n[i] = val;
      return n;
    });
  };

  const toggleDifficulty = (tier) => {
    setDifficulties((prev) =>
      prev.includes(tier) ? prev.filter((t) => t !== tier) : [...prev, tier]
    );
  };

  const allFilled = names.every((n) => n.trim().length > 0);
  const hasDifficulty = difficulties.length > 0;
  const canStart = allFilled && hasDifficulty;

  const countsAvail = [];
  for (let i = MIN_PLAYERS; i <= MAX_PLAYERS; i++) countsAvail.push(i);

  const maxAvailable = availableCount(progressionMode, difficulties);
  const requestedCount = questionCount === "All" ? maxAvailable : questionCount;
  const cappedCount = Math.min(requestedCount, maxAvailable);
  const isCapped = requestedCount > maxAvailable;

  const handleSubmit = () => {
    onStart({
      players: names.map((n) => n.trim()),
      settings: {
        difficulties,
        showHint: showHint === "show",
        progressionMode,
        questionCount: cappedCount,
        playerSequence,
        drinkTrackingMode,
      },
    });
  };

  return (
    <div className="container">
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="setup-game-title neon-red">🥃 TRUTH OR SHOT</div>
      <div style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>
        Configure the rules before the chaos begins.
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

      <div className="divider" />

      <div className="section-title">— Game Settings —</div>

      <div className="input-group">
        <label className="input-label">Difficulty Selection</label>
        <div className="tos-option-row">
          {["easy", "normal", "brutal"].map((tier) => (
            <button
              key={tier}
              className={`tos-tier-btn ${tier} ${difficulties.includes(tier) ? "active" : ""}`}
              onClick={() => toggleDifficulty(tier)}
            >
              {tier === "easy" ? "🟢 Easy" : tier === "normal" ? "🟡 Normal" : "🔴 Brutal"}
            </button>
          ))}
        </div>
        {!hasDifficulty && (
          <div className="tos-hint-note">Select at least one difficulty to continue.</div>
        )}
      </div>

      <div className="input-group">
        <label className="input-label">Difficulty Hint Display</label>
        <div className="tos-option-row">
          <button
            className={`tos-option-btn ${showHint === "hide" ? "active" : ""}`}
            onClick={() => setShowHint("hide")}
          >
            🙈 Hide Hint
          </button>
          <button
            className={`tos-option-btn ${showHint === "show" ? "active" : ""}`}
            onClick={() => setShowHint("show")}
          >
            👁 Show Hint
          </button>
        </div>
        <div className="tos-hint-note">Secret-tier questions never show a hint, even in Show Hint mode.</div>
      </div>

      <div className="input-group">
        <label className="input-label">Question Progression Mode</label>
        <div className="tos-option-row">
          <button
            className={`tos-option-btn ${progressionMode === "randomize" ? "active" : ""}`}
            onClick={() => setProgressionMode("randomize")}
          >
            🎲 Randomize
          </button>
          <button
            className={`tos-option-btn ${progressionMode === "sequential" ? "active" : ""}`}
            onClick={() => setProgressionMode("sequential")}
          >
            📈 Easy to Brutal
          </button>
        </div>

        {progressionMode === "sequential" && (
          <div className="tos-hint-note">
            Order follows your selected difficulties, low to high, then Secret as the final stretch.
          </div>
        )}
      </div>

      <div className="input-group">
        <label className="input-label">Number of Questions</label>
        <div className="player-count-row">
          {QUESTION_COUNT_OPTIONS.map((n) => (
            <button
              key={n}
              className={`count-btn tos-count-btn ${questionCount === n ? "active" : ""}`}
              onClick={() => setQuestionCount(n)}
            >
              {n}
            </button>
          ))}
        </div>
        {isCapped && (
          <div className="tos-cap-notice">
            Only {maxAvailable} question{maxAvailable === 1 ? "" : "s"} available for this setting —
            capped to {maxAvailable}.
          </div>
        )}
      </div>

      <div className="input-group">
        <label className="input-label">Player Sequence</label>
        <div className="tos-option-row">
          <button
            className={`tos-option-btn ${playerSequence === "sequential" ? "active" : ""}`}
            onClick={() => setPlayerSequence("sequential")}
          >
            ➡️ Sequential
          </button>
          <button
            className={`tos-option-btn ${playerSequence === "randomize" ? "active" : ""}`}
            onClick={() => setPlayerSequence("randomize")}
          >
            🔀 Randomize
          </button>
        </div>
      </div>

      <div className="input-group">
        <label className="input-label">Drink Tracking Mode</label>
        <div className="tos-option-row">
          <button
            className={`tos-option-btn ${drinkTrackingMode === "honor" ? "active" : ""}`}
            onClick={() => setDrinkTrackingMode("honor")}
          >
            🤝 Honor System
          </button>
          <button
            className={`tos-option-btn ${drinkTrackingMode === "track" ? "active" : ""}`}
            onClick={() => setDrinkTrackingMode("track")}
          >
            📊 Track Mode
          </button>
        </div>
      </div>

      <button className="btn-primary btn-red" disabled={!canStart} onClick={handleSubmit}>
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
            : "Select at least one difficulty to continue"}
        </div>
      )}
    </div>
  );
}
