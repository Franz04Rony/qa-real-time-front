import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Lobby from './components/Lobby';
import GameScreen from './components/GameScreen';
import VotingScreen from './components/VotingScreen';
import PunishmentScreen from './components/PunishmentScreen';
import ResultsScreen from './components/ResultsScreen';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001');

function App() {
  const [gameState, setGameState] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [myId, setMyId] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      setMyId(socket.id);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('game_state', (state) => {
      setGameState(state);
    });

    socket.on('timer_update', (time) => {
      setGameState(prev => ({ ...prev, timer: time }));
    });

    socket.on('game_reset', (msg) => {
      alert(msg);
      window.location.reload();
    });

    socket.on('error', (msg) => {
      alert(msg);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('game_state');
      socket.off('timer_update');
      socket.off('game_reset');
      socket.off('error');
    };
  }, []);

  if (!isConnected) return <div className="glass-card"><h1>Connecting...</h1></div>;

  if (!gameState) return <div className="glass-card"><h1>Loading Game State...</h1></div>;

  const renderScreen = () => {
    switch (gameState.status) {
      case 'LOBBY':
        return <Lobby socket={socket} players={gameState.players} myId={myId} />;
      case 'QUESTION':
        return <GameScreen socket={socket} gameState={gameState} myId={myId} />;
      case 'VOTING':
        return <VotingScreen socket={socket} gameState={gameState} myId={myId} />;
      case 'PUNISHMENT':
        return <PunishmentScreen socket={socket} gameState={gameState} myId={myId} />;
      case 'RESULTS':
        return <ResultsScreen socket={socket} gameState={gameState} />;
      default:
        return <div>Unknown State: {gameState.status}</div>;
    }
  };

  const showScores = gameState && Object.keys(gameState.players).length > 0 && gameState.status !== 'LOBBY';

  return (
    <div className={`app-container${showScores ? ' has-scores' : ''}`}>
      {showScores && (
        <div className="score-overlay">
          {Object.values(gameState.players).map(p => (
            <div key={p.id} className="score-item">
              <span>{p.name}:</span>
              <strong>{p.score}</strong>
            </div>
          ))}
        </div>
      )}
      {renderScreen()}
    </div>
  );
}

export default App;
