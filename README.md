# 🍺 Drunker Party Game

A pass-and-play party game collection for the browser — no extra devices needed, just one phone and a group of friends. Built with React + Vite.

## Games

- **🕵️ Word Imposter** — Everyone gets a secret word except the Spy, who only knows the category. Give clues, vote, catch the Spy.
- **🥃 Truth or Shot** — Configurable truth-or-drink game with difficulty tiers (Easy / Normal / Brutal / Secret), progression modes, and an optional drink-tracking leaderboard.
- **🤙 Never Have I Ever** — Coming soon.

## Getting Started

```bash
npm install
npm run dev
```

Open the printed local URL on your phone or laptop and pass the device around.

### Other scripts

```bash
npm run build    # production build
npm run preview  # preview the production build locally
npm run lint      # run ESLint
```

## Project Structure

```
src/
├── App.jsx                    # Screen routing (home → setup → game)
├── utils/
│   └── shuffle.js              # Shared shuffle helper
├── data/
│   ├── wordImposterWords.js    # Word Imposter word bank
│   └── truthOrShotQuestions.js # Truth or Shot question bank
└── components/
    ├── shared/                 # Reused across every game
    │   ├── HomeScreen.jsx       # Game picker
    │   ├── ConfirmModal.jsx     # Restart/Exit confirmation
    │   └── shared.css           # Generic shells: buttons, cards, modals, etc.
    ├── wordImposter/
    │   ├── WordImposterSetup.jsx
    │   ├── WordImposterGame.jsx
    │   └── wordImposter.css
    └── truthOrShot/
        ├── TruthOrShotSetup.jsx
        ├── TruthOrShotGame.jsx
        └── truthOrShot.css
```

## Adding a New Game

Each game follows the same pattern:

1. Add a data file under `src/data/` if the game needs content (words, questions, prompts).
2. Create a folder under `src/components/<gameName>/` with `<GameName>Setup.jsx`, `<GameName>Game.jsx`, and `<gameName>.css`.
3. Reuse the shared classes in `shared.css` (`.container`, `.btn-primary`, `.reveal-card`, `.progress-dots`, `.end-screen`, `.modal-overlay`, etc.) — only add game-specific class names to the new CSS file.
4. Register the game in `HomeScreen.jsx`'s `games` array (set `available: true` once it's playable).
5. Wire up routing in `App.jsx` alongside the existing games.

## Tech Stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- Plain CSS (no framework) — neon/glassmorphism theme shared across all games
