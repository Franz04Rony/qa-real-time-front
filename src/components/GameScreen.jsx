import React, { useState, useEffect } from 'react';

function GameScreen({ socket, gameState, myId }) {
    const [answer, setAnswer] = useState('');
    const [submittedLocally, setSubmitted] = useState(false);
    const submitted = submittedLocally || gameState.answers?.[myId] !== undefined;

    // Reset local state on new round
    useEffect(() => {
        setSubmitted(false);
        setAnswer('');
    }, [gameState.round]);

    const handleSubmit = () => {
        if (answer.trim()) {
            socket.emit('submit_answer', answer);
            setSubmitted(true);
        }
    };

    const otherPlayerId = Object.keys(gameState.players).find(id => id !== myId);
    const otherPlayer = gameState.players[otherPlayerId];

    return (
        <div className="glass-card">
            {/* Single text node: browser translators wrap text nodes and React crashes removing them */}
            <div className="timer">{`${gameState.timer ?? ''}s`}</div>
            <h2>Ronda {gameState.round} / {gameState.maxRounds}</h2>

            <div style={{ margin: '2rem 0' }}>
                <p className="question-text">
                    {gameState.currentQuestion}
                </p>
                <small>(Piensa: ¿Qué respondería {otherPlayer ? otherPlayer.name : 'el otro'}?)</small>
            </div>

            {!submitted ? (
                <form className="action-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Escribe tu respuesta..."
                        enterKeyHint="send"
                    />
                    <button type="submit">Listo</button>
                </form>
            ) : (
                <div className="animate-pulse">
                    <h3>¡Respuesta enviada!</h3>
                    <p>Esperando al otro jugador...</p>
                </div>
            )}
        </div>
    );
}

export default GameScreen;
