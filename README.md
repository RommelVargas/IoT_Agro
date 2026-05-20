**Backend API & Motor**

Este es el repositorio central del backend para el Radar Financiero. Esta API está diseñada para recibir datos físicos de sensores IoT en fincas cafetaleras, procesar el secado y traducir estas variables en indicadores económicos de pérdida o rentabilidad en tiempo real.

Hasta el momento, hemos configurado los cimientos del servidor en Django y la puerta de entrada de datos:

* **Estructura Modular:** El proyecto está dividido en apps (`core`, `api`, `ingestor`).
* **Modelos de Base de Datos (`core/models.py`):**
  * `Lote`: Identificación y parámetros comerciales del café (peso, precio actual).
  * `Dispositivo`: Registro de hardware.
  * `LecturaSensor`: Registro de variables termodinámicas (Temp, HR, etc.) con trazabilidad de validación.
* **Serialización y Validación (`api/serializers.py`):**
  * Filtros de entrada que bloquean lecturas físicas no adecuadas antes de entrar a la base de datos.
* **Endpoint de Recepción POST (`api/v1/lecturas/`):**
  * Vista lista y probada que recibe JSONs.

## Lo que falta por desarrollar

El trabajo a partir de aquí se divide en los siguiente.

### 1. App `core`
* [ ] Programar las funciones matemáticas (Balances y Ecuaciones) en un archivo `engine.py`.
* [ ] Implementar ecuación de Magnus-Tetens para calcular el Punto de Rocío ($T_{dp}$).
* [ ] Desarrollar la función de costo: Traducción de humedad a pérdida de peso comercial y conversión a dólares (USD).

### 2. Endpoints de Salida (Pasaporte Digital) - App `api`
* [ ] Crear una petición GET (ej. `/api/v1/lotes/<id>/pasaporte`) que empaquete las últimas lecturas y envíe un JSON limpio para la PWA.
* [ ] Desarrollar un sistema de calificación (A, B, C) basado en la varianza de la temperatura del grano.

### 3. Ingestor MQTT - App `ingestor`
* [ ] Crear un script en segundo plano usando `paho-mqtt`.
* [ ] Suscribir el script al tópico de las estacas.
* [ ] Conectar los mensajes MQTT recibidos para que disparen peticiones al endpoint POST que ya existe.

### 4. Generación de Certificados PDF
* [ ] Integrar `WeasyPrint` para generar reportes en PDF.
* [ ] Crear un template HTML/CSS estético con el logo y las variables inyectadas vía Jinja2.

---

## Frontend — Interfaces del sistema

### ¿Qué incluye?

- **Dashboard del agricultor** — visualización en tiempo real de temperatura, humedad y gráficas por lote
- **Pasaporte Digital** — certificado de calidad por lote, accesible desde la vista del agricultor y del comprador
- **Marketplace del comprador** — listado de lotes disponibles con valoración, precio y estado de secado
- **Alertas con recomendaciones** — panel lateral con notificaciones de riesgo (humedad elevada, lluvia detectada, secado completo)
- **Sistema de usuarios mock** — login con credenciales de demo, control de usuarios activos/inactivos sin base de datos
- **Tooltips informativos** — descripciones técnicas accesibles para usuarios no especializados (variedades, calidad, humedad)

### Credenciales de demo

| Email | Contraseña | Estado |
|---|---|---|
| `lopez@finca.com` | `demo1234` | ✅ Activo |
| `cafenorte@finca.com` | `demo1234` | ❌ Inactivo |

### Cómo correr el frontend

> **Requisito previo:** tener [Node.js](https://nodejs.org/) instalado (versión 18 o superior).
> Para verificar: `node -v` en tu terminal. Si no lo tenés, descargalo desde nodejs.org.

```bash
# 1. Instalá pnpm si no lo tenés (solo una vez en tu máquina)
npm install -g pnpm

# 2. Entrá a la carpeta del frontend
cd frontend

# 3. Instalá las dependencias (solo la primera vez)
pnpm install

# 4. Levantá el servidor de desarrollo
pnpm run dev
```

Luego abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

> ℹ️ Si preferís usar `npm` directamente, reemplazá `pnpm install` por `npm install` y `pnpm run dev` por `npm run dev`.

---

## Usa este proyecto en tu máquina

1. Clona este repositorio:
   ```bash
   git clone <https://github.com/RommelVargas/IoT_Agro.git>
