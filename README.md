# Fuxion Dr. Columbus Virtual 3.1

Aplicación PWA de Sistema Experto para recomendaciones de productos Fuxion basada en la lógica del Dr. Ivan Columbus.

## Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 16 o superior)

## Instrucciones de Instalación

1.  Abre una terminal en la carpeta del proyecto.
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```
4.  Abre tu navegador en la URL que se muestra (usualmente `http://localhost:5173`).

## Funcionalidades Incluidas

- **Dashboard**: Historial de consultas y acceso rápido.
- **Formulario Inteligente**: Perfilamiento guiado (Paso a paso).
- **Motor Lógico**: Algoritmo de decisión (Limpieza, Nutrición, Potenciación) con matriz de riesgo.
- **Integración WhatsApp**: Generación automática de mensajes con emojis.
- **Modo Impresión**: Diseño optimizado para generar PDFs profesionales.
- **Persistencia Local**: Guarda el historial en el navegador.

## Estructura del Proyecto

- `src/logic/columbusEngine.js`: Cerebro de la aplicación.
- `src/data/products.js`: Base de datos de productos.
- `src/pages`: Vistas de la aplicación.
