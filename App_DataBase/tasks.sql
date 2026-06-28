-- 1: Alumnos activos por programa
SELECT 
    p.id AS programa_id,
    p.nombre AS programa_nombre,
    COUNT(i.alumno_id) AS total_alumnos_activos
FROM inscripciones i
INNER JOIN programas p ON i.programa_id = p.id
INNER JOIN alumnos a ON i.alumno_id = a.id
WHERE i.estatus_actual IN ('Activo', 'Inscrito')
  AND a.is_active = TRUE
GROUP BY p.id, p.nombre
ORDER BY total_alumnos_activos DESC;

-- 2: Alumnos con al menos un cambio de estatus en los últimos 30 días
SELECT DISTINCT
    a.id AS alumno_id,
    a.uuid_publico,
    pi.nombres,
    pi.apellidos
FROM historial_inscripciones h
INNER JOIN alumnos a ON h.alumno_id = a.id
INNER JOIN perfil_info pi ON a.perfil_info_id = pi.id
WHERE h.created_at >= NOW() - INTERVAL 30 DAY
  AND h.estatus_anterior IS NOT NULL
  AND a.is_active = TRUE;

-- 3: Tasa de baja por programa (bajas / total inscritos)
SELECT 
    p.id AS programa_id,
    p.nombre AS programa_nombre,
    COUNT(i.alumno_id) AS total_historico_inscritos,
    SUM(CASE WHEN i.estatus_actual IN ('Baja de empresa', 'Baja del programa') THEN 1 ELSE 0 END) AS total_bajas,
    ROUND(
        (SUM(CASE WHEN i.estatus_actual IN ('Baja de empresa', 'Baja del programa') THEN 1 ELSE 0 END) * 100.0) 
        / NULLIF(COUNT(i.alumno_id), 0), 
        2
    ) AS tasa_baja_porcentaje
FROM inscripciones i
INNER JOIN programas p ON i.programa_id = p.id
INNER JOIN alumnos a ON i.alumno_id = a.id
WHERE a.is_active = TRUE
GROUP BY p.id, p.nombre
ORDER BY tasa_baja_porcentaje DESC;

-- 4: Historial completo de un alumno específico (JOIN de 4 tablas)
SELECT 
    a.uuid_publico,
    CONCAT(pi.nombres, ' ', pi.apellidos) AS nombre_completo,
    e.nombre AS empresa_perteneciente,
    p.nombre AS programa_academico,
    h.estatus_anterior,
    h.estatus_nuevo,
    h.motivo,
    h.created_at AS fecha_del_cambio
FROM historial_inscripciones h
INNER JOIN alumnos a ON h.alumno_id = a.id
INNER JOIN perfil_info pi ON a.perfil_info_id = pi.id
INNER JOIN empresas e ON a.empresa_id = e.id
INNER JOIN programas p ON h.programa_id = p.id
WHERE a.id = 1
ORDER BY h.created_at ASC, h.id ASC;

-- 5: Alumnos que pasaron de baja_empresa a activo/reingreso
SELECT 
    a.id AS alumno_id,
    a.uuid_publico,
    CONCAT(pi.nombres, ' ', pi.apellidos) AS nombre_completo,
    p.nombre AS programa_nombre,
    h.estatus_anterior AS estado_origen,
    h.estatus_nuevo AS estado_destino,
    h.created_at AS fecha_reingreso
FROM historial_inscripciones h
INNER JOIN alumnos a ON h.alumno_id = a.id
INNER JOIN perfil_info pi ON a.perfil_info_id = pi.id
INNER JOIN programas p ON h.programa_id = p.id
WHERE h.estatus_anterior = 'Baja de empresa' 
  AND h.estatus_nuevo IN ('Activo', 'Reingreso', 'Inscrito')
  AND a.is_active = TRUE
ORDER BY h.created_at DESC;