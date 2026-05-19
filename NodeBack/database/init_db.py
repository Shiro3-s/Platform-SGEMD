import mysql.connector as msql
from mysql.connector import Error

try:
    connection = msql.connect(
        host="localhost", port="3306", user="root", password=""
    )

    if connection.is_connected():
        cursor = connection.cursor()
        cursor.execute("CREATE DATABASE IF NOT EXISTS DB_SGEMD")
        print("Base de datos creada exitosamente o ya existía.")

        cursor.execute("USE DB_SGEMD")

        # Tabla Modulos
        create_Modulos = """
        CREATE TABLE IF NOT EXISTS Modulos (
            idModulos INT NOT NULL AUTO_INCREMENT,
            Asistencia VARCHAR(45) NOT NULL,
            Practicas VARCHAR(45) NOT NULL,
            OpcionGrado VARCHAR(45) NOT NULL,
            FechaCreacion DATE NOT NULL,
            FechaActualizacion DATE NOT NULL,
            PRIMARY KEY (idModulos)
        )
        """
        cursor.execute(create_Modulos)

        # Tabla Municipios
        create_Municipios = """
        CREATE TABLE IF NOT EXISTS Municipios (
            idMunicipio INT NOT NULL,
            Nombre VARCHAR(45) NOT NULL,
            FechaCreacion DATE NOT NULL,
            FechaActualizacion DATE NOT NULL,
            PRIMARY KEY (idMunicipio)
        )
        """
        cursor.execute(create_Municipios)

        # Tabla ProgramaAcademico
        create_ProgramaAcademico = """
        CREATE TABLE IF NOT EXISTS ProgramaAcademico (
            idProgramaAcademico INT NOT NULL AUTO_INCREMENT,
            Nombre VARCHAR(45) NOT NULL,
            FechaCreacion DATE NOT NULL,
            FechaActualizacion DATE NOT NULL,
            PRIMARY KEY (idProgramaAcademico)
        )
        """
        cursor.execute(create_ProgramaAcademico)

        # Tabla Roles
        create_Roles = """
        CREATE TABLE IF NOT EXISTS Roles (
            idRoles INT NOT NULL AUTO_INCREMENT,
            Nombre VARCHAR(45) NOT NULL,
            FechaCreacion DATE NOT NULL,
            FechaActualizacion DATE NOT NULL,
            PRIMARY KEY (idRoles)
        )
        """
        cursor.execute(create_Roles)

        # Tabla TipoDocumentos
        create_TipoDocumentos = """
        CREATE TABLE IF NOT EXISTS TipoDocumentos (
            idTipoDocumento INT NOT NULL AUTO_INCREMENT,
            TipoDocumento VARCHAR(45) NOT NULL,
            FechaCreacion DATE NOT NULL,
            FechaActualizacion DATE NOT NULL,
            PRIMARY KEY (idTipoDocumento)
        )
        """
        cursor.execute(create_TipoDocumentos)

        # Tabla TipoUsuarios
        create_TipoUsuarios = """
        CREATE TABLE IF NOT EXISTS TipoUsuarios (
            idTipoUsuarios INT NOT NULL,
            TipodeUsuario VARCHAR(45) NOT NULL,
            FechaCreacion DATE NOT NULL,
            FechaActualizacion DATE NOT NULL,
            PRIMARY KEY (idTipoUsuarios)
        )
        """
        cursor.execute(create_TipoUsuarios)

        # Tabla CentroUniversitarios
        create_CentroUniversitarios = """
        CREATE TABLE IF NOT EXISTS CentroUniversitarios (
            idCentroUniversitarios INT NOT NULL AUTO_INCREMENT,
            Nombre VARCHAR(45) NOT NULL,
            FechaCreacion DATE NOT NULL,
            FechaActualizacion DATE NOT NULL,
            PRIMARY KEY (idCentroUniversitarios)
        )
        """
        cursor.execute(create_CentroUniversitarios)

        # Tabla TipoPoblacion
        create_TipoPoblacion = """
        CREATE TABLE IF NOT EXISTS TipoPoblacion (
            idTipoPoblacion INT NOT NULL,
            Nombre VARCHAR(45) NOT NULL,
            FechaCreacion DATE NOT NULL,
            FechaActualizacion DATE NOT NULL,
            PRIMARY KEY (idTipoPoblacion)
        )
        """
        cursor.execute(create_TipoPoblacion)

        # Tabla Usuarios con relaciones
        create_Usuarios = """
        CREATE TABLE IF NOT EXISTS Usuarios (
            idUsuarios INT NOT NULL AUTO_INCREMENT,
            Nombre VARCHAR(45) NOT NULL,
            CorreoInstitucional VARCHAR(45) NOT NULL,
            CorreoPersonal VARCHAR(45),
            Verificado TINYINT(1) NOT NULL DEFAULT 0,
            Password VARCHAR(255) NOT NULL,
            Celular VARCHAR(45),
            Telefono VARCHAR(45),
            Direccion VARCHAR(45),
            Genero VARCHAR(45),
            EstadoCivil VARCHAR(45),
            FechaNacimiento DATE,
            Modulos_idModulos INT,
            Municipios_idMunicipio INT,
            ProgramaAcademico_idProgramaAcademico INT,
            Roles_idRoles1 INT,
            TipoDocumentos_idTipoDocumento INT,
            TipoUsuarios_idTipoUsuarios INT,
            ProgramaAcademico_idProgramaAcademico1 INT,
            CentroUniversitarios_idCentroUniversitarios INT,
            Estado TINYINT not null DEFAULT 1,
            Semestre VARCHAR(45),
            Modalidad VARCHAR(45),
            CodigoVerificacion VARCHAR(10),
            CodigoExpiracion DATETIME,
            TipoPoblacion_idTipoPoblacion INT,
            FechaCreacion DATETIME,
            FechaActualizacion DATETIME,
            img_perfil VARCHAR(255),
            PRIMARY KEY (idUsuarios),
            UNIQUE INDEX uq_usuarios_correo (CorreoInstitucional),
            INDEX fk_Usuarios_Modulos_idx (Modulos_idModulos),
            INDEX fk_Usuarios_Municipios1_idx (Municipios_idMunicipio),
            INDEX fk_Usuarios_ProgramaAcademico1_idx (ProgramaAcademico_idProgramaAcademico),
            INDEX fk_Usuarios_Roles2_idx (Roles_idRoles1),
            INDEX fk_Usuarios_TipoDocumentos1_idx (TipoDocumentos_idTipoDocumento),
            INDEX fk_Usuarios_TipoUsuarios1_idx (TipoUsuarios_idTipoUsuarios),
            INDEX fk_Usuarios_ProgramaAcademico2_idx (ProgramaAcademico_idProgramaAcademico1),
            INDEX fk_Usuarios_CentroUniversitarios1_idx (CentroUniversitarios_idCentroUniversitarios),
            INDEX fk_Usuarios_TipoPoblacion1_idx (TipoPoblacion_idTipoPoblacion),
            CONSTRAINT fk_Usuarios_Modulos
                FOREIGN KEY (Modulos_idModulos)
                REFERENCES Modulos (idModulos),
            CONSTRAINT fk_Usuarios_Municipios1
                FOREIGN KEY (Municipios_idMunicipio)
                REFERENCES Municipios (idMunicipio),
            CONSTRAINT fk_Usuarios_ProgramaAcademico1
                FOREIGN KEY (ProgramaAcademico_idProgramaAcademico)
                REFERENCES ProgramaAcademico (idProgramaAcademico),
            CONSTRAINT fk_Usuarios_Roles2
                FOREIGN KEY (Roles_idRoles1)
                REFERENCES Roles (idRoles),
            CONSTRAINT fk_Usuarios_TipoDocumentos1
                FOREIGN KEY (TipoDocumentos_idTipoDocumento)
                REFERENCES TipoDocumentos (idTipoDocumento),
            CONSTRAINT fk_Usuarios_TipoUsuarios1
                FOREIGN KEY (TipoUsuarios_idTipoUsuarios)
                REFERENCES TipoUsuarios (idTipoUsuarios),
            CONSTRAINT fk_Usuarios_ProgramaAcademico2
                FOREIGN KEY (ProgramaAcademico_idProgramaAcademico1)
                REFERENCES ProgramaAcademico (idProgramaAcademico),
            CONSTRAINT fk_Usuarios_CentroUniversitarios1
                FOREIGN KEY (CentroUniversitarios_idCentroUniversitarios)
                REFERENCES CentroUniversitarios (idCentroUniversitarios),
            CONSTRAINT fk_Usuarios_TipoPoblacion1
                FOREIGN KEY (TipoPoblacion_idTipoPoblacion)
                REFERENCES TipoPoblacion (idTipoPoblacion)
        )
        """
        cursor.execute(create_Usuarios)

        create_RegistroPendiente = """
        CREATE TABLE IF NOT EXISTS RegistroPendiente (
            idRegistroPendiente INT NOT NULL AUTO_INCREMENT,
            Nombre VARCHAR(120) NOT NULL,
            CorreoInstitucional VARCHAR(120) NOT NULL,
            PasswordHash VARCHAR(255) NOT NULL,
            CodigoVerificacion VARCHAR(10) NOT NULL,
            CodigoExpiracion DATETIME NOT NULL,
            FechaCreacion DATETIME NOT NULL,
            PRIMARY KEY (idRegistroPendiente),
            UNIQUE INDEX uq_registro_correo (CorreoInstitucional)
        )
        """
        cursor.execute(create_RegistroPendiente)

        # Ajustes para instalaciones existentes
        try:
            cursor.execute("SHOW COLUMNS FROM Usuarios LIKE 'img_perfil'")
            if not cursor.fetchone():
                cursor.execute(
                    "ALTER TABLE Usuarios ADD COLUMN img_perfil VARCHAR(255)"
                )

            cursor.execute("SHOW COLUMNS FROM Usuarios LIKE 'CodigoVerificacion'")
            if not cursor.fetchone():
                cursor.execute(
                    "ALTER TABLE Usuarios ADD COLUMN CodigoVerificacion VARCHAR(10)"
                )

            cursor.execute("SHOW COLUMNS FROM Usuarios LIKE 'CodigoExpiracion'")
            if not cursor.fetchone():
                cursor.execute(
                    "ALTER TABLE Usuarios ADD COLUMN CodigoExpiracion DATETIME"
                )

            cursor.execute(
                "SHOW INDEX FROM Usuarios WHERE Key_name = 'uq_usuarios_correo'"
            )
            if not cursor.fetchone():
                cursor.execute(
                    "ALTER TABLE Usuarios ADD UNIQUE INDEX uq_usuarios_correo (CorreoInstitucional)"
                )

            cursor.execute(
                "SELECT EXTRA FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'DB_SGEMD' AND TABLE_NAME = 'Usuarios' AND COLUMN_NAME = 'idUsuarios'"
            )
            extra = cursor.fetchone()
            if extra:
                extra_val = str(extra[0] or "").lower()
                if "auto_increment" not in extra_val:
                    cursor.execute(
                        "ALTER TABLE Usuarios MODIFY idUsuarios INT NOT NULL AUTO_INCREMENT"
                    )
        except Exception as e:
            print("Ajuste de estructura Usuarios no aplicado:", e)

        # Tabla EtapaEmprendimiento
        create_EtapaEmprendimiento = """
        CREATE TABLE IF NOT EXISTS EtapaEmprendimiento (
            idEtapaEmprendimiento INT NOT NULL AUTO_INCREMENT,
            Estado TINYINT NOT NULL,
            FechaCreacion DATE NOT NULL,
            FechaActualizacion DATE NOT NULL,
            TipoEtapa VARCHAR(45) NOT NULL,
            PRIMARY KEY (idEtapaEmprendimiento)
        )
        """
        cursor.execute(create_EtapaEmprendimiento)

        try:
            cursor.execute("SELECT COUNT(*) FROM EtapaEmprendimiento")
            etapas_count = cursor.fetchone()[0]
            if etapas_count == 0:
                cursor.execute(
                    "INSERT INTO EtapaEmprendimiento (Estado, FechaCreacion, FechaActualizacion, TipoEtapa) VALUES (1, CURDATE(), CURDATE(), 'Idea')"
                )
                cursor.execute(
                    "INSERT INTO EtapaEmprendimiento (Estado, FechaCreacion, FechaActualizacion, TipoEtapa) VALUES (1, CURDATE(), CURDATE(), 'Validacion')"
                )
                cursor.execute(
                    "INSERT INTO EtapaEmprendimiento (Estado, FechaCreacion, FechaActualizacion, TipoEtapa) VALUES (1, CURDATE(), CURDATE(), 'Puesta en marcha')"
                )
        except Exception as e:
            print("Carga semilla EtapaEmprendimiento no aplicada:", e)

        # Tabla Emprendimiento
        create_Emprendimiento = """
        CREATE TABLE IF NOT EXISTS Emprendimiento (
            idEmprendimiento INT NOT NULL AUTO_INCREMENT,
            Nombre VARCHAR(45) NOT NULL,
            Descripcion TEXT NOT NULL,
            TipoEmprendimiento VARCHAR(45) NOT NULL,  -- Corregido de TipoEmpreedimiento
            SectorProductivo VARCHAR(45) NOT NULL,    -- Corregido de SectorPruductivo
            RedesSociales TINYINT NOT NULL,
            Acompanamiento TINYINT NOT NULL,          -- Corregido de Acompañamiento (evita la ñ)
            FechaCreacion DATE NOT NULL,
            FechaActualizacion DATE NOT NULL,
            ActaCompromiso TEXT(150) NOT NULL,
            EtapaEmprendimiento_idEtapaEmprendimiento INT NOT NULL,
            PRIMARY KEY (idEmprendimiento),
            INDEX fk_Emprendimiento_EtapaEmprendimiento1_idx (EtapaEmprendimiento_idEtapaEmprendimiento),
            CONSTRAINT fk_Emprendimiento_EtapaEmprendimiento1
                FOREIGN KEY (EtapaEmprendimiento_idEtapaEmprendimiento)
                REFERENCES EtapaEmprendimiento (idEtapaEmprendimiento)
        )
        """
        cursor.execute(create_Emprendimiento)

        try:
            cursor.execute("SHOW COLUMNS FROM Emprendimiento LIKE 'Descripcion'")
            desc_col = cursor.fetchone()
            if desc_col:
                col_type = str(desc_col[1] or '').lower()
                if col_type.startswith('varchar'):
                    cursor.execute("ALTER TABLE Emprendimiento MODIFY COLUMN Descripcion TEXT NOT NULL")

            cursor.execute("SHOW COLUMNS FROM Emprendimiento LIKE 'Usuarios_idUsuarios'")
            if not cursor.fetchone():
                cursor.execute("ALTER TABLE Emprendimiento ADD COLUMN Usuarios_idUsuarios INT NULL")

            cursor.execute("SHOW INDEX FROM Emprendimiento WHERE Key_name = 'idx_empr_usuario'")
            if not cursor.fetchone():
                cursor.execute("ALTER TABLE Emprendimiento ADD INDEX idx_empr_usuario (Usuarios_idUsuarios)")

            cursor.execute(
                "SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = 'DB_SGEMD' AND TABLE_NAME = 'Emprendimiento' AND COLUMN_NAME = 'Usuarios_idUsuarios' AND REFERENCED_TABLE_NAME = 'Usuarios'"
            )
            if not cursor.fetchone():
                cursor.execute(
                    "ALTER TABLE Emprendimiento ADD CONSTRAINT fk_empr_usuario FOREIGN KEY (Usuarios_idUsuarios) REFERENCES Usuarios (idUsuarios)"
                )
        except Exception as e:
            print("Ajuste de estructura Emprendimiento no aplicado:", e)

        # Tabla Seguimientos
        create_Seguimientos = """
        CREATE TABLE IF NOT EXISTS Seguimientos (
            idSeguimientos INT NOT NULL AUTO_INCREMENT,
            histproal VARCHAR(45) NOT NULL,
            TipoSeguimiento VARCHAR(45) NOT NULL,
            Descripcion VARCHAR(45) NOT NULL,
            SeguimientoCol VARCHAR(45) NOT NULL,
            Emprendimiento_idEmprendimiento INT NULL,
            Asesor_idUsuarios INT NULL,
            FechaCreacion DATE NOT NULL,
            FechaActualizacion DATE NOT NULL,
            PRIMARY KEY (idSeguimientos)
        )
        """
        cursor.execute(create_Seguimientos)

        try:
            cursor.execute("SHOW COLUMNS FROM Seguimientos LIKE 'Usuarios_idUsuarios'")
            if not cursor.fetchone():
                cursor.execute("ALTER TABLE Seguimientos ADD COLUMN Usuarios_idUsuarios INT NULL")

            cursor.execute("SHOW COLUMNS FROM Seguimientos LIKE 'Emprendimiento_idEmprendimiento'")
            if not cursor.fetchone():
                cursor.execute("ALTER TABLE Seguimientos ADD COLUMN Emprendimiento_idEmprendimiento INT NULL")

            cursor.execute("SHOW COLUMNS FROM Seguimientos LIKE 'Asesor_idUsuarios'")
            if not cursor.fetchone():
                cursor.execute("ALTER TABLE Seguimientos ADD COLUMN Asesor_idUsuarios INT NULL")

            cursor.execute("SHOW INDEX FROM Seguimientos WHERE Key_name = 'idx_seg_usuario'")
            if not cursor.fetchone():
                cursor.execute("ALTER TABLE Seguimientos ADD INDEX idx_seg_usuario (Usuarios_idUsuarios)")

            cursor.execute("SHOW INDEX FROM Seguimientos WHERE Key_name = 'idx_seg_empr'")
            if not cursor.fetchone():
                cursor.execute("ALTER TABLE Seguimientos ADD INDEX idx_seg_empr (Emprendimiento_idEmprendimiento)")

            cursor.execute("SHOW INDEX FROM Seguimientos WHERE Key_name = 'idx_seg_asesor'")
            if not cursor.fetchone():
                cursor.execute("ALTER TABLE Seguimientos ADD INDEX idx_seg_asesor (Asesor_idUsuarios)")

            cursor.execute(
                "SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = 'DB_SGEMD' AND TABLE_NAME = 'Seguimientos' AND COLUMN_NAME = 'Usuarios_idUsuarios' AND REFERENCED_TABLE_NAME = 'Usuarios'"
            )
            if not cursor.fetchone():
                cursor.execute(
                    "ALTER TABLE Seguimientos ADD CONSTRAINT fk_seguimiento_usuario FOREIGN KEY (Usuarios_idUsuarios) REFERENCES Usuarios (idUsuarios)"
                )

            cursor.execute(
                "SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = 'DB_SGEMD' AND TABLE_NAME = 'Seguimientos' AND COLUMN_NAME = 'Emprendimiento_idEmprendimiento' AND REFERENCED_TABLE_NAME = 'Emprendimiento'"
            )
            if not cursor.fetchone():
                cursor.execute(
                    "ALTER TABLE Seguimientos ADD CONSTRAINT fk_seguimiento_empr FOREIGN KEY (Emprendimiento_idEmprendimiento) REFERENCES Emprendimiento (idEmprendimiento)"
                )

            cursor.execute(
                "SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = 'DB_SGEMD' AND TABLE_NAME = 'Seguimientos' AND COLUMN_NAME = 'Asesor_idUsuarios' AND REFERENCED_TABLE_NAME = 'Usuarios'"
            )
            if not cursor.fetchone():
                cursor.execute(
                    "ALTER TABLE Seguimientos ADD CONSTRAINT fk_seguimiento_asesor FOREIGN KEY (Asesor_idUsuarios) REFERENCES Usuarios (idUsuarios)"
                )
        except Exception as e:
            print("Ajuste de estructura Seguimientos no aplicado:", e)

        # Sincronizar propietario de seguimiento con el propietario del emprendimiento
        try:
            cursor.execute(
                "UPDATE Seguimientos s INNER JOIN Emprendimiento e ON e.idEmprendimiento = s.Emprendimiento_idEmprendimiento SET s.Usuarios_idUsuarios = e.Usuarios_idUsuarios WHERE s.Emprendimiento_idEmprendimiento IS NOT NULL"
            )
        except Exception as e:
            print("Sincronizacion propietario Seguimientos no aplicada:", e)

        # Tabla Asistencia
        create_Asistencia = """
        CREATE TABLE IF NOT EXISTS Asistencia (
            idAsistencia INT NOT NULL AUTO_INCREMENT,
            FeedBack VARCHAR(45) NOT NULL,
            Emprendimiento_idEmprendimiento INT NOT NULL,
            FechaCreacion DATE NOT NULL,
            FechaActualizacion DATE NOT NULL,
            Seguimientos_idSeguimientos INT NOT NULL,
            PRIMARY KEY (idAsistencia),
            INDEX fk_Asistencia_Emprendimiento1_idx (Emprendimiento_idEmprendimiento),
            INDEX fk_Asistencia_Seguimientos1_idx (Seguimientos_idSeguimientos),
            CONSTRAINT fk_Asistencia_Emprendimiento1
                FOREIGN KEY (Emprendimiento_idEmprendimiento)
                REFERENCES Emprendimiento (idEmprendimiento),
            CONSTRAINT fk_Asistencia_Seguimientos1
                FOREIGN KEY (Seguimientos_idSeguimientos)
                REFERENCES Seguimientos (idSeguimientos)
        )
        """
        cursor.execute(create_Asistencia)

        # Tabla SectorEconomico
        create_SectorEconomico = """
        CREATE TABLE IF NOT EXISTS SectorEconomico (
            idSectorEconomico INT NOT NULL AUTO_INCREMENT,
            Nombre VARCHAR(45) NOT NULL,
            PRIMARY KEY (idSectorEconomico)
        )
        """
        cursor.execute(create_SectorEconomico)

        # Tabla Diagnosticos
        create_Diagnosticos = """
        CREATE TABLE IF NOT EXISTS Diagnosticos (
            idDiagnosticos INT NOT NULL AUTO_INCREMENT,
            FechaEmprendimiento DATE NOT NULL,
            AreaEstrategia VARCHAR(45) NOT NULL,
            Diferencial TINYINT NOT NULL,
            Planeacion TINYINT NOT NULL,
            MercadoObjetivo VARCHAR(45) NOT NULL,
            Tendencias TINYINT NOT NULL,
            Canales TINYINT NOT NULL,
            DescripcionPromocion TEXT(150) NOT NULL,
            SectorEconomico_idSectorEconomico INT NOT NULL,
            Emprendimiento_idEmprendimiento INT NOT NULL,
            Presentacion TINYINT NOT NULL,
            PasosElaboracion TINYINT NOT NULL,
            SituacionFinanciera TINYINT NOT NULL,
            FuenteFinanciero TEXT(150) NOT NULL,
            EstructuraOrganica TINYINT NOT NULL,
            ConocimientoLegal TINYINT NOT NULL,
            MetodologiaInnovacion TEXT(150) NOT NULL,
            HerramientaTecnologicas TEXT(150) NOT NULL,
            Marca TEXT(150) NOT NULL,
            AplicacionMetodologia TINYINT NOT NULL,
            ImpactoAmbiental TINYINT NOT NULL,
            ImpactoSocial TINYINT NOT NULL,
            Viabilidad TINYINT NOT NULL,
            PRIMARY KEY (idDiagnosticos),
            INDEX fk_Diagnosticos_SectorEconomico1_idx (SectorEconomico_idSectorEconomico),
            INDEX fk_Diagnosticos_Emprendimiento1_idx (Emprendimiento_idEmprendimiento),
            CONSTRAINT fk_Diagnosticos_SectorEconomico1
                FOREIGN KEY (SectorEconomico_idSectorEconomico)
                REFERENCES SectorEconomico (idSectorEconomico),
            CONSTRAINT fk_Diagnosticos_Emprendimiento1
                FOREIGN KEY (Emprendimiento_idEmprendimiento)
                REFERENCES Emprendimiento (idEmprendimiento)
        )
        """
        cursor.execute(create_Diagnosticos)

        # Tabla Modalidad
        create_Modalidad = """
        CREATE TABLE IF NOT EXISTS Modalidad (
            idModalidad INT NOT NULL,
            Presencial TINYINT NOT NULL,
            Distancia TINYINT NOT NULL,
            Enlace_virtual VARCHAR(45) NOT NULL,
            Lugar VARCHAR(45) NOT NULL,
            PRIMARY KEY (idModalidad)
        )
        """
        cursor.execute(create_Modalidad)

        try:
            cursor.execute("SELECT COUNT(*) FROM Modalidad")
            modalidad_count = cursor.fetchone()[0]
            if modalidad_count == 0:
                cursor.execute(
                    "INSERT INTO Modalidad (idModalidad, Presencial, Distancia, Enlace_virtual, Lugar) VALUES (1, 1, 0, '', 'Pendiente')"
                )
        except Exception as e:
            print("Carga semilla Modalidad no aplicada:", e)

        # Tabla Fecha_y_Horarios
        create_Fecha_y_Horarios = """
        CREATE TABLE IF NOT EXISTS Fecha_y_Horarios (
            idFecha_y_Horarios INT NOT NULL,
            Fecha_inicio DATETIME NOT NULL,
            Hora_inicio DATETIME NOT NULL,
            Fecha_fin DATETIME NOT NULL,
            Hora_fin DATETIME NOT NULL,
            PRIMARY KEY (idFecha_y_Horarios)
        )
        """
        cursor.execute(create_Fecha_y_Horarios)

        try:
            cursor.execute("SELECT COUNT(*) FROM Fecha_y_Horarios")
            fh_count = cursor.fetchone()[0]
            if fh_count == 0:
                cursor.execute(
                    "INSERT INTO Fecha_y_Horarios (idFecha_y_Horarios, Fecha_inicio, Hora_inicio, Fecha_fin, Hora_fin) VALUES (1, NOW(), NOW(), NOW(), NOW())"
                )
        except Exception as e:
            print("Carga semilla Fecha_y_Horarios no aplicada:", e)

        # Tabla Asesorias
        create_Asesorias = """
        CREATE TABLE IF NOT EXISTS Asesorias (
            idAsesorias INT NOT NULL AUTO_INCREMENT,
            Nombre_de_asesoria VARCHAR(120) NOT NULL,
            Descripcion VARCHAR(255) NOT NULL,
            Fecha_asesoria DATETIME NOT NULL,
            Comentarios TEXT,
            Fecha_creacion DATETIME NOT NULL,
            Fecha_actualizacion DATETIME NOT NULL,
            confirmacion VARCHAR(45) NOT NULL,
            Usuarios_idUsuarios INT NOT NULL,
            Modalidad_idModalidad INT NOT NULL,
            Fecha_y_Horarios_idFecha_y_Horarios INT NOT NULL,
            Estudiante_idUsuarios INT,
            Docente_idUsuarios INT,
            MotivoSolicitud TEXT,
            EstadoSolicitud VARCHAR(45) NOT NULL DEFAULT 'pendiente',
            ComentarioDocente TEXT,
            FechaRespuesta DATETIME,
            PRIMARY KEY (idAsesorias),
            INDEX fk_Asesorias_Usuarios1_idx (Usuarios_idUsuarios),
            INDEX fk_Asesorias_Modalidad1_idx (Modalidad_idModalidad),
            INDEX fk_Asesorias_Fecha_y_Horarios1_idx (Fecha_y_Horarios_idFecha_y_Horarios),
            CONSTRAINT fk_Asesorias_Usuarios1 FOREIGN KEY (Usuarios_idUsuarios) REFERENCES Usuarios (idUsuarios),
            CONSTRAINT fk_Asesorias_Modalidad1 FOREIGN KEY (Modalidad_idModalidad) REFERENCES Modalidad (idModalidad),
            CONSTRAINT fk_Asesorias_Fecha_y_Horarios1 FOREIGN KEY (Fecha_y_Horarios_idFecha_y_Horarios) REFERENCES Fecha_y_Horarios (idFecha_y_Horarios)
        );
        """
        cursor.execute(create_Asesorias)

        try:
            cursor.execute("SHOW COLUMNS FROM Asesorias LIKE 'Estudiante_idUsuarios'")
            if not cursor.fetchone():
                cursor.execute(
                    "ALTER TABLE Asesorias ADD COLUMN Estudiante_idUsuarios INT"
                )

            cursor.execute("SHOW COLUMNS FROM Asesorias LIKE 'Docente_idUsuarios'")
            if not cursor.fetchone():
                cursor.execute(
                    "ALTER TABLE Asesorias ADD COLUMN Docente_idUsuarios INT"
                )

            cursor.execute("SHOW COLUMNS FROM Asesorias LIKE 'MotivoSolicitud'")
            if not cursor.fetchone():
                cursor.execute("ALTER TABLE Asesorias ADD COLUMN MotivoSolicitud TEXT")

            cursor.execute("SHOW COLUMNS FROM Asesorias LIKE 'EstadoSolicitud'")
            if not cursor.fetchone():
                cursor.execute(
                    "ALTER TABLE Asesorias ADD COLUMN EstadoSolicitud VARCHAR(45) NOT NULL DEFAULT 'pendiente'"
                )

            cursor.execute("SHOW COLUMNS FROM Asesorias LIKE 'ComentarioDocente'")
            if not cursor.fetchone():
                cursor.execute(
                    "ALTER TABLE Asesorias ADD COLUMN ComentarioDocente TEXT"
                )

            cursor.execute("SHOW COLUMNS FROM Asesorias LIKE 'FechaRespuesta'")
            if not cursor.fetchone():
                cursor.execute(
                    "ALTER TABLE Asesorias ADD COLUMN FechaRespuesta DATETIME"
                )
        except Exception as e:
            print("Ajuste de estructura Asesorias no aplicado:", e)

        # Tabla Tipo_evento
        create_Tipo_evento = """
        CREATE TABLE IF NOT EXISTS Tipo_evento (
            idTipo_evento INT NOT NULL,
            Nombre VARCHAR(80) NOT NULL,
            PRIMARY KEY (idTipo_evento)
        );
        """
        cursor.execute(create_Tipo_evento)

        try:
            cursor.execute("SHOW COLUMNS FROM Tipo_evento LIKE 'Nombre'")
            has_nombre = cursor.fetchone()
            if not has_nombre:
                cursor.execute("ALTER TABLE Tipo_evento ADD COLUMN Nombre VARCHAR(80)")
                cursor.execute(
                    "UPDATE Tipo_evento SET Nombre = 'General' WHERE Nombre IS NULL OR Nombre = ''"
                )
                cursor.execute("ALTER TABLE Tipo_evento MODIFY COLUMN Nombre VARCHAR(80) NOT NULL")

            cursor.execute("SHOW COLUMNS FROM Tipo_evento")
            tipo_evento_columns = [row[0] for row in cursor.fetchall()]

            legacy_cols = [
                "Academico",
                "Cultura",
                "Deportivo",
                "Social",
                "Conferencia",
            ]

            # Compatibilidad con esquemas antiguos: permitir nulos en columnas legacy
            # para que los nuevos inserts (id + Nombre) no fallen.
            for col in legacy_cols:
                if col in tipo_evento_columns:
                    try:
                        cursor.execute(
                            f"ALTER TABLE Tipo_evento MODIFY COLUMN {col} VARCHAR(45) NULL DEFAULT NULL"
                        )
                    except Exception:
                        pass

            extra_cols = [
                col for col in tipo_evento_columns if col not in ("idTipo_evento", "Nombre")
            ]

            def upsert_tipo_evento(tipo_id, nombre):
                if extra_cols:
                    cols = ["idTipo_evento", "Nombre", *extra_cols]
                    placeholders = ", ".join(["%s"] * len(cols))
                    assignments = ", ".join([f"{c} = VALUES({c})" for c in cols if c != "idTipo_evento"])
                    values = [tipo_id, nombre] + ["N/A" for _ in extra_cols]
                    cursor.execute(
                        f"INSERT INTO Tipo_evento ({', '.join(cols)}) VALUES ({placeholders}) ON DUPLICATE KEY UPDATE {assignments}",
                        values,
                    )
                else:
                    cursor.execute(
                        "INSERT INTO Tipo_evento (idTipo_evento, Nombre) VALUES (%s, %s) ON DUPLICATE KEY UPDATE Nombre = VALUES(Nombre)",
                        (tipo_id, nombre),
                    )

            upsert_tipo_evento(1, "Taller")
            upsert_tipo_evento(2, "Masterclass")
        except Exception as e:
            print("Ajuste de estructura Tipo_evento no aplicado:", e)

        # Tabla Eventos
        create_Eventos = """
        CREATE TABLE IF NOT EXISTS Eventos (
            idEventos INT NOT NULL AUTO_INCREMENT,
            Nombre_evento VARCHAR(150) NOT NULL,
            Descripcion_evento TEXT NOT NULL,
            Link_evento VARCHAR(500),
            Archivo_url VARCHAR(500),
            Estado VARCHAR(45) NOT NULL DEFAULT 'Activo',
            Capacidad_maxima INT NOT NULL DEFAULT 0,
            Tipo_evento_idTipo_evento INT NOT NULL DEFAULT 1,
            Creado_por INT,
            Fecha_creacion DATETIME NOT NULL,
            Fecha_actualizacion DATETIME NOT NULL,
            PRIMARY KEY (idEventos),
            INDEX idx_evento_tipo (Tipo_evento_idTipo_evento),
            CONSTRAINT fk_evento_tipo FOREIGN KEY (Tipo_evento_idTipo_evento) REFERENCES Tipo_evento (idTipo_evento)
        );
        """
        cursor.execute(create_Eventos)

        try:
            cursor.execute("SHOW COLUMNS FROM Eventos LIKE 'Link_evento'")
            if not cursor.fetchone():
                cursor.execute(
                    "ALTER TABLE Eventos ADD COLUMN Link_evento VARCHAR(500)"
                )

            cursor.execute("SHOW COLUMNS FROM Eventos LIKE 'Archivo_url'")
            if not cursor.fetchone():
                cursor.execute(
                    "ALTER TABLE Eventos ADD COLUMN Archivo_url VARCHAR(500)"
                )

            cursor.execute("SHOW COLUMNS FROM Eventos LIKE 'Creado_por'")
            if not cursor.fetchone():
                cursor.execute("ALTER TABLE Eventos ADD COLUMN Creado_por INT")

            cursor.execute("SHOW COLUMNS FROM Eventos LIKE 'Tipo_evento_idTipo_evento'")
            if not cursor.fetchone():
                cursor.execute(
                    "ALTER TABLE Eventos ADD COLUMN Tipo_evento_idTipo_evento INT NOT NULL DEFAULT 1"
                )

            # Normalizar datos antes de FK
            cursor.execute(
                "UPDATE Eventos SET Tipo_evento_idTipo_evento = 1 WHERE Tipo_evento_idTipo_evento IS NULL OR Tipo_evento_idTipo_evento = 0"
            )
            cursor.execute(
                "UPDATE Eventos e LEFT JOIN Tipo_evento te ON te.idTipo_evento = e.Tipo_evento_idTipo_evento SET e.Tipo_evento_idTipo_evento = 1 WHERE te.idTipo_evento IS NULL"
            )

            cursor.execute("SHOW INDEX FROM Eventos WHERE Key_name = 'idx_evento_tipo'")
            if not cursor.fetchone():
                cursor.execute("ALTER TABLE Eventos ADD INDEX idx_evento_tipo (Tipo_evento_idTipo_evento)")

            cursor.execute(
                "SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = 'DB_SGEMD' AND TABLE_NAME = 'Eventos' AND COLUMN_NAME = 'Tipo_evento_idTipo_evento' AND REFERENCED_TABLE_NAME = 'Tipo_evento'"
            )
            if not cursor.fetchone():
                cursor.execute(
                    "ALTER TABLE Eventos ADD CONSTRAINT fk_evento_tipo FOREIGN KEY (Tipo_evento_idTipo_evento) REFERENCES Tipo_evento (idTipo_evento)"
                )
        except Exception as e:
            print("Ajuste de estructura Eventos no aplicado:", e)

        # Renombrar roles oficiales a nomenclatura definitiva
        try:
            cursor.execute(
                "INSERT INTO Roles (idRoles, Nombre, FechaCreacion, FechaActualizacion) VALUES (1, 'Administrador', NOW(), NOW()) ON DUPLICATE KEY UPDATE Nombre = VALUES(Nombre), FechaActualizacion = VALUES(FechaActualizacion)"
            )
            cursor.execute(
                "INSERT INTO Roles (idRoles, Nombre, FechaCreacion, FechaActualizacion) VALUES (2, 'Emprendedor', NOW(), NOW()) ON DUPLICATE KEY UPDATE Nombre = VALUES(Nombre), FechaActualizacion = VALUES(FechaActualizacion)"
            )
            cursor.execute(
                "INSERT INTO Roles (idRoles, Nombre, FechaCreacion, FechaActualizacion) VALUES (3, 'Asesor', NOW(), NOW()) ON DUPLICATE KEY UPDATE Nombre = VALUES(Nombre), FechaActualizacion = VALUES(FechaActualizacion)"
            )
        except Exception as e:
            print("Ajuste de roles oficiales no aplicado:", e)

        # Tabla PlanTrabajo
        create_PlanTrabajo = """
        CREATE TABLE IF NOT EXISTS PlanTrabajo (
            idPlanTrabajo INT NOT NULL AUTO_INCREMENT,
            Usuarios_idUsuarios INT NOT NULL,
            Titulo VARCHAR(120) NOT NULL,
            Objetivo VARCHAR(255),
            FechaInicio DATE,
            FechaFin DATE,
            Estado VARCHAR(45) NOT NULL DEFAULT 'Pendiente',
            Progreso INT NOT NULL DEFAULT 0,
            FechaCreacion DATETIME NOT NULL,
            FechaActualizacion DATETIME NOT NULL,
            PRIMARY KEY (idPlanTrabajo),
            INDEX idx_plan_usuario (Usuarios_idUsuarios),
            CONSTRAINT fk_plantrabajo_usuario FOREIGN KEY (Usuarios_idUsuarios) REFERENCES Usuarios (idUsuarios) ON DELETE CASCADE
        );
        """
        cursor.execute(create_PlanTrabajo)

        create_Emprendimiento_Asesor = """
        CREATE TABLE IF NOT EXISTS Emprendimiento_Asesor (
            idAsignacion INT NOT NULL AUTO_INCREMENT,
            Emprendimiento_idEmprendimiento INT NOT NULL,
            Asesor_idUsuarios INT NOT NULL,
            Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
            AsignadoPor INT,
            FechaCreacion DATETIME NOT NULL,
            FechaActualizacion DATETIME NOT NULL,
            PRIMARY KEY (idAsignacion),
            UNIQUE INDEX uq_emprendimiento_asignacion (Emprendimiento_idEmprendimiento),
            INDEX idx_asignacion_asesor (Asesor_idUsuarios),
            CONSTRAINT fk_empr_asig_empr FOREIGN KEY (Emprendimiento_idEmprendimiento) REFERENCES Emprendimiento (idEmprendimiento),
            CONSTRAINT fk_empr_asig_asesor FOREIGN KEY (Asesor_idUsuarios) REFERENCES Usuarios (idUsuarios)
        );
        """
        cursor.execute(create_Emprendimiento_Asesor)

        # Tabla Notificaciones
        create_Notificaciones = """
        CREATE TABLE IF NOT EXISTS Notificaciones (
            idNotificacion INT NOT NULL AUTO_INCREMENT,
            Usuario_idUsuarios INT NOT NULL,
            Tipo VARCHAR(60) NOT NULL,
            Titulo VARCHAR(180) NOT NULL,
            Mensaje TEXT NOT NULL,
            RefTipo VARCHAR(60),
            RefId INT,
            Leida TINYINT(1) NOT NULL DEFAULT 0,
            FechaCreacion DATETIME NOT NULL,
            PRIMARY KEY (idNotificacion),
            INDEX idx_notif_usuario_leida (Usuario_idUsuarios, Leida),
            INDEX idx_notif_usuario_fecha (Usuario_idUsuarios, FechaCreacion),
            CONSTRAINT fk_notif_usuario FOREIGN KEY (Usuario_idUsuarios) REFERENCES Usuarios (idUsuarios) ON DELETE CASCADE
        );
        """
        cursor.execute(create_Notificaciones)

        # Tabla Usuarios_has_Eventos
        create_Usuarios_has_Eventos = """
        CREATE TABLE IF NOT EXISTS Usuarios_has_Eventos (
            Usuarios_idUsuarios INT NOT NULL,
            Eventos_idEventos INT NOT NULL,
            PRIMARY KEY (Usuarios_idUsuarios, Eventos_idEventos),
            INDEX fk_Usuarios_has_Eventos_Eventos1_idx (Eventos_idEventos),
            INDEX fk_Usuarios_has_Eventos_Usuarios1_idx (Usuarios_idUsuarios),
            CONSTRAINT fk_Usuarios_has_Eventos_Usuarios1
                FOREIGN KEY (Usuarios_idUsuarios)
                REFERENCES Usuarios (idUsuarios),
            CONSTRAINT fk_Usuarios_has_Eventos_Eventos1
                FOREIGN KEY (Eventos_idEventos)
                REFERENCES Eventos (idEventos)
        )
        """
        cursor.execute(create_Usuarios_has_Eventos)

        print("Tablas creadas exitosamente o ya existían.")

except Error as e:
    print("Error al conectarse a MySQL:", e)

finally:
    if connection and connection.is_connected():
        cursor.close()
        connection.close()
        print("Conexión cerrada con la base de datos.")
