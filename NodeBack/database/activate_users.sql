-- Script para verificar y activar usuarios en la base de datos
-- Ejecuta este script en tu MySQL CLI o cliente

USE DB_SGEMD;

-- Ver todos los usuarios actuales
SELECT idUsuarios, Nombre, CorreoInstitucional, Verificado, Estado FROM Usuarios;

-- Activar todos los usuarios (establecer Verificado = 1 y Estado = 1)
UPDATE Usuarios SET Verificado = 1, Estado = 1 WHERE Verificado = 0 OR Estado = 0;

-- Confirmar cambios
SELECT idUsuarios, Nombre, CorreoInstitucional, Verificado, Estado FROM Usuarios;
