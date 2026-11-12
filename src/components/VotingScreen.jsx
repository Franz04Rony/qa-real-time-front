import React, { useState } from 'react';

function VotingScreen({ socket, gameState, myId }) {
    const [votedLocally, setVoted] = useState(false);
    const voted = votedLocally || gameState.votes?.[myId] !== undefined;

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

            <div className="answers-compare">
                <div className="answer-card">
                    <h3>Tu Respuesta:</h3>
                    <p style={{ color: 'var(--secondary)', fontSize: '1.3rem' }}>"{myAnswer}"</p>
                </div>
                <div className="answer-card">
                    <h3>Respuesta de {otherPlayer?.name}:</h3>
                    <p style={{ color: 'var(--primary)', fontSize: '1.3rem' }}>"{otherAnswer}"</p>
                </div>
            </div>

            {!voted ? (
                <div>
                    <p>¿Es correcta la respuesta de {otherPlayer?.name}?</p>
                    <div className="voting-section">
                        <button type="button" className="vote-btn correct" onClick={() => handleVote(true)}>CORRECTA (+1)</button>
                        <button type="button" className="vote-btn incorrect" onClick={() => handleVote(false)}>INCORRECTA (0)</button>
                    </div>
                </div>
            ) : (
                <h3>Voto enviado. Esperando resultado...</h3>
            )}
        </div>
    );
}

export default VotingScreen;
