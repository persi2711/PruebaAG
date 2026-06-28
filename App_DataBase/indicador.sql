/*
Nombre: Tasa de abandono de programa por empresa
Definicion: Este indicador mide cual es el porcentaje de abandono voluntario o dados de baja de estuduantes de una empresa en realacion con su historico de inscripciones
Calculo: Porcentaje de abandono =(Total de inscripcion con status "Baja del programa"/Total historico de inscripciones de la empresa)*100
Justificacion: es importante medir la tasa de fracaso al concluir la capacitacion en los programas por motivos que estan relacionados con barreras laborales en la organizacion 
o problemas personales que suelen impactar al grupo poblacional que emplea la organizacion, eso perimitira ajusta las capacitaciones a las nececidades especificas de los estudiantes
en diferentes organizaciones 

*/
SELECT 
    e.id AS empresa_id,
    e.nombre AS empresa_nombre,
    COUNT(i.id) AS total_inscripciones_historicas,
    SUM(CASE WHEN i.estatus_actual = 'Baja del programa' THEN 1 ELSE 0 END) AS total_abandonos_programa,
    ROUND(
        (SUM(CASE WHEN i.estatus_actual = 'Baja del programa' THEN 1 ELSE 0 END) * 100.0) 
        / NULLIF(COUNT(i.id), 0), 
        2
    ) AS tasa_abandono_programa_porcentaje
FROM empresas e
LEFT JOIN alumnos a ON a.empresa_id = e.id AND a.is_active = TRUE
LEFT JOIN inscripciones i ON i.alumno_id = a.id
GROUP BY e.id, e.nombre
ORDER BY tasa_abandono_programa_porcentaje DESC;