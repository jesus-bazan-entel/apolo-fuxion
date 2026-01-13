# Guía de Mantenimiento y Actualización de Lógica

Tu aplicación en Vercel no se "conecta" en tiempo real a NotebookLM. Funciona con la lógica que ya hemos programado en ella.

Piensa en este flujo de trabajo:
- **NotebookLM** es el "Cerebro Investigador" (Donde se analiza la nueva información).
- **Tu App (Vercel)** es el "Asistente Ejecutor" (Sigue las instrucciones que le dimos).

Tú eres el puente entre ambos. Este es el proceso para actualizar la app cuando sale un producto nuevo o el Dr. Columbus da una nueva regla:

## Flujo de Actualización (SOP)

### Paso 1: Ingesta (NotebookLM)
1.  Sube el nuevo PDF o Video del Dr. Columbus a tu cuaderno en NotebookLM.
2.  Haz la pregunta clave:
    > "Genera la regla lógica para el nuevo producto [NOMBRE]. ¿Quién puede tomarlo? ¿Quién NO debe tomarlo (contraindicaciones)? ¿En qué fase (Limpieza/Nutrición) va?"

### Paso 2: Codificación (Tu Proyecto Local)
Con la respuesta de NotebookLM, abre tu código:

**A. Si es un Producto Nuevo:**
Edita `src/data/products.js` y agrega el bloque:
```javascript
{
  id: 'nuevo_producto',
  name: 'Gano+ Cappuccino',
  line: 'Inmunidad',
  warning: 'Contiene cafeína', // Lo que dijo NotebookLM
  ...
}
```

**B. Si es una Regla Nueva (Lógica):**
Edita `src/logic/columbusEngine.js`:
```javascript
// Ejemplo: NotebookLM dijo que los niños no deben tomar café
if (profile.age < 12) {
   // Eliminar productos con cafeína
}
```

### Paso 3: Despliegue (Automático)
Una vez guardados los cambios en tu PC:
1.  Abre la terminal.
2.  Ejecuta:
    ```bash
    git add .
    git commit -m "Agregado nuevo producto Gano+"
    git push
    ```
3.  **Vercel detectará esto automáticamente** y en 2 minutos tu App mundial estará actualizada con el nuevo conocimiento.

---
**Resumen**: Vercel aloja el "conocimiento congelado" que es súper rápido y seguro. NotebookLM es donde "cocinas" ese conocimiento antes de congelarlo en código.
