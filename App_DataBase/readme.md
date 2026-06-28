# Sistema de Gestión de Alumnos

Este proyecto despliega un entorno contenerizado utilizando **Docker Compose** para inicializar una base de datos **MariaDB (10.11)** y un script automatizado en **Python 3.11** encargado de simular y poblar datos de prueba dinámicamente desde un archivo CSV, además de crear un procedimiento almacenado.

## Arquitectura y Características del Diseño

- **Levantamiento Simple:** El proyecto se diseño utilizando Docker para simplificar el proceso de levantar la base de datos con todos los datos de prueba.
- **Integración con Python:** El levantamiento de la base de datos se integro un script de Python siendo el responsable de simular y crear los datos de prueba, esto permite desacoplar toda la información del diseño de la base datos y del los scripts de sql para su creación, de igual forma permite crear elementos adicionales como store procedures.
- **Solución para pregunta 2:** El diseño de la base de datos tomo en cuenta resolver el problema de la pregunta 2, aplicando dos validaciones adicionales, una que evita que se puedan generar registros en el historial con el estado actual y el anterior iguales y se utilizo una llave compuesta para que al momento de insertar poder validar que el estado actual es realmente que debería ser el anterior en el nuevo registro y así evitar duplicados.

  ***

## Proceso de desarrollo

1. Se diseño la base de datos utilizando lucidchart como programa para diagramar, esta fue planteada para resolver el problema de la pregunta 2 y se creo el archivo `Diagram.png`.
2. Se crearon los scripts para crear la base datos y un documento `docker-compose.yml` para levantar un contenedor de una base de datos y se utilizo `schema.sql` los scripts de la base de datos para levantarlo.
3. Para agregar los datos y automatizar el proceso se creo el script de Python que se encargaría de las inserciones `seeder.py` extrayendo los datos de `alumnos_muestra.csv`, se añadió una configuración adicional para levantar un segundo contenedor de Docker con el script Python para cargar los datos justamente después de levantada la base de datos.
4. Se extendió el `seeder.py` para agregar el storeprocedure para obtener el "Resumen de un alumno" y así existiera al levantar la base de datos .
5. Se crearon todos los scripts que se solicitaban en el documento y se guardaron en `tasks.sql`.
6. Se creo el indicador y se gurdo en el documento `indicador.sql`.

---

## Preguntas prueba

1. Tu tabla historial_estatus crece rápido. ¿Qué harías para que las consultas de historial no se
   vuelvan lentas con el tiempo?
   R: depende de la cantidad de registros, al comienzo indicies, paginado y filtrado puede hacer una experiencia fluida, en caso de que se tenga mucha concurrencia usar redis o un servicio de cache ayudara a evitar que se tengan que realizar búsquedas repetitivas en recursos concurrentes y si la cantidad de datos crece demasiado que físicamente la ram no soporta la cantidad en una tabla se puede partir la tabla ya sea que lo haga el motor o que se aplique con un criterios de lógica de negocios como archivado todos los registros de cierto año hacia atrás, si bien la tabla es importante no es critica y no recomendaría crear un micro servicio o mudar de base de datos a no sql.
2. Un alumno aparece dos veces con estatus activo seguido en el historial, sin una baja
   intermedia. ¿Cómo detectarías ese problema y cómo lo evitarías desde el diseño?
   R: Aplicando dos validaciones adicionales, una que evita que se puedan generar registros en el historial con el estado actual y el anterior iguales y se utilizo una llave compuesta para que al momento de insertar poder validar que el estado actual es realmente que debería ser el anterior en el nuevo registro y así evitar duplicados.

---

## Requisitos Previos

Antes de inicializar el entorno, asegúrate de tener instalado en tu máquina local:

- Docker Desktop
- Docker Compose v2

---

## Levantar el proyecto

Corra en la carpeta raíz de este proyecto el siguiente comando

```
 docker-compose up -d
```

---

## Estructura del Proyecto

Asegúrate de que tu directorio de trabajo tenga los siguientes archivos organizados de esta manera:

```text

├── alumnos_muestra.csv  # Archivo fuente original con los registros base

├── docker-compose.yml   # Orquestador multi-contenedor (db y seeder)

├── taks.sql             # Tareas generales solicitadas en la prueba

├── indicador.sql        # scrpit de un indicador relavente para el negocio

├── diagram.png          # Diagrama de la base datos

├── schema.sql           # Esqueleto DDL (Tablas, Constraints y Stored Procedure)

├── seeder.py            # Script automatizado en Python para inyección de datos

└── README.md            # Documentación del proyecto (Este archivo)
```
