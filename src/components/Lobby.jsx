import React, { useState } from 'react';

function Lobby({ socket, players, myId }) {
    const [nickname, setNickname] = useState('');
    const [hasJoined, setHasJoined] = useState(false);

    const handleJoin = () => {
        if (nickname.trim()) {
            socket.emit('join_game', nickname);
            setHasJoined(true);
        }
    };

    const handleStart = () => {
        socket.emit('start_game');
    };

    const playerCount = Object.keys(players).length;
    const iAmJoined = players[myId];

    return (
        <div className="glass-card">
            <h1>Quiz Battle 1v1</h1>

            {!iAmJoined ? (
                <div>
                    <p>Ingresa tu Nickname para entrar:</p>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="Nickname"
                        maxLength={15}
                    />
                    <br />
                    <button onClick={handleJoin}>Entrar</button>
                </div>
            ) : (
                <div>
                    <h2>¡Esperando jugador!</h2>
                    <div className="animate-pulse">
                        <p>Jugadores conectados: {playerCount}/2</p>
                    </div>
                    <div style={{ margin: '2rem 0' }}>
                        {Object.values(players).map(p => (
                            <div key={p.id} style={{ fontSize: '1.2rem' }}>
                                {p.id === myId ? 'tú: ' : 'rival: '} <strong>{p.name}</strong>
                            </div>
                        ))}
                    </div>

                    {playerCount === 2 && (
                        <button onClick={handleStart}>INICIAR JUEGO</button>
                    )}
                </div>
            )}
        </div>
    );
}

export default Lobby;
