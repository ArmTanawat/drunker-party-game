// Homepage — lists every game. Add new games to the `games` array here;
// this file never needs game-specific logic, only metadata for display.
export default function HomeScreen({ onSelectGame }) {
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
      available: true,
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
          <span className="neon-red">DRUNKER</span>
          <br />
          <span className="neon-blue">PARTY</span>&nbsp;
          <span className="neon-green">GAME</span>
        </div>
        <div className="logo-sub">🍺 Pass & Play · No Extra Devices 🍺</div>
      </div>

      <div className="divider" />

      <div className="section-title">— Choose Your Poison —</div>

      <div className="games-grid">
        {games.map((g) => (
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
            <div className="game-card-tag">
              {g.available ? g.tag : "🔒 Coming Soon"}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "auto", paddingTop: 40, textAlign: "center" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 3,
            color: "var(--muted)",
            textTransform: "uppercase",
          }}
        >
          Drink responsibly. Play chaotically.
        </div>
      </div>
    </div>
  );
}
