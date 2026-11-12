import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Lobby from './components/Lobby';
import GameScreen from './components/GameScreen';
import VotingScreen from './components/VotingScreen';
import PunishmentScreen from './components/PunishmentScreen';
import ResultsScreen from './components/ResultsScreen';

// sessionStorage survives reloads but is separate per tab, so two tabs are two players
function getPlayerId() {
  const key = 'qa-player-id';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(key, id);
  }
  return id;
}

const myId = getPlayerId();
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3002', {
  auth: { playerId: myId }
});

function App() {
  const [gameState, setGameState] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
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

    socket.on('notice', (msg) => {
      alert(msg);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('game_state');
      socket.off('timer_update');
      socket.off('game_reset');
      socket.off('error');
      socket.off('notice');
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
  const disconnectedRival = Object.values(gameState.players).find(p => p.id !== myId && !p.connected);
  const canGoBackToLobby = gameState.status !== 'LOBBY' && Boolean(gameState.players[myId]);

  const handleBackToLobby = () => {
    if (window.confirm('¿Volver al lobby? Se terminará la partida actual para los dos.')) {
      socket.emit('back_to_lobby');
    }
  };

  return (
    <div className={`app-container${showScores ? ' has-scores' : ''}`}>
      {disconnectedRival && gameState.status !== 'LOBBY' && (
        <div className="glass-card animate-pulse" style={{ padding: '0.75rem 1rem', marginBottom: '1rem' }}>
          {disconnectedRival.name} se desconectó. Esperando a que vuelva...
        </div>
      )}
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
      {canGoBackToLobby && (
        <button type="button" className="secondary back-to-lobby" onClick={handleBackToLobby}>
          Volver al lobby
        </button>
      )}
    </div>
  );
}

export default App;
