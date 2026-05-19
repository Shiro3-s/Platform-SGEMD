import mysql.connector as msql
from mysql.connector import Error 
from datetime import datetime

try:
    connection = msql.connect(
        host="localhost",
        port="3306",
        user="root",
        password="",
        database="DB_SGEMD"
    )

    if connection.is_connected():
        cursor = connection.cursor()
        
        # Asegurar que existe el rol de administrador
        cursor.execute("""
            INSERT IGNORE INTO Roles (idRoles, Nombre, FechaCreacion, FechaActualizacion)
            VALUES (1, 'Administrador', %s, %s)
        """, (datetime.now(), datetime.now()))
        
        # Verificar si ya existe el usuario admin
        admin_email = "admin24@sgemd.com"
        admin_password = "Admin2024!"

        cursor.execute("SELECT idUsuarios FROM Usuarios WHERE CorreoInstitucional = %s", (admin_email,))
        existing = cursor.fetchone()
        
        if existing:
            print("⚠️  El usuario administrador ya existe con ID:", existing[0])
            print("📧 Correo:", admin_email24)
            print("🔑 Contraseña:", admin_password)
        else:
            # Obtener el siguiente ID disponible
            cursor.execute("SELECT COALESCE(MAX(idUsuarios), 0) + 1 FROM Usuarios")
            next_id = cursor.fetchone()[0]
            
            # Hash de la contraseña 'Admin2024!' generado con bcrypt
            password_hash = "$2b$10$dl4gNCLsWRImRD3b13BP2OhVijMSf1VuxlNMvBuiTr22G1JTuE2cG"
            
            # Insertar usuario administrador
            cursor.execute("""
                INSERT INTO Usuarios (
                    idUsuarios,
                    Nombre,
                    CorreoInstitucional,
                    Password,
                    Verificado,
                    Roles_idRoles1,
                    Estado,
                    FechaCreacion,
                    FechaActualizacion
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                next_id,
                'Administrador SGEMD',
                admin_email,
                password_hash,
                1,  # Verificado
                1,  # Rol Admin
                1,  # Estado Activo
                datetime.now(),
                datetime.now()
            ))
            
            connection.commit()
            
            print("✅ Usuario administrador creado exitosamente!")
            print("=" * 50)
            print("📧 Correo:", admin_email)
            print("🔑 Contraseña:", admin_password)
            print("=" * 50)
            print("⚠️  IMPORTANTE: Cambia esta contraseña después del primer login")
        
except Error as e:
    print("❌ Error al conectarse a MySQL:", e)
    
finally:
    if connection and connection.is_connected():
        cursor.close()
        connection.close()
        print("\n✅ Conexión cerrada con la base de datos.")
