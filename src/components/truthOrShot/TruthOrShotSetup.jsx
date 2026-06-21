import { useState } from "react";
import { QUESTIONS } from "../../data/truthOrShotQuestions";
import "./truthOrShot.css";

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 10;
const DEFAULT_COUNT = 5;
const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20, 25, 30, 40, 50, "All"];

function tiersForProgression(progressionMode, fixedTier) {
  if (progressionMode === "sequential") return ["easy", "normal", "brutal", "secret"];
  if (progressionMode === "fixed") return [fixedTier];
  return ["easy", "normal", "brutal"];
}

function availableCount(progressionMode, fixedTier) {
  const tiers = tiersForProgression(progressionMode, fixedTier);
  return QUESTIONS.filter((q) => tiers.includes(q.tier)).length;
}

export default function TruthOrShotSetup({ onStart, onBack }) {
  const [count, setCount] = useState(DEFAULT_COUNT);
  const [names, setNames] = useState(Array(DEFAULT_COUNT).fill(""));

  const [showHint, setShowHint] = useState("show"); // 'show' | 'hide'
  const [progressionMode, setProgressionMode] = useState("randomize"); // 'randomize' | 'sequential' | 'fixed'
  const [fixedTier, setFixedTier] = useState("easy"); // 'easy' | 'normal' | 'brutal'
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

  const allFilled = names.every((n) => n.trim().length > 0);

  const countsAvail = [];
  for (let i = MIN_PLAYERS; i <= MAX_PLAYERS; i++) countsAvail.push(i);

  const maxAvailable = availableCount(progressionMode, fixedTier);
  const requestedCount = questionCount === "All" ? maxAvailable : questionCount;
  const cappedCount = Math.min(requestedCount, maxAvailable);
  const isCapped = requestedCount > maxAvailable;

  const handleSubmit = () => {
    onStart({
      players: names.map((n) => n.trim()),
      settings: {
        showHint: showHint === "show",
        progressionMode,
        fixedTier: progressionMode === "fixed" ? fixedTier : null,
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
        <label className="input-label">Difficulty Hint Display</label>
        <div className="tos-option-row">
          <button
            className={`tos-option-btn ${showHint === "show" ? "active" : ""}`}
            onClick={() => setShowHint("show")}
          >
            👁 Show Hint
          </button>
          <button
            className={`tos-option-btn ${showHint === "hide" ? "active" : ""}`}
            onClick={() => setShowHint("hide")}
          >
            🙈 Hide Hint
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
            📈 Sequential Escalation
          </button>
          <button
            className={`tos-option-btn ${progressionMode === "fixed" ? "active" : ""}`}
            onClick={() => setProgressionMode("fixed")}
          >
            📌 Fixed Level
          </button>
        </div>

        {progressionMode === "fixed" && (
          <div className="tos-option-row" style={{ marginTop: 10 }}>
            {["easy", "normal", "brutal"].map((tier) => (
              <button
                key={tier}
                className={`tos-tier-btn ${tier} ${fixedTier === tier ? "active" : ""}`}
                onClick={() => setFixedTier(tier)}
              >
                {tier === "easy" ? "🟢 Easy" : tier === "normal" ? "🟡 Normal" : "🔴 Brutal"}
              </button>
            ))}
          </div>
        )}

        {progressionMode === "sequential" && (
          <div className="tos-hint-note">
            Order: Easy → Normal → Brutal → Secret. Secret questions only appear in this mode.
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

      <button className="btn-primary btn-red" disabled={!allFilled} onClick={handleSubmit}>
        🎮 Start Game
      </button>

      {!allFilled && (
        <div
          style={{
            textAlign: "center",
            color: "var(--muted)",
            fontSize: 12,
            letterSpacing: 2,
            marginTop: 10,
          }}
        >
          Fill in all player names to continue
        </div>
      )}
    </div>
  );
}
