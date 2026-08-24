import React, { useState } from 'react';

function PunishmentScreen({ socket, gameState, myId }) {
    const [done, setDone] = useState(false);

    const losers = gameState.punishmentLosers || [];
    const amILoser = losers.includes(myId);

    const handleDone = () => {
        socket.emit('punishment_done');
        setDone(true);
    };

    return (
        <div className="glass-card" style={{ borderColor: 'var(--primary)' }}>
            <h1 className="solid">¡CASTIGO!</h1>

            <div style={{ fontSize: '1.5rem', margin: '2rem 0' }}>
                {gameState.currentPunishment}
            </div>

            {amILoser ? (
                <div>
                    <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>¡Has fallado! Debes cumplir el castigo.</p>
                    {!done ? (
                        <button onClick={handleDone} style={{ background: 'var(--primary)' }}>¡Listo, lo cumplí!</button>
                    ) : (
                        <p>Esperando a que todos terminen...</p>
                    )}
                </div>
            ) : (
                <div>
                    <p>¡Te salvaste! Disfruta viendo sufrir a tu rival.</p>
                    <p className="animate-pulse">Esperando a que cumplan el castigo...</p>
                </div>
            )}
        </div>
    );
}

export default PunishmentScreen;
