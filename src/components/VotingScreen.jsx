import React, { useState } from 'react';

function VotingScreen({ socket, gameState, myId }) {
    const [voted, setVoted] = useState(false);

    const otherPlayerId = Object.keys(gameState.players).find(id => id !== myId);
    const otherPlayer = gameState.players[otherPlayerId];
    const myAnswer = gameState.answers[myId];
    const otherAnswer = gameState.answers[otherPlayerId];

    const handleVote = (isCorrect) => {
        socket.emit('vote_answer', isCorrect);
        setVoted(true);
    };

    return (
        <div className="glass-card">
            <h2>Votación</h2>
            <p>Decide si la respuesta de <strong>{otherPlayer?.name}</strong> coincide con la realidad.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', margin: '2rem 0', textAlign: 'left' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '10px' }}>
                    <h3>Tu Respuesta:</h3>
                    <p style={{ color: 'var(--secondary)', fontSize: '1.3rem' }}>"{myAnswer}"</p>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '10px' }}>
                    <h3>Respuesta de {otherPlayer?.name}:</h3>
                    <p style={{ color: 'var(--primary)', fontSize: '1.3rem' }}>"{otherAnswer}"</p>
                </div>
            </div>

            {!voted ? (
                <div>
                    <p>¿Es correcta la respuesta de {otherPlayer?.name}?</p>
                    <div className="voting-section">
                        <button className="vote-btn correct" onClick={() => handleVote(true)}>CORRECTA (+1)</button>
                        <button className="vote-btn incorrect" onClick={() => handleVote(false)}>INCORRECTA (0)</button>
                    </div>
                </div>
            ) : (
                <h3>Voto enviado. Esperando resultado...</h3>
            )}
        </div>
    );
}

export default VotingScreen;
