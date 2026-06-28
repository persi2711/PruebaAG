CREATE DATABASE IF NOT EXISTS sistema_alumnos;
USE sistema_alumnos;

CREATE TABLE IF NOT EXISTS empresas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    contacto_nombre VARCHAR(100),
    contacto_email VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS perfil_info (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    url_imagen_perfil VARCHAR(255),
    telefono VARCHAR(20),
    direccion TEXT
);

CREATE TABLE IF NOT EXISTS alumnos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid_publico CHAR(36) NOT NULL DEFAULT (UUID()),
    perfil_info_id INT UNSIGNED NOT NULL UNIQUE,
    empresa_id INT UNSIGNED NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_alumno_uuid (uuid_publico),
    FOREIGN KEY (perfil_info_id) REFERENCES perfil_info(id) ON DELETE CASCADE,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)

);

CREATE TABLE IF NOT EXISTS programas (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inscripciones (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    alumno_id INT UNSIGNED NOT NULL,
    programa_id INT UNSIGNED NOT NULL,
    estatus_actual VARCHAR(50) NOT NULL DEFAULT 'Inscrito',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
    FOREIGN KEY (programa_id) REFERENCES programas(id) ON DELETE CASCADE,
    CONSTRAINT uq_inscripcion_estatus UNIQUE (alumno_id, programa_id, estatus_actual),

    CONSTRAINT chk_inscripcion_estatus_oficial CHECK (
        estatus_actual IN (
            'Activo',
            'Baja de empresa',
            'Baja del programa',
            'Inscrito',
            'Suspendido',
            'Reingreso',
            'Egresado'
        )
    )
);

CREATE TABLE IF NOT EXISTS historial_inscripciones (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    alumno_id INT UNSIGNED NOT NULL,
    programa_id INT UNSIGNED NOT NULL,
    estatus_anterior VARCHAR(50) NULL,
    estatus_nuevo VARCHAR(50) NOT NULL,
    motivo TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_diferente_estatus CHECK (estatus_anterior IS NULL OR estatus_anterior <> estatus_nuevo),
    
    CONSTRAINT fk_historial_inscripcion FOREIGN KEY (alumno_id, programa_id) 
        REFERENCES inscripciones (alumno_id, programa_id) ON DELETE CASCADE,
        
    CONSTRAINT chk_historial_estados_oficiales CHECK (
        (estatus_anterior IS NULL OR estatus_anterior IN ('Activo', 'Baja de empresa', 'Baja del programa', 'Inscrito', 'Suspendido', 'Reingreso', 'Egresado')) AND
        estatus_nuevo IN ('Activo', 'Baja de empresa', 'Baja del programa', 'Inscrito', 'Suspendido', 'Reingreso', 'Egresado')
    )
);