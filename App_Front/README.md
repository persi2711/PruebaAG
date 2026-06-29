# Proyecto Gestión de Alumnos: Frontend Angular

Este proyecto corresponde al desarrollo de la interfaz de usuario utilizando **Angular (v21)** con una arquitectura moderna basada en **Standalone Components** y control de estado reactivo mediante **Signals** y **State Services**. La aplicación implementa **Angular Material** como librería de componentes de diseño, ofreciendo una experiencia responsiva, fluida y optimizada para la gestión transaccional de la matrícula escolar.

## Arquitectura y Características del Diseño

- **Componentes Standalone:** Desarrollo modular sin `NgModules`, reduciendo el acoplamiento y optimizando la compilación.
- **Reactividad con Signals:** Uso de `signal`, `computed` e `input.required` para una gestión de estado ligera y eficiente sin sobrecargar el ciclo de vida.
- **Desacoplamiento con State Pattern:** Separación estricta entre la UI y la lógica mediante `AlumnosStateService`. Los componentes solo reaccionan al estado (Dumb Components).
- **Rutas Vinculadas (withComponentInputBinding):** Inyección automática de parámetros de la URL (`:uuid`) directamente como Signals en las vistas de detalle.
- **Diseño Responsivo Nativo:** Uso de CSS Grid y scroll horizontal aislado (`overflow-x: auto`) para garantizar usabilidad móvil perfecta en pantallas táctiles sin deformar la interfaz.

## Inicialización del Servidor Frontend

1. Asegúrate de tener instalado el gestor de paquetes de tu preferencia (este proyecto utiliza `pnpm` o `npm`).
2. Instala las dependencias del ecosistema ejecutando en la raíz de la carpeta de frontend:

   Bash

   ```
   pnpm install
   ```

3. Levanta el servidor de desarrollo local con el comando:

   Bash

   ```
   pnpm start
   ```

   _Nota: Por defecto, la aplicación estará disponible en tu navegador en la ruta `http://localhost:4200/`._

## Estructura de Módulos y Componentes Desarrollados

La aplicación se divide en las siguientes vistas clave dentro del subdirectorio de gestión:

### 1. Dashboard Principal (`/home`)

- Visualiza el estado general de la matrícula mediante el consumo del endpoint de métricas agregadas.
- Organiza tarjetas minimalistas reutilizables (`MetricCardComponent`) que reciben parámetros puros (`title`, `value`) mediante _Signal Inputs_ e inline styles planos para garantizar un empaquetado nativo veloz.

### 2. Control de Alumnos (`/alumnos`)

- **Página Contenedora:** Coordina los selectores de filtrado reactivo por Empresa y Programa Académico.
- **Tabla Desacoplada:** Utiliza `MatTableDataSource` enlazado a un `BehaviorSubject` dentro del servicio de estado para renderizar y paginar localmente miles de registros del cliente sin congelar el hilo del navegador.
- **Interacciones de Fila:** Botones perfectamente alineados para disparar los flujos de navegación hacia el perfil o detonar los modales operativos.

### 3. Modales Transaccionales (Estructurados mediante Servicios)

- **Cambio de Estatus Oficial (`ModalEstatusComponent`):** Integra `FormsModule` y una Signal computada (`computed`) que lee el programa seleccionado por el usuario y filtra el dropdown en tiempo real, bloqueando la capacidad de re-seleccionar el mismo estado de esa inscripción.
- **Registro de Alumnos (`FormularioAlumnoComponent`):** Orquestado a través de `ReactiveFormsModule`. Ejecuta peticiones concurrentes con `forkJoin` para poblar catálogos y aplica validaciones personalizadas estrictas (formato telefónico internacional `+52` y restricción de campos puramente numéricos).

### 4. Perfil y Línea de Tiempo (`/alumnos/:uuid`)

- Renderiza una vista asimétrica responsiva (1/3 perfil personal - 2/3 historial).
- Construye una bitácora cronológica (_Timeline_) decorada con badges semánticos a partir de la relación histórica de estados.
- **Manejo de Robustez (Edge Cases):** Implementa intercepción de fallos en imágenes mediante el evento `(error)` para inyectar un _placeholder_ por defecto y una pantalla de desbordamiento completo (_Fallback UI_) en caso de que el UUID ingresado no exista (Error 404).

## Respuestas a Evaluación de Arquitectura y Optimización

#### Pregunta 5: Tu componente de tabla de alumnos re-renderiza completo cada vez que cambias el estatus de uno solo. ¿Qué causaría eso y cómo lo optimizarías?

La re-renderización completa de la tabla al actualizar un solo estatus es causada por la estrategia por defecto (`ChangeDetectionStrategy.Default`), la cual fuerza la verificación de todo el árbol de componentes ante cualquier evento asíncrono, sumado a la falta de un rastreo estructural que destruye y recrea nodos innecesariamente en el DOM. Esto se optimiza configurando el componente con `ChangeDetectionStrategy.OnPush` para limitar la detección a cambios en las referencias de las propiedades y aplicando el rastreo estricto `@for (...; track alumno.id)` para que Angular intervenga exclusivamente el nodo de la fila afectada.

#### Pregunta 6: ¿Dónde guardarías el estatus actual de los alumnos en una app Angular sin backend: en el componente directamente, en un Service compartido, o en localStorage? Justifica tu elección.

En una aplicación sin backend, el estatus actual de los alumnos debe centralizarse en un **Service compartido** para que actúe como la única fuente de verdad viva en memoria y propague los cambios de forma reactiva a todas las vistas, delegando en **localStorage** la persistencia física para salvar y recuperar la data ante recargas de página (`F5`). Bajo este esquema se evita guardar el estado directamente en el componente, ya que estos son efímeros y destruyen su información de manera inmediata al navegar hacia otras rutas del sistema.
