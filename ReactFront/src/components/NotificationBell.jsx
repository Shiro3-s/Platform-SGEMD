import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

const bellStyle = {
  position: 'relative',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  transition: 'transform 0.2s ease, filter 0.2s ease',
  width: 34,
  height: 34,
  padding: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function NotificationBell({ role, userId }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  const targetPath = useMemo(() => {
    if (role === 'asesor') return '/maestro/asesorias';
    if (role === 'emprendedor') return '/estudiante/recursos/asesorias';
    return '/admin/docentes/asesorias';
  }, [role]);

  const loadNotifications = async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        apiFetch('/segmed/notifications?limit=10'),
        apiFetch('/segmed/notifications/unread-count'),
      ]);
      setNotifications(Array.isArray(listRes?.data) ? listRes.data : []);
      setUnread(Number(countRes?.data?.total || 0));
    } catch (error) {
      setNotifications([]);
      setUnread(0);
    }
  };

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setUnread(0);
      return undefined;
    }

    loadNotifications();
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const markOneAndOpen = async (item) => {
    try {
      if (!Number(item.Leida)) {
        await apiFetch(`/segmed/notifications/${item.idNotificacion}/read`, { method: 'PUT' });
      }
      await loadNotifications();
    } catch (error) {
      // ignore and continue navigation
    }
    setOpen(false);
    navigate(targetPath);
  };

  const markAllRead = async () => {
    try {
      await apiFetch('/segmed/notifications/read-all', { method: 'PUT' });
      await loadNotifications();
    } catch (error) {
      // ignore
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={containerRef}>
      <button
        type="button"
        style={{
          ...bellStyle,
          transform: unread > 0 ? 'translateY(-1px)' : 'none',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notificaciones"
      >
        <img
          src={hover ? '/img/bell-yellow.svg' : '/img/bell-gray.svg'}
          alt="Notificaciones"
          width={26}
          height={26}
          style={{ display: 'block' }}
        />
        {unread > 0 ? (
          <span
            style={{
              position: 'absolute',
              top: -6,
              right: -10,
              minWidth: 18,
              height: 18,
              borderRadius: '999px',
              background: '#d62828',
              color: '#fff',
              fontSize: '0.7rem',
              lineHeight: '18px',
              textAlign: 'center',
              padding: '0 4px',
              fontWeight: 700,
            }}
          >
            {unread > 99 ? '99+' : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          style={{
            position: 'absolute',
            top: 34,
            right: 0,
            width: 360,
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 10,
            boxShadow: '0 10px 26px rgba(5,21,51,0.18)',
            zIndex: 2000,
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderBottom: '1px solid #eceff4' }}>
            <strong>Notificaciones</strong>
            <button type="button" className="btn btn-sm btn-link" onClick={markAllRead}>Marcar todas</button>
          </div>
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 12, color: '#5b6470' }}>Sin notificaciones por ahora.</div>
            ) : (
              notifications.map((item) => (
                <button
                  key={item.idNotificacion}
                  type="button"
                  onClick={() => markOneAndOpen(item)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    background: Number(item.Leida) ? '#fff' : 'rgba(255,211,0,0.12)',
                    padding: '10px 12px',
                    borderBottom: '1px solid #eceff4',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#162644' }}>{item.Titulo}</div>
                  <div style={{ fontSize: '0.9rem', color: '#40506a' }}>{item.Mensaje}</div>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default NotificationBell;
