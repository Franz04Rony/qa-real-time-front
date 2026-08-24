import React, { useState, useEffect } from 'react';

function Lobby({ socket, players, myId }) {
    const [nickname, setNickname] = useState('');

    const handleJoin = (event) => {
        event.preventDefault();
        if (nickname.trim()) {
            socket.emit('join_game', nickname);
        }
    };

    const handleStart = () => {
        socket.emit('start_game');
    };

    const playerCount = Object.keys(players).length;
    const iAmJoined = players[myId];
    const canStart = Boolean(iAmJoined) && playerCount === 2;

    useEffect(() => {
        if (!canStart) return;

        const onKeyDown = (event) => {
            if (event.key !== 'Enter' || event.repeat) return;
            event.preventDefault();
            handleStart();
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [canStart, socket]);

    return (
        <div className="glass-card">
            <h1>Quiz Battle 1v1</h1>

            {!iAmJoined ? (
                <form className="action-form" onSubmit={handleJoin}>
                    <p>Ingresa tu Nickname para entrar:</p>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="Nickname"
                        maxLength={15}
                        autoComplete="nickname"
                        enterKeyHint="go"
                    />
                    <button type="submit">Entrar</button>
                </form>
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

                    {canStart && (
                        <button type="button" onClick={handleStart}>INICIAR JUEGO</button>
                    )}
                </div>
            )}
        </div>
    );
}

export default Lobby;
