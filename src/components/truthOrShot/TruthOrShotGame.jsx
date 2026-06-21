import { useState } from "react";
import { QUESTIONS } from "../../data/truthOrShotQuestions";
import { shuffle } from "../../utils/shuffle";
import ConfirmModal from "../shared/ConfirmModal";
import "./truthOrShot.css";

const TIER_BADGE = {
  easy: "🟢 Easy",
  normal: "🟡 Normal",
  brutal: "🔴 Brutal",
};

function buildQueue(settings) {
  const { progressionMode, fixedTier, questionCount } = settings;

  let ordered;
  if (progressionMode === "sequential") {
    ordered = ["easy", "normal", "brutal", "secret"].flatMap((tier) =>
      shuffle(QUESTIONS.filter((q) => q.tier === tier))
    );
  } else if (progressionMode === "fixed") {
    ordered = shuffle(QUESTIONS.filter((q) => q.tier === fixedTier));
  } else {
    ordered = shuffle(QUESTIONS.filter((q) => q.tier !== "secret"));
  }

  return ordered.slice(0, questionCount);
}

function buildPlayerOrder(players, playerSequence) {
  return playerSequence === "randomize" ? shuffle(players) : players;
}

export default function TruthOrShotGame({ players, settings, onExit, onRestart }) {
  const [queue] = useState(() => buildQueue(settings));
  const [playerOrder] = useState(() => buildPlayerOrder(players, settings.playerSequence));
  const [phase, setPhase] = useState("reveal"); // 'reveal' | 'end'
  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [modal, setModal] = useState(null); // 'exit' | 'restart'
  const [stats, setStats] = useState(() =>
    Object.fromEntries(players.map((p) => [p, { answered: 0, drank: 0 }]))
  );

  const total = queue.length;
  const currentQuestion = queue[currentIdx];
  const currentPlayer = playerOrder[currentIdx % playerOrder.length];

  const handleReveal = () => setRevealed(true);

  const advance = () => {
    if (currentIdx < total - 1) {
      setRevealed(false);
      setCurrentIdx((i) => i + 1);
    } else {
      setPhase("end");
    }
  };

  const handleHonorAdvance = () => advance();

  const handleTrack = (action) => {
    setStats((prev) => ({
      ...prev,
      [currentPlayer]: {
        ...prev[currentPlayer],
        [action]: prev[currentPlayer][action] + 1,
      },
    }));
    advance();
  };

  const showBadge = settings.showHint && currentQuestion && currentQuestion.tier !== "secret";

  const leaderboard = Object.entries(stats)
    .map(([name, s]) => ({ name, ...s }))
    .sort((a, b) => b.drank - a.drank);

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
            text="Questions will be reshuffled. Start fresh?"
            onConfirm={onRestart}
            onCancel={() => setModal(null)}
            confirmLabel="Restart"
            confirmClass="btn-green"
          />
        )}
        <div className="container">
          <div className="game-header">
            <div className="game-title-small neon-red">🥃 TRUTH OR SHOT</div>
            <div className="header-btns">
              <button className="icon-btn" onClick={() => setModal("restart")}>
                ↺ Restart
              </button>
              <button className="icon-btn danger" onClick={() => setModal("exit")}>
                ✕ Exit
              </button>
            </div>
          </div>

          <div className="end-screen">
            <div className="end-title neon-yellow">🎉 That's a Wrap!</div>
            <div className="end-subtitle">
              Everyone survived {total} round{total === 1 ? "" : "s"}.
              <br />
              Hope you still remember your own name.
            </div>

            {settings.drinkTrackingMode === "track" && (
              <div className="tos-leaderboard">
                {leaderboard.map((p, i) => (
                  <div className="tos-leaderboard-row" key={p.name}>
                    <span className="tos-leaderboard-name">
                      {i === 0 && p.drank > 0 ? "🏆 " : ""}
                      {p.name}
                    </span>
                    <span className="tos-leaderboard-stats">
                      ✅ {p.answered} &nbsp; 🍺 {p.drank}
                    </span>
                  </div>
                ))}
                {leaderboard[0] && leaderboard[0].drank > 0 && (
                  <div className="tos-biggest-drinker">
                    🏆 Biggest Drinker: {leaderboard[0].name}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="instructions-box">
            <h3>📋 How to Play</h3>
            <ul>
              <li>Pass the device to the player whose turn it is.</li>
              <li>Reveal the question, then answer truthfully — or take a shot.</li>
              <li>Brutal and Secret questions hit harder. No mercy.</li>
            </ul>
          </div>

          <div className="btn-row">
            <button className="btn-primary btn-green" onClick={onRestart}>
              ↺ Play Again
            </button>
            <button className="btn-primary btn-ghost" onClick={onExit}>
              🏠 Home
            </button>
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
          text="Questions will be reshuffled. Restart?"
          onConfirm={onRestart}
          onCancel={() => setModal(null)}
          confirmLabel="Restart"
          confirmClass="btn-green"
        />
      )}

      <div className="container">
        <div className="game-header">
          <div className="game-title-small neon-red">🥃 TRUTH OR SHOT</div>
          <div className="header-btns">
            <button className="icon-btn" onClick={() => setModal("restart")}>
              ↺ Restart
            </button>
            <button className="icon-btn danger" onClick={() => setModal("exit")}>
              ✕ Exit
            </button>
          </div>
        </div>

        <div className="progress-dots" style={{ marginBottom: 24 }}>
          {queue.map((_, i) => (
            <div
              key={i}
              className={`dot ${i < currentIdx ? "done" : i === currentIdx ? "current" : ""}`}
            />
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            color: "var(--muted)",
            fontSize: 12,
            letterSpacing: 3,
            marginBottom: 20,
            textTransform: "uppercase",
          }}
        >
          Round {currentIdx + 1} of {total}
        </div>

        <div className={`reveal-card ${currentQuestion.tier === "secret" && revealed ? "tos-secret-card" : ""}`}>
          <div className="player-turn-label">It's your turn</div>
          <div className="player-turn-name">{currentPlayer}</div>

          {!revealed ? (
            <>
              {showBadge && (
                <div className={`tos-tier-badge ${currentQuestion.tier}`}>
                  {TIER_BADGE[currentQuestion.tier]}
                </div>
              )}
              <div className="tos-question-hidden">
                🔒 &nbsp; Tap below to reveal the question &nbsp; 🔒
              </div>
              <button className="btn-primary btn-red" onClick={handleReveal}>
                👁 Reveal Question
              </button>
            </>
          ) : (
            <>
              <div className={`tos-question-wrap ${currentQuestion.tier}`}>
                {currentQuestion.tier === "secret" && (
                  <div className="tos-secret-label">⚠️ SECRET QUESTION ⚠️</div>
                )}
                <div className={`tos-question-text ${currentQuestion.tier}`}>
                  {currentQuestion.text}
                </div>
              </div>

              {settings.drinkTrackingMode === "track" ? (
                <div className="btn-row">
                  <button className="btn-primary btn-green" onClick={() => handleTrack("answered")}>
                    ✅ Answered
                  </button>
                  <button className="btn-primary btn-red" onClick={() => handleTrack("drank")}>
                    🍺 Drank
                  </button>
                </div>
              ) : (
                <button className="btn-primary btn-yellow" onClick={handleHonorAdvance}>
                  Answer or Drink 🍺
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
