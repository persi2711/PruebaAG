# Proyecto Gestión de Alumnos: API Backend (NestJS)

Este proyecto corresponde al desarrollo de la API Backend utilizando **NestJS (v11)** y **TypeORM** como ORM, conectada a una base de datos relacional **MariaDB**. La API expone endpoints optimizados y validados para resolver las peticiones de una interfaz de usuario frontend (catálogos, registro transaccional, cambios de estatus regulados y paneles de métricas).

## Arquitectura y Características del Diseño

- **Controlador Único:** Centraliza todos los endpoints en un solo lugar, haciendo la API más limpia y fácil de evaluar.
- **Transacciones Seguras (ACID):** El registro y los cambios de estatus usan transacciones; si algo falla, se aplica un _rollback_ automático para evitar datos corruptos.
- **Validación Estricta:** Bloquea de forma global cualquier dato basura o propiedad maliciosa que no corresponda a los DTOs definidos.
- **Integridad con la BD:** Sincroniza y respeta directamente las restricciones físicas del esquema SQL (campos obligatorios, llaves foráneas y estados válidos).
- **Documentación con Swagger:** Genera una interfaz interactiva en el navegador para probar todos los endpoints en tiempo real.

---

## Estructura de Endpoints Desarrollados

La API expone la ruta base `/api/sistema-alumnos` con los siguientes recursos para suplir las necesidades del Frontend:

### 1. Gestión de Alumnos e Inscripciones

- `POST /alumnos` - **Registrar Alumno:** Recibe datos personales e IDs maestros. Ejecuta una transacción para poblar de forma coordinada las tablas `perfil_info`, `alumnos`, `inscripciones` (con estatus inicial `'Inscrito'`) e inserta la primera bitácora en `historial_inscripciones`.
- `GET /alumnos` - **Catálogo de Alumnos con Filtros:** Retorna la lista unificada (`leftJoinAndSelect`) para alimentar la tabla principal. Permite el filtrado dinámico mediante Query Params (`?estatus=Activo&programaId=2`).
- `PATCH /alumnos/cambiar-estatus` - **Cambio de Estatus Oficial:** Modifica el estado actual de un alumno en un programa y registra de manera obligatoria la transición en `historial_inscripciones` solicitando un campo `motivo`.

### 2. Cuadro de Mando e Historiales

- `GET /dashboard/resumen` - **Métricas de Rendimiento:** Ejecuta una consulta agregada (`COUNT` + `GROUP BY`) optimizada directo en el motor de la BD para retornar los contadores por estado para las tarjetas del Dashboard.
- `GET /alumnos/:uuid/historial` - **Perfil y Línea de Tiempo:** Busca a un alumno mediante su `uuid_publico` (CHAR 36) por seguridad y retorna toda la información de su perfil junto a su bitácora cronológica de estados para pintar un componente tipo _Timeline_.

### 3. Catálogos Maestros (Selects)

- `GET /maestros/empresas` - Lista de empresas ordenada alfabéticamente.
- `GET /maestros/programas` - Lista de programas académicos ordenada alfabéticamente.

---

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
   ```
    URL Swagger: http://localhost:3000/api/docs
   ```
