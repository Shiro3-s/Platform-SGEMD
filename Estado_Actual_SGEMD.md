# Estado Actual - SGEMD

Este documento resume el estado del proyecto SGEMD, su estructura y el flujo principal de funcionamiento.

## Resumen

- SGEMD es una plataforma web para gestion de emprendimientos educativos.
- Roles principales: Administrador, Emprendedor (Estudiante), Asesor (Maestro).
- Frontend en React y backend en Node.js + Express con MySQL.

## Arquitectura

- Frontend: `ReactFront` (React 19, React Router, Bootstrap, Recharts)
- Backend: `NodeBack` (Express, JWT, bcrypt)
- Base de datos: MySQL 8
- Orquestacion: Docker Compose

## Estructura del repositorio

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

## Flujo principal

1. El usuario inicia sesion en `/`.
2. Se obtiene el perfil actual desde `GET /segmed/users/me`.
3. Se redirige segun rol:
   - Administrador: `/admin`
   - Asesor: `/maestro`
   - Emprendedor: `/estudiante`
4. El frontend usa JWT en `Authorization` para consumir las rutas protegidas.

## Rutas frontend por rol

### Administrador

- `/admin`
- `/admin/perfil`
- `/admin/eventos`
- `/admin/usuarios`

### Asesor

- `/maestro`
- `/maestro/perfil`
- `/maestro/asesorias`
- `/maestro/tareas`

### Emprendedor

- `/estudiante`
- `/estudiante/perfil`
- `/estudiante/eventos`
- `/estudiante/recursos/docentes`
- `/estudiante/recursos/asesorias`

## Endpoints backend principales

- Auth: `POST /segmed/users/login`, `GET /segmed/users/me`
- Usuarios: `GET /segmed/users`, `PUT /segmed/users/:id`
- Emprendimientos: `GET /segmed/entrepreneurship`
- Asesorias: `GET /segmed/advice`
- Eventos: `GET /segmed/event`
- Tareas: `GET /segmed/tareas/mis-tareas`

## Inicializacion de base de datos

Con Docker, MySQL ejecuta automaticamente:

- `NodeBack/database/schema.sql`
- `NodeBack/database/init.sql`

Esto ocurre por el volumen en `docker-compose.yml`.

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

## Componentes clave

- `AuthContext` controla sesion, token y roles.
- `PrivateRoute` protege rutas por rol.
- Sidebars por rol: `AdminSidebar`, `SidebarMaestro`, `EstudianteSidebar`.
- Perfiles por rol con edicion y avatar.

## Notas de operacion

- El menu superior incluye perfil y cierre de sesion.
- Los eventos visibles al estudiante se filtran por estado y datos validos.
- Los perfiles usan avatar por defecto si no hay imagen.
