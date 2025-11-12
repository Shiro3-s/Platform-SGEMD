# import mysql.connector as msql
# from mysql.connector import Error 

# connection = None
# cursor = None

# try:
#     # Establecer conexión con MySQL
#     connection = msql.connect(
#         host="localhost",
#         port="3306",
#         user="root",
#         password=""
#     )

#     if connection.is_connected():
#         cursor = connection.cursor()
        
#         cursor.execute("CREATE DATABASE IF NOT EXISTS DB_SEGMED")
#         cursor.execute("USE DB_SEGMED")
#         print("Base de datos seleccionada exitosamente.")
        
#         # Verificar si la tabla Usuarios existe
#         cursor.execute("""
#             SELECT COUNT(*) 
#             FROM information_schema.tables 
#             WHERE table_schema = 'DB_SEGMED' 
#             AND table_name = 'Usuarios'
#         """)
#         table_exists = cursor.fetchone()[0] > 0

#         if table_exists:
#             # Verificar si la columna Password existe
#             cursor.execute("""
#                 SELECT COUNT(*) 
#                 FROM information_schema.columns 
#                 WHERE table_schema = 'DB_SEGMED'
#                 AND table_name = 'Usuarios'
#                 AND column_name = 'Password'
#             """)
#             password_exists = cursor.fetchone()[0] > 0

#             if not password_exists:
#                 # Agregar la columna Password
#                 cursor.execute("""
#                     ALTER TABLE Usuarios
#                     ADD COLUMN Password VARCHAR(255) NOT NULL DEFAULT ''
#                 """)
#                 print("Columna Password agregada exitosamente a la tabla Usuarios.")
#             else:
#                 print("La columna Password ya existe en la tabla Usuarios.")
#         else:
#             print("La tabla Usuarios no existe. Por favor, ejecute primero init_db.py")

# except Error as e:
#     print("Error al conectarse a MySQL:", e)
    
# finally:
#     if connection and connection.is_connected():
#         if cursor:
#             cursor.close()
#         connection.close()
#         print("Conexión cerrada con la base de datos.")

import mysql.connector as msql
from mysql.connector import Error

def add_password_and_verification_fields():
    connection = None
    cursor = None

    try:
        # 🔹 Conectar con MySQL
        connection = msql.connect(
            host="localhost",
            port="3306",
            user="root",
            password=""
        )

        if connection.is_connected():
            cursor = connection.cursor()

            # 🔹 Crear base de datos si no existe
            cursor.execute("CREATE DATABASE IF NOT EXISTS DB_SEGMED")
            cursor.execute("USE DB_SEGMED")
            print("✅ Base de datos 'DB_SEGMED' seleccionada correctamente.\n")

            # 🔹 Verificar si la tabla Usuarios existe
            cursor.execute("""
                SELECT COUNT(*)
                FROM information_schema.tables
                WHERE table_schema = 'DB_SEGMED'
                AND table_name = 'Usuarios'
            """)
            table_exists = cursor.fetchone()[0] > 0

            if not table_exists:
                print("⚠️ La tabla 'Usuarios' no existe. Ejecuta primero 'init_db.py'.")
                return

            # =============================
            # 🔹 Campo Password (si no existe)
            # =============================
            cursor.execute("""
                SELECT COUNT(*)
                FROM information_schema.columns
                WHERE table_schema = 'DB_SEGMED'
                AND table_name = 'Usuarios'
                AND column_name = 'Password'
            """)
            password_exists = cursor.fetchone()[0] > 0

            if not password_exists:
                cursor.execute("""
                    ALTER TABLE Usuarios
                    ADD COLUMN Password VARCHAR(255) NOT NULL DEFAULT ''
                """)
                print("🟢 Columna 'Password' agregada correctamente.")
            else:
                print("ℹ️ La columna 'Password' ya existe.")

            # =============================
            # 🔹 Campo Verificado (nuevo)
            # =============================
            cursor.execute("""
                SELECT COUNT(*)
                FROM information_schema.columns
                WHERE table_schema = 'DB_SEGMED'
                AND table_name = 'Usuarios'
                AND column_name = 'Verificado'
            """)
            verificado_exists = cursor.fetchone()[0] > 0

            if not verificado_exists:
                cursor.execute("""
                    ALTER TABLE Usuarios
                    ADD COLUMN Verificado TINYINT(1) NOT NULL DEFAULT 0
                """)
                print("🟢 Columna 'Verificado' agregada correctamente.")
            else:
                print("ℹ️ La columna 'Verificado' ya existe.")

            # Guardar cambios
            connection.commit()
            print("\n✅ Actualización de la tabla 'Usuarios' completada con éxito.")

    except Error as e:
        print("❌ Error al conectarse o modificar MySQL:", e)

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
            print("🔒 Conexión cerrada correctamente.")


if __name__ == "__main__":
    add_password_and_verification_fields()
