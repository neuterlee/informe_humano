# Informe Humano - Visualización de Casos de Personas Desaparecidas en Jalisco

## Descripción

Este proyecto es una página web estática diseñada para visibilizar y crear conciencia sobre los casos de personas desaparecidas en Jalisco, México[cite: 1, 2, 3]. Utiliza datos reales anonimizados para presentar la historia y la ficha de desaparición de una persona de manera secuencial y sensible[cite: 1, 2]. El objetivo es recordar que detrás de cada número hay una historia humana y fomentar la difusión de estos casos[cite: 1, 2].

La información de los casos parece provenir del Registro Estatal de Personas Desaparecidas de Jalisco, basado en las URL de las fotografías encontradas en los datos[cite: 3].

## Funcionalidad

1.  **Carga de Caso**: Al cargar la página, se selecciona un caso de persona desaparecida, ya sea aleatoriamente o mediante un identificador (`id`) proporcionado en la URL (`?id=...`)[cite: 2].
2.  **Visualización Secuencial**: La información del caso se presenta en secciones que aparecen una tras otra[cite: 2]:
    * Mensaje inicial introduciendo la historia[cite: 1].
    * Fotografía de la persona[cite: 1, 2].
    * Narrativa/descripción anonimizada del caso, mostrada con un efecto de máquina de escribir[cite: 1, 2, 3].
    * Ficha de desaparición con detalles como nombre, edad, características físicas, fecha y lugar de desaparición[cite: 1, 2, 3].
    * Mensaje indicando los días que la persona lleva desaparecida[cite: 1, 2].
    * Mensaje de concientización sobre la frecuencia de estos casos en Jalisco[cite: 1].
    * Sección final con botones para compartir el caso en redes sociales y un botón para mostrar otro caso[cite: 1, 2].
3.  **Navegación**: Una vez completada la secuencia inicial, se habilita la navegación entre las diferentes secciones mediante las teclas de flecha (izquierda/derecha) en escritorio o deslizando (izquierda/derecha) en dispositivos móviles[cite: 2, 4].
4.  **Mostrar Otro Caso**: El botón de refrescar permite cargar y visualizar un nuevo caso aleatorio[cite: 2].
5.  **Compartir**: Se proporcionan enlaces para compartir fácilmente la URL específica del caso visualizado en redes sociales (Facebook, Twitter, WhatsApp, Instagram)[cite: 1, 2].

## Datos

El proyecto utiliza un archivo CSV (`data/processed_cases.csv`) que contiene la información detallada y anonimizada de los casos de personas desaparecidas[cite: 2, 3]. Este archivo incluye campos como ID, nombre, edad, sexo, descripción, fecha de desaparición, municipio, estado, estatus y la URL de la fotografía[cite: 3].

## Tecnologías Utilizadas

* **HTML**: Para la estructura de la página web[cite: 1].
* **CSS**: Para el diseño visual, estilos, animaciones y responsividad[cite: 4].
* **JavaScript**: Para la lógica de la aplicación, incluyendo la carga de datos del CSV, la selección de casos, la manipulación del DOM, las animaciones (máquina de escribir, secuencia de aparición), el cálculo de días desaparecidos, la generación de enlaces para compartir y la gestión de la navegación[cite: 2].

## Cómo Visualizar

Al ser un proyecto web estático, puede visualizarse localmente:

1.  Asegúrate de tener todos los archivos y carpetas (`index.html`, `css/`, `js/`, `data/`, `static/`) en la misma ubicación.
2.  Abre el archivo `index.html` en un navegador web moderno.

*Nota: Debido a las políticas de seguridad del navegador (CORS), la carga del archivo CSV local (`Workspace('data/processed_cases.csv')`) podría no funcionar correctamente si simplemente abres el `index.html` directamente desde el sistema de archivos (`file:///...`). Para asegurar la funcionalidad completa, es recomendable servir los archivos a través de un servidor web local (por ejemplo, usando Python `http.server`, `live-server` de Node.js, etc.).*