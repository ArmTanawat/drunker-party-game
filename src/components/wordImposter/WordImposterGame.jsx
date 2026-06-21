import { useState } from "react";
import { WORD_PAIRS } from "../../data/wordImposterWords";
import { shuffle } from "../../utils/shuffle";
import ConfirmModal from "../shared/ConfirmModal";
import "./wordImposter.css";

function assignRoles(players, spyCount, categories) {
  const pool = WORD_PAIRS.filter((p) => categories.includes(p.spy));
  const wordPair = pool[Math.floor(Math.random() * pool.length)];

  // 1. Pick spy indices randomly
  const spyIndices = new Set(
    shuffle([...Array(players.length).keys()]).slice(0, spyCount)
  );
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

export default function WordImposterGame({ players, spyCount, categories, onExit, onRestart }) {
  const [roles] = useState(() => assignRoles(players, spyCount, categories));
  const [phase, setPhase] = useState("reveal"); // 'reveal' | 'end'
  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [modal, setModal] = useState(null); // 'exit' | 'restart'
  const [rolesRevealed, setRolesRevealed] = useState(false);
  const [wordRevealed, setWordRevealed] = useState(false);

  const current = roles[currentIdx];
  const total = roles.length;

  const handleReveal = () => setRevealed(true);
  const handleNext = () => {
    if (currentIdx < total - 1) {
      setRevealed(false);
      setCurrentIdx((i) => i + 1);
    } else {
      setPhase("end");
    }
  };

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
              <button className="icon-btn" onClick={() => setModal("restart")}>
                ↺ Restart
              </button>
              <button className="icon-btn danger" onClick={() => setModal("exit")}>
                ✕ Exit
              </button>
            </div>
          </div>

          <div className="end-screen">
            <div className="end-title neon-yellow">🎉 Roles Assigned!</div>
            <div className="end-subtitle">
              All players have seen their words.
              <br />
              Now discuss, vote, and catch the spy!
            </div>

            {/* Role list — hidden until toggled */}
            <div className="reveal-toggle-bar" onClick={() => setRolesRevealed((r) => !r)}>
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
            <div
              className="reveal-toggle-bar"
              style={{ marginTop: 10 }}
              onClick={() => setWordRevealed((w) => !w)}
            >
              <span>{wordRevealed ? "🔓 Hide Word Info" : "🔒 Reveal Word Info"}</span>
              <span className="toggle-arrow">{wordRevealed ? "▲" : "▼"}</span>
            </div>

            {wordRevealed && (
              <div className="word-info-box">
                <div className="word-info-row">
                  <span className="word-info-label">The word was</span>
                  <span
                    className="neon-green"
                    style={{ fontFamily: "Orbitron, sans-serif", fontSize: 18 }}
                  >
                    {roles[0].normalWord}
                  </span>
                </div>
                <div className="word-info-divider" />
                <div className="word-info-row">
                  <span className="word-info-label">Category</span>
                  <span className="neon-blue">
                    {roles[0].spyWord === "Location" ? "📍 Location" : "📦 Object"}
                  </span>
                </div>
                <div className="word-info-divider" />
                <div className="word-info-row">
                  <span className="word-info-label">Spy's only hint</span>
                  <span
                    className="neon-red"
                    style={{ fontFamily: "Orbitron, sans-serif", fontSize: 18 }}
                  >
                    {roles[0].spyWord}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="instructions-box">
            <h3>📋 How to Play</h3>
            <ul>
              <li>
                Everyone got a secret word — except the{" "}
                <span className="neon-red">SPY</span>, who only knows the category.
              </li>
              <li>Take turns giving ONE clue related to your word. Don't be too obvious!</li>
              <li>
                After all clues, vote on who you think the{" "}
                <span className="neon-red">SPY</span> is.
              </li>
              <li>
                Crew votes out the spy → <span className="neon-green">Crew wins!</span>{" "}
                Wrong vote → <span className="neon-red">Spy wins!</span>
              </li>
              <li>Spy can also win by correctly guessing the real word after being voted out.</li>
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
            <button className="icon-btn" onClick={() => setModal("restart")}>
              ↺ Restart
            </button>
            <button className="icon-btn danger" onClick={() => setModal("exit")}>
              ✕ Exit
            </button>
          </div>
        </div>

        <div className="progress-dots" style={{ marginBottom: 24 }}>
          {roles.map((_, i) => (
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
          Player {currentIdx + 1} of {total}
        </div>

        <div className="reveal-card">
          <div className="player-turn-label">It's your turn</div>
          <div className="player-turn-name">{current.name}</div>

          {!revealed ? (
            <>
              <div className="word-hidden">
                🔒 &nbsp; Tap below to reveal your secret word &nbsp; 🔒
              </div>
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
                    <strong style={{ color: "var(--neon-yellow)", fontSize: 15 }}>
                      {current.word}
                    </strong>
                    <br />
                    Bluff your way through — good luck! 😈
                    {roles.filter((r) => r.isSpy && r.name !== current.name).length > 0 && (
                      <div className="spy-team-box">
                        <div className="spy-team-label">
                          🤝 Your spy teammate
                          {roles.filter((r) => r.isSpy && r.name !== current.name).length > 1
                            ? "s"
                            : ""}
                          :
                        </div>
                        {roles
                          .filter((r) => r.isSpy && r.name !== current.name)
                          .map((r, i) => (
                            <div key={i} className="spy-team-name">
                              {r.name}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ marginTop: 10, fontSize: 12, color: "var(--muted)", letterSpacing: 1 }}>
                    Category:{" "}
                    <span style={{ color: "var(--neon-blue)" }}>
                      {current.spyWord === "Location" ? "📍 Location" : "📦 Object"}
                    </span>
                  </div>
                )}
              </div>

              <button
                className={`btn-primary ${currentIdx < total - 1 ? "btn-green" : "btn-yellow"}`}
                style={
                  currentIdx === total - 1
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(255,230,0,0.2), rgba(255,230,0,0.08))",
                        border: "1px solid var(--neon-yellow)",
                        color: "var(--neon-yellow)",
                        boxShadow: "0 0 20px rgba(255,230,0,0.2)",
                      }
                    : {}
                }
                onClick={handleNext}
              >
                {currentIdx < total - 1
                  ? `✓ Done · Pass to ${roles[currentIdx + 1].name}`
                  : "🎉 Everyone's Ready!"}
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
