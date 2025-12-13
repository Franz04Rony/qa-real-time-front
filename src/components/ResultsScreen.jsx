import React from 'react';

function ResultsScreen({ socket, gameState }) {
    const players = Object.values(gameState.players);
    const p1 = players[0];
    const p2 = players[1];

    let winner = null;
    if (p1.score > p2.score) winner = p1;
    else if (p2.score > p1.score) winner = p2;
    // else tie

    const handleRestart = () => {
        socket.emit('restart_game');
    };

    return (
        <div className="glass-card">
            <h1>RESULTADOS FINALES</h1>

            <div className="score-board">
                <div style={{ color: 'var(--secondary)' }}>
                    {p1.name}: {p1.score}
                </div>
                <div style={{ color: 'var(--primary)' }}>
                    {p2.name}: {p2.score}
                </div>
            </div>

            <div style={{ margin: '3rem 0' }}>
                {winner ? (
                    <div>
                        <h2>🏆 ¡GANADOR! 🏆</h2>
                        <h1 style={{ fontSize: '4rem' }}>{winner.name}</h1>
                    </div>
                ) : (
                    <h2>⚖️ ¡EMPATE! ⚖️</h2>
                )}
            </div>

            <button onClick={handleRestart}>JUGAR DE NUEVO</button>
        </div>
    );
}

export default ResultsScreen;
