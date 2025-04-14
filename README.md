# Archivo Humano - Visualización de Casos de Personas Desaparecidas en Jalisco

## Descripción

Este proyecto es una página web estática diseñada para visibilizar y crear conciencia sobre los casos de personas desaparecidas en Jalisco, México. Utiliza datos reales anonimizados para presentar la historia y la ficha de desaparición de una persona de manera secuencial y sensible. El objetivo es recordar que detrás de cada número hay una historia humana y fomentar la difusión de estos casos.

La información de los casos parece provenir del Registro Estatal de Personas Desaparecidas de Jalisco, basado en las URL de las fotografías encontradas en los datos.

## Funcionalidad

1.  **Carga de Caso**: Al cargar la página, se selecciona un caso de persona desaparecida, ya sea aleatoriamente o mediante un identificador (`id`) proporcionado en la URL (`?id=...`).
2.  **Visualización Secuencial**: La información del caso se presenta en secciones que aparecen una tras otra:
    * Mensaje inicial introduciendo la historia.
    * Fotografía de la persona.
    * Narrativa/descripción anonimizada del caso, mostrada con un efecto de máquina de escribir.
    * Ficha de desaparición con detalles como nombre, edad, características físicas, fecha y lugar de desaparición.
    * Mensaje indicando los días que la persona lleva desaparecida.
    * Mensaje de concientización sobre la frecuencia de estos casos en Jalisco.
    * Sección final con botones para compartir el caso en redes sociales y un botón para mostrar otro caso.
3.  **Navegación**: Una vez completada la secuencia inicial, se habilita la navegación entre las diferentes secciones mediante las teclas de flecha (izquierda/derecha) en escritorio o deslizando (izquierda/derecha) en dispositivos móviles.
4.  **Mostrar Otro Caso**: El botón de refrescar permite cargar y visualizar un nuevo caso aleatorio.
5.  **Compartir**: Se proporcionan enlaces para compartir fácilmente la URL específica del caso visualizado en redes sociales (Facebook, Twitter, WhatsApp, Instagram).

## Datos

El proyecto utiliza un archivo CSV (`data/processed_cases.csv`) que contiene la información detallada y anonimizada de los casos de personas desaparecidas. Este archivo incluye campos como ID, nombre, edad, sexo, descripción, fecha de desaparición, municipio, estado, estatus y la URL de la fotografía.

## Tecnologías Utilizadas

* **HTML**: Para la estructura de la página web.
* **CSS**: Para el diseño visual, estilos, animaciones y responsividad.
* **JavaScript**: Para la lógica de la aplicación, incluyendo la carga de datos del CSV, la selección de casos, la manipulación del DOM, las animaciones (máquina de escribir, secuencia de aparición), el cálculo de días desaparecidos, la generación de enlaces para compartir y la gestión de la navegación.

## Cómo Visualizar

Al ser un proyecto web estático, puede visualizarse localmente:

1.  Asegúrate de tener todos los archivos y carpetas (`index.html`, `css/`, `js/`, `data/`, `static/`) en la misma ubicación.
2.  Abre el archivo `index.html` en un navegador web moderno.

*Nota: Debido a las políticas de seguridad del navegador (CORS), la carga del archivo CSV local (`Workspace('data/processed_cases.csv')`) podría no funcionar correctamente si simplemente abres el `index.html` directamente desde el sistema de archivos (`file:///...`). Para asegurar la funcionalidad completa, es recomendable servir los archivos a través de un servidor web local (por ejemplo, usando Python `http.server`, `live-server` de Node.js, etc.).*