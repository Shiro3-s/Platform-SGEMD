// Middleware para autenticación y autorización
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'segmed_jwt_secret_2025'; 

// Verificar que el token sea válido y no haya expirado
exports.authenticateToken = (req, res, next) => {
    // Soportar token en header Authorization: Bearer <token>
    // o en cookie (por ejemplo `token`) cuando el frontend usa credentialed requests
    const authHeader = req.headers['authorization'];
    const cookieToken = req.cookies && req.cookies.token;

    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (cookieToken) {
        token = cookieToken;
    }

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            error: 'Se requiere token de autenticación válido' 
        });
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        // Añadir información del usuario verificado a la request
        req.user = decodedToken;
        next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return res.status(403).json({ 
            success: false, 
            error: 'Token inválido o expirado' 
        });
    }
};

exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'Administrativo') {
        return res.status(403).json({ 
            success: false, 
            error: 'Se requieren permisos de administrador' 
        });
    }
    next();
};

exports.isTeacher = (req, res, next) => {
    if (!req.user || req.user.role !== 'Docente') {
        return res.status(403).json({ 
            success: false, 
            error: 'Se requieren permisos de docente' 
        });
    }
    next();
};

exports.isStudent = (req, res, next) => {
    if (!req.user || req.user.role !== 'Estudiante') {
        return res.status(403).json({ 
            success: false, 
            error: 'Se requieren permisos de estudiante' 
        });
    }
    next();
};