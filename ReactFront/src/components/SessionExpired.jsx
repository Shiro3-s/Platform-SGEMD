import React, { useEffect, useState } from 'react';

export default function SessionExpired() {
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        maxWidth: '400px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '15px' }}>️</div>
        <h3 style={{ color: '#dc3545', marginBottom: '10px' }}>Sesión expirada</h3>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Tu sesión ha expirado por inactividad.<br />
          Serás redirigido al inicio de sesión en <strong>{seconds}</strong> segundos.
        </p>
        <div style={{
          width: '100%',
          height: '4px',
          backgroundColor: '#eee',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${(seconds / 3) * 100}%`,
            height: '100%',
            backgroundColor: '#dc3545',
            transition: 'width 1s linear',
          }} />
        </div>
      </div>
    </div>
  );
}
