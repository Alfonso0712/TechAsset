# Guía de Evaluación Funcional y Escenarios de Uso Reales — TechAsset
**Organización:** Innovatech Solutions S.A.C.  
**Referencia:** Caso Práctico Integrador (Actividad 6, Páginas 8–10)  
**Rama:** `fix/cumplimiento-caso`  
**Fecha de Certificación:** 18 de Noviembre de 2026 (Zona horaria: America/Lima, UTC-5)

---

## Índice de Escenarios de Prueba

1. [Escenario 1: Registrar Usuario Corporativo (RF-01, RN-08)](#escenario-1-registrar-usuario-corporativo)
2. [Escenario 2: Registrar Equipo Tecnológico en Inventario (RF-05, RN-07)](#escenario-2-registrar-equipo-tecnológico-en-inventario)
3. [Escenario 3: Registrar Préstamo de Equipo Tecnológico (RF-09, RN-01, RN-02, RN-03, RN-04, RN-05)](#escenario-3-registrar-préstamo-de-equipo-tecnológico)
4. [Escenario 4: Registrar Devolución de Equipo Tecnológico (RF-10, RN-04, RN-10)](#escenario-4-registrar-devolución-de-equipo-tecnológico)
5. [Escenario 5: Consultar Inventario y Filtrar por Estado (RF-07, RN-06)](#escenario-5-consultar-inventario-y-filtrar-por-estado)
6. [Escenario 6: Consultar Historial y Auditoría de Préstamos (RF-11, RF-12, RF-17)](#escenario-6-consultar-historial-y-auditoría-de-préstamos)
7. [Escenario 7: Consultar Dashboard Ejecutivo e Indicadores Mínimos (RF-13, RF-14, RF-15, RF-16)](#escenario-7-consultar-dashboard-ejecutivo-e-indicadores-mínimos)

---

## Escenario 1: Registrar Usuario Corporativo

- **Código:** ESC-01
- **Requisitos Vinculados:** RF-01, RN-08 (Unicidad de correo electrónico corporativo).
- **Actor Responsable:** `Administrador` (`admin@innovatech.com`).
- **Precondiciones:** Sesión iniciada con rol Administrador en `http://localhost:5173/ingresar`.

### Paso a Paso
1. En la barra lateral de navegación, hacer clic en la opción **Usuarios**.
2. Verificar que la cabecera muestre el título *"Usuarios"* y el botón superior derecho `+ Nuevo usuario`.
3. Hacer clic en el botón `+ Nuevo usuario`.
4. En el modal emergente *"Nuevo usuario"*, ingresar los siguientes datos:
   - **Nombres (*):** `Ana María`
   - **Apellidos (*):** `Torres Meza`
   - **Correo corporativo (*):** `ana.torres@innovatech.com`
   - **Contraseña temporal (*):** `Temporal2026!` (mínimo 8 caracteres, estilo unificado con `autoComplete="new-password"`).
   - **Área (*):** Seleccionar `Diseño y Experiencia (UX/UI)`.
   - **Rol (*):** Seleccionar `Colaborador`.
5. Hacer clic en el botón `Registrar usuario`.

### Resultado Esperado
- El modal se cierra automáticamente.
- Se emite una notificación Toast en la esquina inferior: *"Usuario registrado con éxito."*
- La tabla de usuarios se actualiza mostrando a `Ana María Torres Meza`, con badge `Colaborador`, estado `Activo` y fecha de alta correspondiente.
- **Validación RN-08:** Si se intenta registrar nuevamente el correo `ana.torres@innovatech.com`, el sistema bloquea el envío y muestra en línea: *"Ya existe una cuenta con ese correo corporativo. Inicie sesión o utilice otro correo."* (HTTP 409 Conflict).

### Evidencias Automatizadas
- Backend: `tests/TechAsset.Tests/Unit/RN08_UnicidadCorreoTests.cs`
- Frontend: `frontend/src/tests/validadores.test.js`

---

## Escenario 2: Registrar Equipo Tecnológico en Inventario

- **Código:** ESC-02
- **Requisitos Vinculados:** RF-05, RN-07 (Unicidad del código patrimonial).
- **Actor Responsable:** `Responsable de Tecnología` (`resp.tecnologia@innovatech.com`) o `Administrador`.
- **Precondiciones:** Sesión iniciada con rol autorizado en `/ingresar`.

### Paso a Paso
1. En el menú lateral, seleccionar **Equipos**.
2. En la cabecera de página, hacer clic en el botón `+ Nuevo equipo`.
3. En el modal *"Nuevo equipo"*, completar los campos requeridos:
   - **Código patrimonial (*):** `EQ-LAP-099` (debe ser único).
   - **Nombre del equipo (*):** `ThinkPad T14s Gen 5`
   - **Categoría (*):** `Laptop`
   - **Marca (*):** `Lenovo`
   - **Ubicación física (*):** `Almacén TI - Estante B2`
   - **Estado inicial:** `Disponible`
4. Hacer clic en `Registrar equipo`.

### Resultado Esperado
- El modal se cierra y el Toast confirma: *"Equipo registrado con éxito."*
- El nuevo activo figura en el listado de inventario con estado `Disponible` (badge verde semántico con contraste WCAG AAA).
- En el módulo de auditoría (`/reportes?tab=movimientos`), se genera un registro inmutable de tipo `AltaEquipo` con fecha/hora local de Lima.
- **Validación RN-07:** Si se intenta registrar un equipo con un código ya existente (ej. `EQ-LAP-001`), el campo muestra inmediatamente el error en línea: *"El código patrimonial ingresado ya está registrado para otro equipo en el sistema."*

### Evidencias Automatizadas
- Backend: `tests/TechAsset.Tests/Unit/RN07_UnicidadCodigoPatrimonialTests.cs`
- Frontend: `frontend/src/tests/validadores.test.js`

---

## Escenario 3: Registrar Préstamo de Equipo Tecnológico

- **Código:** ESC-03
- **Requisitos Vinculados:** RF-09, RN-01, RN-02, RN-03, RN-04, RN-05.
- **Actores:**
  - *Variante A (Autoservicio):* `Colaborador` (`colaborador1@innovatech.com`).
  - *Variante B (Directo en ventanilla TI):* `Responsable de Tecnología`.

### Paso a Paso (Variante A – Solicitud de Colaborador)
1. Iniciar sesión como `colaborador1@innovatech.com`.
2. Dirigirse a la vista **Equipos** o **Mis préstamos**.
3. En la tabla de Equipos, localizar un equipo con estado `Disponible` y presionar el botón `Solicitar`, o hacer clic en `+ Solicitar préstamo` en la barra superior.
4. En el modal *"Solicitar préstamo"*:
   - Seleccionar el equipo deseado (únicamente se despliegan equipos `Disponible` — RN-02, RN-03).
   - **Fecha de préstamo (*):** Fecha actual (por defecto `fechaHoyLocal()` Lima UTC-5).
   - **Fecha estimada de devolución (*):** Seleccionar una fecha estrictamente posterior (ej. +7 días calendario). El input restringe fechas anteriores mediante el atributo `min`.
   - **Motivo (*):** Ingresar justificación corporativa (ej. *"Desarrollo de sprint 14 y despliegue de microservicios"*). Observar el contador tabular `(65/300)`.
5. Presionar `Solicitar préstamo`.

### Paso a Paso (Variante B – Asignación Directa por Responsable TI)
1. Iniciar sesión como `resp.tecnologia@innovatech.com`.
2. Navegar a **Préstamos** y presionar `+ Registrar préstamo`.
3. Seleccionar al colaborador beneficiario, el equipo disponible, las fechas y el motivo.
4. Presionar `Otorgar Préstamo`.

### Resultado Esperado
- En Variante A: El préstamo se crea en estado `Pendiente`. El colaborador visualiza el registro en *"Mis préstamos"* con estado `Pendiente`. El Responsable de TI recibe la solicitud en la sección *"Requiere tu atención"* del Panel con botones `Aprobar` y `Rechazar`.
- En Variante B: El préstamo nace inmediatamente en estado `Activo` asignando al Responsable logueado como custodio (RN-05). El equipo pasa automáticamente de `Disponible` a `Prestado` en inventario (RN-01).
- **Validación RN-04:** Si se ingresa una fecha de devolución menor o igual a la de préstamo, el sistema muestra el error: *"La fecha estimada de devolución debe ser estrictamente posterior a la fecha de préstamo (RN-04)."*

### Evidencias Automatizadas
- Backend: `RN01_UnicidadPrestamoActivoTests.cs`, `RN04_CronologiaDevolucionTests.cs`, `RN05_CustodiaResponsableTests.cs`
- Frontend: `frontend/src/tests/validadores.test.js`

---

## Escenario 4: Registrar Devolución de Equipo Tecnológico

- **Código:** ESC-04
- **Requisitos Vinculados:** RF-10, RN-04, RN-10 (Observación técnica obligatoria 10–500 caracteres).
- **Actor Responsable:** `Responsable de Tecnología`.
- **Precondiciones:** Existencia de al menos un préstamo en estado `Activo`.

### Paso a Paso
1. Iniciar sesión como `resp.tecnologia@innovatech.com`.
2. Navegar al módulo **Préstamos**.
3. Hacer clic en la pestaña o chip **Activos**.
4. En la fila del préstamo deseado, ubicar la columna de acciones y hacer clic en el botón verde con texto visible `Registrar devolución`.
5. En el modal *"Registrar Devolución de Equipo"*:
   - Verificar los datos del equipo y colaborador mostrados en el resumen.
   - **Fecha de devolución real (*):** Se prellena con la fecha de hoy en Lima (`fechaHoyLocal()`).
   - **Observación técnica de entrega (*):** Ingresar el diagnóstico físico y funcional (ej. *"Equipo retornado en perfecto estado operativo. Teclado, batería y cargador original verificados."*).
   - Marcar el checkbox obligatorio: `[x] Confirmo la recepción física del activo y el diagnóstico ingresado`.
6. Presionar `Confirmar Devolución`.

### Resultado Esperado
- El estado del préstamo cambia a `Devuelto` y se registra la fecha real y la observación.
- El equipo asociado pasa automáticamente de `Prestado` a `Disponible` en inventario.
- Se registra un movimiento de auditoría `DevolucionRegistrada` con el usuario responsable que recibió el equipo.
- El Toast notifica: *"Devolución registrada exitosamente. El equipo vuelve a estar disponible."*
- **Validación RN-10:** Si se intenta confirmar con una observación menor a 10 caracteres o vacía, el sistema bloquea la acción indicando: *"La observación técnica sobre el estado del equipo es obligatoria (RN-10, mínimo 10 caracteres)."*

### Evidencias Automatizadas
- Backend: `tests/TechAsset.Tests/Unit/RN10_ObservacionDevolucionTests.cs`
- Frontend: `frontend/src/tests/reportesTablas.test.jsx`

---

## Escenario 5: Consultar Inventario y Filtrar por Estado

- **Código:** ESC-05
- **Requisitos Vinculados:** RF-07, RN-06 (Restricción de eliminación de activos con historial).
- **Actores:** `Administrador`, `Responsable de Tecnología`, `Colaborador`.

### Paso a Paso
1. Acceder al módulo **Equipos**.
2. Observar en la parte superior la fila de chips interactivos de estado con conteos en tiempo real:
   - `Todos` (ej. 31)
   - `Disponibles` (ej. 17)
   - `Prestados` (ej. 8)
   - `Mantenimiento` (ej. 4)
   - `Baja` (ej. 2)
3. Hacer clic sobre el chip `Disponibles`. Verificar que la tabla se filtre al instante mostrando únicamente equipos disponibles.
4. En el campo de búsqueda rápida, tipear `"MacBook"`. Comprobar que el filtro reactivo (con debounce de 300ms) reduzca la lista a las laptops MacBook disponibles.
5. Hacer clic en `Limpiar filtros` y verificar que se restablezca el total de registros.
6. En la fila de un equipo con préstamos históricos, verificar que no exista botón de eliminación destructiva (RN-06), existiendo únicamente las opciones `Editar`, `Cambiar estado` e `Historial`.

### Resultado Esperado
- Búsqueda y filtrado instantáneo sin recargas de página.
- Conteo tabular consistente entre chips y registros listados.
- Preservación de la regla de oro de eliminación física no permitida.

### Evidencias Automatizadas
- Backend: `RN06_BajaLogicaEquipoConPrestamosTests.cs`
- Frontend: `frontend/src/tests/IconButton.test.jsx`

---

## Escenario 6: Consultar Historial y Auditoría de Préstamos

- **Código:** ESC-06
- **Requisitos Vinculados:** RF-11, RF-12, RF-17.
- **Actores:** `Administrador`, `Responsable de Tecnología`, `Colaborador`.

### Paso a Paso
1. Iniciar sesión como `Administrador` y abrir **Préstamos**.
2. Comprobar que se visualizan todos los préstamos institucionales con columnas: `Solicitante`, `Equipo`, `Período`, `Estado`, `Responsable` (mostrando *"—"* cuando está pendiente) y `Acciones`.
3. Para préstamos en estado `Activo` cuya fecha estimada sea anterior a la fecha de hoy Lima, comprobar la presencia del badge rojo semántico `Vencido` junto al estado.
4. Presionar el botón de icono `Detalle` (ojo) para abrir la ventana con el historial completo, motivo y observaciones.
5. Navegar a **Reportes** > pestaña **Movimientos de Auditoría (RF-17)**.
6. Verificar el listado paginado de eventos inmutables ordenados cronológicamente con fecha/hora Lima, usuario actor, equipo, tipo de evento y detalle técnico.
7. Probar el filtro por equipo seleccionando un equipo particular (o vía URL `?equipoId=...`).
8. Presionar el botón `Descargar CSV` y comprobar que el archivo descargado contenga codificación UTF-8 con BOM legible en Microsoft Excel.

### Resultado Esperado
- Visualización de la trazabilidad completa sin campos vacíos, valores `undefined` ni `NaN`.
- Archivo CSV descargado con caracteres españoles (tildes, eñes) preservados.

### Evidencias Automatizadas
- Backend: `ReporteContratoTests.cs`
- Frontend: `frontend/src/tests/reportesTablas.test.jsx`

---

## Escenario 7: Consultar Dashboard Ejecutivo e Indicadores Mínimos

- **Código:** ESC-07
- **Requisitos Vinculados:** RF-13, RF-14, RF-15, RF-16.
- **Actores:** `Administrador`, `Responsable de Tecnología`.

### Paso a Paso
1. Iniciar sesión y acceder a la vista **Inicio** (`/panel`).
2. Verificar en la parte superior las **6 tarjetas KPI** exactamente en el orden solicitado por el caso integrador:
   1. **Total de equipos** (ej. 31) — Icono `Laptop`.
   2. **Equipos disponibles** (ej. 17) — Icono semántico verde `CheckCircle2`.
   3. **Equipos prestados** (ej. 8) — Icono azul `UserCheck`.
   4. **Equipos en mantenimiento** (ej. 4) — Icono ámbar `Wrench`.
   5. **Total de préstamos** (ej. 25) — Icono `CalendarCheck`.
   6. **Área con mayor uso** (ej. *Desarrollo de Software*, con conteo de préstamos) — Icono `Building2`.
3. Verificar la franja informativa de **Resumen de actividad**:
   - `Hoy: N préstamos registrados` (calculado con reloj local Lima UTC-5).
   - `Esta semana: N devoluciones previstas`
   - Si existen préstamos vencidos: alerta destacada en texto rojo `• N vencidos`.
4. Revisar la gráfica de dona interactiva de distribución con tokens de color semánticos (`grafico-disponible`, `grafico-prestado`, `grafico-mantenimiento`, `grafico-baja`).
5. Revisar la tabla de ranking de las 6 áreas corporativas, con barras proporcionales y resaltado cian `#06A3DA` en el puesto número 1.
6. Navegar a **Reportes** y verificar las 4 secciones analíticas:
   - **Equipos por estado:** Dona + 4 cards fijas + tabla inferior con filtro bidireccional.
   - **Equipos más utilizados:** Top 10 con medallas (oro, plata, bronce) para los 3 primeros lugares, sin valores `NaN`.
   - **Préstamos por área:** Gráfico de barras horizontales SVG y tabla consolidada con las 6 áreas y porcentajes calculados.
   - **Trazabilidad de movimientos:** Tabla inmutable con exportación a CSV.

### Resultado Esperado
- Cuadro de mando 100% interactivo, con contraste verificado WCAG AA/AAA, sin etiquetas crudas ni textos truncados.
- Relación armónica de datos entre dashboard, inventario y reportes.

### Evidencias Automatizadas
- Backend: `ReporteContratoTests.cs`, `SeederTests.cs`
- Frontend: `frontend/src/tests/reportesTablas.test.jsx`, `frontend/src/tests/IconButton.test.jsx`
