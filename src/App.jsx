import { useState } from "react";
import "./components/shared/shared.css";
import HomeScreen from "./components/shared/HomeScreen";
import WordImposterSetup from "./components/wordImposter/WordImposterSetup";
import WordImposterGame from "./components/wordImposter/WordImposterGame";
import TruthOrShotSetup from "./components/truthOrShot/TruthOrShotSetup";
import TruthOrShotGame from "./components/truthOrShot/TruthOrShotGame";

export default function App() {
  const [screen, setScreen] = useState("home"); // home | setup | game
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameConfig, setGameConfig] = useState(null);
  const [gameKey, setGameKey] = useState(0);

  const handleSelectGame = (id) => {
    setSelectedGame(id);
    setScreen("setup");
  };
  const handleStart = (config) => {
    setGameConfig(config);
    setScreen("game");
  };
  const handleExit = () => {
    setScreen("home");
    setSelectedGame(null);
    setGameConfig(null);
  };
  const handleRestart = () => setGameKey((k) => k + 1);
  const handleBack = () => setScreen("home");

  return (
    <div className="app-root">
      {screen === "home" && <HomeScreen onSelectGame={handleSelectGame} />}

      {screen === "setup" && selectedGame === "wordImposter" && (
        <WordImposterSetup onStart={handleStart} onBack={handleBack} />
      )}
      {screen === "setup" && selectedGame === "truthOrShot" && (
        <TruthOrShotSetup onStart={handleStart} onBack={handleBack} />
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
      {screen === "game" && selectedGame === "truthOrShot" && gameConfig && (
        <TruthOrShotGame
          key={gameKey}
          players={gameConfig.players}
          settings={gameConfig.settings}
          onExit={handleExit}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
