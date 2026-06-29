## Prueba Técnica

Este proyecto es una prueba tecnica, utilizan 4 proyecto para construir un mini-sistema de registro, seguimiento y análisis de inscripciones para un
programa educativo. Los alumnos pueden cambiar de estatus a lo largo del tiempo, y el sistema
debe registrar y analizar esos movimientos.

## Proyecto 1: Base de datos

Este proyecto despliega un entorno contenerizado utilizando **Docker Compose** para inicializar una base de datos **MariaDB (10.11)** y un script automatizado en **Python 3.11** encargado de simular y poblar datos de prueba dinámicamente desde un archivo CSV, además de crear un procedimiento almacenado.

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

## Proyecto 2: Base de datos

Este proyecto consiste en un análisis de datos y módulo de visualización desarrollado en un **Jupyter Notebook (`.ipynb`)**. Se conecta a la infraestructura de MariaDB para extraer la información operativa e histórica de los alumnos, procesarla utilizando **Pandas** y generar insights clave de negocio a través de representaciones gráficas con **Matplotlib** y **Seaborn**.

## Requisitos e Instalación

Para ejecutar este Notebook localmente, necesitas contar con un entorno de Python (v3.9 o superior) e instalar las siguientes dependencias de análisis:

```bash

pip install pandas sqlalchemy pymysql matplotlib seaborn notebook

```

Si utilizas **Visual Studio Code**, asegúrate de tener instalada la extensión oficial **Jupyter**.

## Instrucciones para Ejecutar el Notebook

1. Asegúrate de que el contenedor de la base de datos esté arriba y respondiendo consultas (`docker-compose up -d`).

2. Abre Visual Studio Code en el directorio de este archivo y selecciona el archivo `Analisis_Alumnos.ipynb`.

3. Haz clic en **Select Kernel** en la esquina superior derecha y selecciona tu entorno de Python con las librerías instaladas.

4. Ejecuta las celdas de forma secuencial haciendo clic en el botón **Play (▶)** o presionando `Shift + Enter`.

## Proyecto 3: API Backend (NestJS)

Este proyecto corresponde al desarrollo de la API Backend utilizando **NestJS (v11)** y **TypeORM** como ORM, conectada a una base de datos relacional **MariaDB**. La API expone endpoints optimizados y validados para resolver las peticiones de una interfaz de usuario frontend (catálogos, registro transaccional, cambios de estatus regulados y paneles de métricas).

## Dependencias Clave del Proyecto

El entorno requiere la instalación de los siguientes módulos núcleo:

```bash

# Núcleo y Variables de Entorno

pnpm i @nestjs/config



# Documentación de API

pnpm i @nestjs/swagger swagger-ui-express



# Persistencia y Driver MariaDB

pnpm i @nestjs/typeorm typeorm mysql2



# Validación de Datos

pnpm i class-validator class-transformer

```

## Inicialización del Servidor y Documentación

1. Asegúrate de configurar correctamente tus variables de entorno (`.env`) en la raíz del proyecto para enlazar el contenedor de MariaDB (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`).

2. Levanta el servidor en entorno de desarrollo ejecutando:

   ```

   npm run start:dev

   ```

3. Una vez iniciado, puedes ingresar a la documentación interactiva en la siguiente ruta local:

   URL Swagger: http://localhost:3000/api/docs

   

   

## Proyecto 4: Frontend Angular

Este proyecto corresponde al desarrollo de la interfaz de usuario utilizando **Angular (v21)** con una arquitectura moderna basada en **Standalone Components** y control de estado reactivo mediante **Signals** y **State Services**. La aplicación implementa **Angular Material** como librería de componentes de diseño, ofreciendo una experiencia responsiva, fluida y optimizada para la gestión transaccional de la matrícula escolar.

## Inicialización del Servidor Frontend

1. Asegúrate de tener instalado el gestor de paquetes de tu preferencia (este proyecto utiliza `pnpm` o `npm`).

2. Instala las dependencias del ecosistema ejecutando en la raíz de la carpeta de frontend

   Bash

   ```

   pnpm install

   ```

3. Levanta el servidor de desarrollo local con el comando:

   Bash

   ```

   pnpm start

   ```

   *Nota: Por defecto, la aplicación estará disponible en tu navegador en la ruta `http://localhost:4200/`.*
