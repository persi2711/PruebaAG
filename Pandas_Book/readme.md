# Sistema de Análisis y Visualización de Alumnos

Este proyecto consiste en un análisis de datos y módulo de visualización desarrollado en un **Jupyter Notebook (`.ipynb`)**. Se conecta a la infraestructura de MariaDB para extraer la información operativa e histórica de los alumnos, procesarla utilizando **Pandas** y generar insights clave de negocio a través de representaciones gráficas con **Matplotlib** y **Seaborn**.

## Análisis y Gráficas Solicitadas

El Notebook cubre los siguientes requerimientos de la prueba técnica:

1. **Distribución de Estatus Actual por Programa:** Procesado mediante una tabla pivote para agrupar el volumen absoluto de alumnos.
2. **Evolución Mensual de Movimientos:** Línea de tiempo analítica que contrasta el flujo de altas frente a las deserciones/bajas del sistema.
3. **Tasa de Alumnos Activos:** Porcentaje de retención real por cada programa en comparación con su histórico de inscritos.
4. **Identificación de Bajas Frecuentes:** Minería de texto sobre la columna `motivo` de las bitácoras para aislar las causas principales de deserción.
5. **Entregables Visuales:**
   - Gráfica de barras apiladas.
   - Gráfica de líneas temporales .

---

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

## Respuestas Teóricas de la Prueba

1.  Pregunta 3: Tienes un DataFrame con 50,000 registros de movimientos. Al hacer un groupby por programa y mes, algunos meses no aparecen para ciertos programas. ¿Qué causa eso y cómo lo resuelves?
    R: El comportamiento nativo de `.groupby()` en Pandas solo genera agrupaciones basadas en las combinaciones de datos que **físicamente existen** en el DataFrame. Si en un mes específico ningún alumno se inscribió o causó baja en un programa en particular, esa fila no se crea en el resultado, lo que genera saltos temporales y distorsiona las gráficas de líneas.
    Si las columnas de agrupación son de tipo categórico o de periodos (`PeriodIndex`), se puede pasar el argumento `observed=False` en el `.groupby()` para forzar a Pandas a rellenar los valores faltantes del catálogo. La solución universal y más robusta es generar un índice completo (MultiIndex) que contenga el producto cartesiano de todos los programas posibles por todos los meses del rango temporal usando `pd.multi_index.from_product()`, y posteriormente aplicar un `.reindex()` llenando los huecos con ceros (`fill_value=0`). Esto garantiza una línea de tiempo continua para las visualizaciones.
2.  ¿Cuál es la diferencia entre usar `merge` y `join` en pandas? ¿Cuándo usarías cada uno?
    R: Ambas funciones sirven para combinar conjuntos de datos, pero difieren en su sintaxis y en cómo buscan las conciencias:
    **pd.merge():**
    Está diseñado para unir DataFrames basándose en los valores de columnas comunes (equivalente a un `JOIN` con la cláusula `ON` en SQL). Permite especificar condiciones complejas como `left_on` y `right_on` cuando los nombres de las columnas difieren. Es la opción por defecto cuando necesitas relacionar tablas mediante llaves foráneas lógicas, por ejemplo, acoplar la tabla de `inscripciones` con la tabla de `programas` usando la columna `programa_id`.
    **DataFrame.join():**
    Está optimizado para combinar DataFrames utilizando sus **índices (`Index`)** en lugar de columnas, operando de manera predeterminada como un `LEFT JOIN`. Se utiliza cuando los DataFrames ya están indexados por la misma clave de búsqueda (por ejemplo, después de aplicar un `.set_index()`) o cuando necesitas unir múltiples DataFrames de forma simultánea compartiendo una estructura de filas idéntica, ofreciendo una velocidad de ejecución significativamente mayor.

## Estructura del Componente

```
├── Analisis_Alumnos.ipynb  # Jupyter Notebook principal con las celdas documentadas
└── README.md               # Explicación de las preguntas y guía de uso (Este archivo)
```
