import os
import sys
import time
import uuid
import pandas as pd
import mysql.connector
from mysql.connector import Error

def conectar_db():
    intentos = 0
    while intentos < 12:
        try:
            conn = mysql.connector.connect(
                host=os.getenv('DB_HOST', 'db'),
                database=os.getenv('MARIADB_DATABASE', 'sistema_alumnos'),
                user=os.getenv('MARIADB_USER', 'alumno_user'),
                password=os.getenv('MARIADB_PASSWORD', 'alumno_password_99'),
                port=3306
            )
            if conn.is_connected():
                print("Conexión exitosa a la base de datos")
                return conn
        except Error as e:
            print(f"Base de datos no lista aún (Intento {intentos+1}/12)... Esperando 5 segundos.")
            time.sleep(5)
            intentos += 1
    print("No se pudo establecer conexión con la base de datos.")
    sys.exit(1)

def cargar_datos():
    # 1. Leer el archivo CSV
    csv_file = 'alumnos_muestra.csv'
    if not os.path.exists(csv_file):
        print(f"Error: No se encontró el archivo {csv_file} en el directorio actual.")
        sys.exit(1)
        
    df = pd.read_csv(csv_file)
    print(f"Archivo CSV cargado correctamente. Registros encontrados: {len(df)}")

    # 2. Conectar a MariaDB
    conn = conectar_db()
    cursor = conn.cursor()

    try:

        cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
        cursor.execute("TRUNCATE TABLE historial_inscripciones;")
        cursor.execute("TRUNCATE TABLE inscripciones;")
        cursor.execute("TRUNCATE TABLE alumnos;")
        cursor.execute("TRUNCATE TABLE perfil_info;")
        cursor.execute("TRUNCATE TABLE programas;")
        cursor.execute("TRUNCATE TABLE empresas;")
        cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
        conn.commit()

        # 3. Procesar y poblar Empresas únicas
        lista_empresas = sorted(list(df['empresa'].dropna().unique()))
        mapa_empresas = {}
        print(f"Insertando {len(lista_empresas)} empresas únicas...")
        for idx, nombre_empresa in enumerate(lista_empresas, 1):
            cursor.execute(
                "INSERT INTO empresas (id, nombre, contacto_nombre, contacto_email) VALUES (%s, %s, %s, %s);",
                (idx, nombre_empresa, f"Contacto {nombre_empresa}", f"contacto@{nombre_empresa.lower().replace(' ', '')}.com")
            )
            mapa_empresas[nombre_empresa] = idx

        # 4. Procesar y poblar Programas únicos
        lista_programas = sorted(list(df['programa'].dropna().unique()))
        mapa_programas = {}
        print(f"Insertando {len(lista_programas)} programas únicos...")
        for idx, nombre_programa in enumerate(lista_programas, 1):
            cursor.execute(
                "INSERT INTO programas (id, nombre, descripcion) VALUES (%s, %s, %s);",
                (idx, nombre_programa, f"Programa académico oficial de {nombre_programa}")
            )
            mapa_programas[nombre_programa] = idx
            
        conn.commit()

        # Mapa de estatus oficial y estricto del sistema
        status_map = {
            'activo': 'Activo',
            'baja_empresa': 'Baja de empresa',
            'baja_programa': 'Baja del programa',
            'inscrito': 'Inscrito',
            'suspendido': 'Suspendido',
            'reingreso': 'Reingreso',
            'egresado': 'Egresado'
        }

        print("Insertando alumnos, perfiles y su historial dinámico con motivos...")
        
        # 5. Iterar fila por fila del DataFrame para construir las secuencias e historiales
        for idx, row in df.iterrows():
            full_name = row['nombre']
            
            # Separación de nombre y apellido
            partes_nombre = full_name.split(' ', 1)
            nombres = partes_nombre[0]
            apellidos = partes_nombre[1] if len(partes_nombre) > 1 else 'López'
            
            id_empresa = mapa_empresas[row['empresa']]
            id_programa = mapa_programas[row['programa']]
            
            # Estatus final extraído y normalizado del documento
            estatus_doc = row['estatus'].lower().strip()
            estatus_final = status_map.get(estatus_doc, 'Activo')
            
            # Parsear o simular fechas (El formato en tu CSV es DD/MM/YYYY)
            try:
                d, m, y = row['fecha_inscripcion'].split('/')
                fecha_documento = f"{y}-{m}-{d} 12:00:00"
                fecha_inicial = f"{y}-{m}-{d} 08:00:00"
            except Exception:
                fecha_documento = "2026-06-28 12:00:00"
                fecha_inicial = "2026-06-28 08:00:00"
                
            uuid_pub = str(uuid.uuid4())

            # A. Insertar Información de Perfil 
            cursor.execute(
                "INSERT INTO perfil_info (nombres, apellidos, url_imagen_perfil, telefono, direccion) VALUES (%s, %s, %s, %s, %s);",
                (nombres, apellidos, f"https://api.dicebear.com/7.x/avataaars/svg?seed={idx}", f"646555{idx%1000:04d}", f"Av. Universidad #{idx}, Ensenada, BC")
            )
            id_perfil_generado = cursor.lastrowid 

            # B. Insertar Entidad Alumno 
            cursor.execute(
                "INSERT INTO alumnos (uuid_publico, perfil_info_id, empresa_id, is_active, created_at) VALUES (%s, %s, %s, TRUE, %s);",
                (uuid_pub, id_perfil_generado, id_empresa, fecha_inicial)
            )
            id_alumno_generado = cursor.lastrowid

            if estatus_final == 'Inscrito':
                # CASO 1: El alumno está únicamente 'Inscrito'. Requiere UN registro en el historial (NULL -> Inscrito).
                # C. Crear Inscripción actual
                cursor.execute(
                    "INSERT INTO inscripciones (alumno_id, programa_id, estatus_actual, updated_at) VALUES (%s, %s, %s, %s);",
                    (id_alumno_generado, id_programa, 'Inscrito', fecha_documento)
                )
                # D. Historial Único: Pasamos None explícito para insertar un valor NULL en estatus_anterior
                cursor.execute(
                    "INSERT INTO historial_inscripciones (alumno_id, programa_id, estatus_anterior, estatus_nuevo, motivo, created_at) VALUES (%s, %s, %s, %s, %s, %s);",
                    (id_alumno_generado, id_programa, None, 'Inscrito', 'Alta inicial automática por documento de la empresa', fecha_documento)
                )
            else:
                # CASO 2: El alumno cambió a otro estado (Egresado, Baja, etc.)
                # C. Crear inscripción inicial en 'Inscrito'
                cursor.execute(
                    "INSERT INTO inscripciones (alumno_id, programa_id, estatus_actual, updated_at) VALUES (%s, %s, %s, %s);",
                    (id_alumno_generado, id_programa, 'Inscrito', fecha_inicial)
                )
                # D. Historial 1: Alta inicial en el sistema (NULL -> Inscrito)
                cursor.execute(
                    "INSERT INTO historial_inscripciones (alumno_id, programa_id, estatus_anterior, estatus_nuevo, motivo, created_at) VALUES (%s, %s, %s, %s, %s, %s);",
                    (id_alumno_generado, id_programa, None, 'Inscrito', 'Ingreso inicial registrado en el programa académico', fecha_inicial)
                )
                # E. Historial 2: Transición al estado final del documento ('Inscrito' -> Estado Final)
                cursor.execute(
                    "INSERT INTO historial_inscripciones (alumno_id, programa_id, estatus_anterior, estatus_nuevo, motivo, created_at) VALUES (%s, %s, %s, %s, %s, %s);",
                    (id_alumno_generado, id_programa, 'Inscrito', estatus_final, f'Cambio de estado solicitado. Estatus final: {estatus_final}', fecha_documento)
                )
                # F. Actualizar Inscripción actual al estado final definitivo
                cursor.execute(
                    "UPDATE inscripciones SET estatus_actual = %s, updated_at = %s WHERE alumno_id = %s AND programa_id = %s;",
                    (estatus_final, fecha_documento, id_alumno_generado, id_programa)
                )

        conn.commit()
        print("El seeder ha terminado con éxito")

        print("Creando Stored Procedure: GetResumenAlumno")
        
        # Eliminamos si existe previamente para evitar conflictos
        cursor.execute("DROP PROCEDURE IF EXISTS GetResumenAlumno;")
        
        procedure_sql = """
        CREATE PROCEDURE GetResumenAlumno(IN p_alumno_id INT UNSIGNED)
        BEGIN
            SELECT 
                p.nombre AS programa_nombre,
                i.estatus_actual,
                i.updated_at AS fecha_estatus_actual,
                h.estatus_anterior AS ultimo_historial_anterior,
                h.estatus_nuevo AS ultimo_historial_nuevo,
                h.motivo AS ultimo_motivo,
                h.created_at AS fecha_ultimo_historial
            FROM inscripciones i
            INNER JOIN programas p ON i.programa_id = p.id
            INNER JOIN alumnos a ON i.alumno_id = a.id
            LEFT JOIN historial_inscripciones h ON h.id = (
                SELECT sub_h.id 
                FROM historial_inscripciones sub_h
                WHERE sub_h.alumno_id = i.alumno_id AND sub_h.programa_id = i.programa_id
                ORDER BY sub_h.created_at DESC, sub_h.id DESC
                LIMIT 1
            )
            WHERE i.alumno_id = p_alumno_id
              AND a.is_active = TRUE;
        END;
        """
        cursor.execute(procedure_sql)
        conn.commit()
        print("Stored Procedure creado con éxito")

    except Error as err:
        print(f"Error detectado durante la carga: {err}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    cargar_datos()