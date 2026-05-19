# SGEMD - Sistema de Gestion de Emprendimiento Minuto de Dios

SGEMD es una plataforma web para la gestion y seguimiento de emprendimientos educativos. La aplicacion esta dividida en frontend (React) y backend (Node.js + Express), con base de datos MySQL.

## Tecnologias

- Frontend: React 19, React Router, Bootstrap, Recharts
- Backend: Node.js 18, Express, JWT, bcrypt
- Base de datos: MySQL 8
- Orquestacion local: Docker Compose

## Estructura general

```
Platform-SGEMD/
├── docker-compose.yml
├── NodeBack/
│   ├── src/
│   │   ├── app.js
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   ├── database/
│   └── uploads/
└── ReactFront/
    ├── public/
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        ├── routes/
        └── api.js
```

## Rutas principales (frontend)

- Publico: `/` (login/registro)
- Admin: `/admin`, `/admin/perfil`, `/admin/eventos`
- Maestro: `/maestro`, `/maestro/perfil`, `/maestro/asesorias`
- Estudiante: `/estudiante`, `/estudiante/perfil`, `/estudiante/eventos`

## Endpoints principales (backend)

- Auth: `POST /segmed/users/login`, `GET /segmed/users/me`
- Usuarios: `GET /segmed/users`, `PUT /segmed/users/:id`
- Emprendimientos: `GET /segmed/entrepreneurship`
- Asesorias: `GET /segmed/advice`
- Eventos: `GET /segmed/event`, `POST /segmed/event`
- Tareas: `GET /segmed/tareas/mis-tareas`, `GET /segmed/tareas/avance/usuario`

## Inicializacion con Docker

```bash
docker compose up -d --build
```

Los scripts de base de datos se ejecutan automaticamente:

- `NodeBack/database/schema.sql`
- `NodeBack/database/init.sql`

## Variables de entorno

Backend (`NodeBack/.env`):

- `PORT`
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`

Frontend (`ReactFront/.env`):

- `REACT_APP_API_URL`

## Notas

- Los roles del sistema son: Administrador, Emprendedor, Asesor.
- El menu superior incluye acceso a perfil y cierre de sesion.
- El sistema usa JWT para proteccion de rutas.
