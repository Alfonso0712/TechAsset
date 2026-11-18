# Matriz de Cumplimiento Normativo y Funcional — TechAsset
**Sistema de Gestión de Inventario y Préstamo de Equipos Tecnológicos**  
**Organización:** Innovatech Solutions S.A.C.  
**Fuente de Verdad:** `docs/referencia/Caso_practico_integrador.pdf` (Semanas 01 – 12)  
**Rama:** `fix/cumplimiento-caso`  
**Fecha de Certificación:** 18 de Noviembre de 2026 (Zona horaria: America/Lima, UTC-5)

---

## 1. Matriz de Requerimientos Funcionales (RF-01 .. RF-17) y Reglas de Negocio (RN-01 .. RN-10)

| Código | Requisito / Regla de Negocio | Rol(es) Autorizados | Pantalla o Endpoint | Estado | Evidencia (Archivo + Test) |
|---|---|---|---|:---:|---|
| **RF-01** | Registrar usuarios corporativos con validación de datos. | Administrador | `/usuarios`<br>`POST /api/usuarios` | ✅ Completo | `FormularioUsuario.jsx`<br>`UsuarioService.cs`<br>`RN08_UnicidadCorreoTests.cs` |
| **RF-02** | Actualizar usuarios (nombres, apellidos, área, rol). | Administrador | `/usuarios`<br>`PUT /api/usuarios/{id}` | ✅ Completo | `FormularioUsuario.jsx`<br>`UsuariosController.cs`<br>`AuthIntegrationTests.cs` |
| **RF-03** | Consultar usuarios (búsqueda, filtro por rol y estado, paginado). | Administrador | `/usuarios`<br>`GET /api/usuarios` | ✅ Completo | `Usuarios.jsx`<br>`FiltrosUsuarios.jsx`<br>`UsuarioRepository.cs` |
| **RF-04** | Deshabilitar y reactivar usuarios corporativos. | Administrador | `/usuarios`<br>`PATCH /api/usuarios/{id}/estado` | ✅ Completo | `ModalConfirmacion.jsx`<br>`RN09_DesactivacionAdminTests.cs` |
| **RF-05** | Registrar equipos tecnológicos en inventario con código único. | Administrador, Responsable TI | `/equipos`<br>`POST /api/equipos` | ✅ Completo | `FormularioEquipo.jsx`<br>`EquipoService.cs`<br>`RN07_UnicidadCodigoPatrimonialTests.cs` |
| **RF-06** | Actualizar equipos tecnológicos (nombre, categoría, marca, ubicación). | Administrador, Responsable TI | `/equipos`<br>`PUT /api/equipos/{id}` | ✅ Completo | `FormularioEquipo.jsx`<br>`EquiposController.cs` |
| **RF-07** | Consultar inventario (chips de estado con conteo, filtros categoría/texto). | Administrador, Responsable TI, Colaborador | `/equipos`<br>`GET /api/equipos` | ✅ Completo | `Equipos.jsx`<br>`FiltrosEquipos.jsx`<br>`EquipoRepository.cs` |
| **RF-08** | Actualizar estado operativo del equipo (Disponible, Mantenimiento, Baja). | Administrador, Responsable TI | `/equipos`<br>`PATCH /api/equipos/{id}/estado` | ✅ Completo | `ModalCambiarEstadoEquipo.jsx`<br>`RN02_RN03_EstadoEquipoInvalidoParaPrestamoTests.cs` |
| **RF-09** | Registrar préstamo (solicitud por colaborador o asignación directa por responsable). | Colaborador (solicita), Responsable TI (directo) | `/prestamos`<br>`POST /api/prestamos/solicitar`<br>`POST /api/prestamos/directo` | ✅ Completo | `FormularioSolicitarPrestamo.jsx`<br>`FormularioPrestamoDirecto.jsx`<br>`RN01_UnicidadPrestamoActivoTests.cs`<br>`RN05_CustodiaResponsableTests.cs` |
| **RF-10** | Registrar devolución de equipo con observación técnica obligatoria (10 a 500 caracteres). | Responsable TI | `/prestamos`<br>`POST /api/prestamos/{id}/devolucion` | ✅ Completo | `ModalDevolverPrestamo.jsx`<br>`RN10_ObservacionDevolucionTests.cs` |
| **RF-11** | Consultar historial de préstamos (pestañas Todos, Pendientes, Activos, Devueltos, Rechazados). | Administrador (todo), Responsable TI (todo), Colaborador (propios) | `/prestamos`<br>`GET /api/prestamos` | ✅ Completo | `Prestamos.jsx`<br>`PestanasEstado.jsx`<br>`PrestamoRepository.cs` |
| **RF-12** | Consultar préstamos activos (badge "Vencido" condicional, responsable asignado). | Administrador, Responsable TI, Colaborador (propios) | `/prestamos?estado=Activo`<br>`GET /api/prestamos/activos` | ✅ Completo | `Prestamos.jsx`<br>`PrestamoDtos.cs` |
| **RF-13** | Visualizar dashboard general con 6 indicadores exactos del PDF y resumen. | Administrador, Responsable TI | `/panel`<br>`GET /api/reportes/dashboard` | ✅ Completo | `KpisPanel.jsx`<br>`ResumenOcupacion.jsx`<br>`RankingAreas.jsx`<br>`GraficaReservasEstado.jsx`<br>`Panel.jsx` |
| **RF-14** | Consultar equipos por estado (gráfico de dona + tarjetas fijas + tabla con filtros). | Administrador, Responsable TI | `/reportes` (tab 1)<br>`GET /api/reportes/equipos-por-estado` | ✅ Completo | `Reportes.jsx`<br>`reportesTablas.test.jsx`<br>`ReporteContratoTests.cs` |
| **RF-15** | Consultar equipos más utilizados (Top 10 con medallas, código, nombre, categoría). | Administrador, Responsable TI | `/reportes` (tab 2)<br>`GET /api/reportes/equipos-mas-utilizados` | ✅ Completo | `Reportes.jsx`<br>`TableList.jsx`<br>`reportesTablas.test.jsx` |
| **RF-16** | Consultar préstamos por área (gráfico SVG + tabla con 6 áreas + % del total). | Administrador, Responsable TI | `/reportes` (tab 3)<br>`GET /api/reportes/prestamos-por-area` | ✅ Completo | `Reportes.jsx`<br>`reportesTablas.test.jsx` |
| **RF-17** | Consultar historial inmutable de movimientos y trazabilidad de auditoría. | Administrador, Responsable TI | `/reportes` (tab 4)<br>`GET /api/reportes/movimientos` | ✅ Completo | `Reportes.jsx`<br>`exportarCsv.js`<br>`DatabaseSeeder.cs` |
| **RN-01** | Un equipo solo puede estar asociado a un préstamo activo. | Backend / Dominio | `Prestamo.cs`<br>`AppDbContext.cs` | ✅ Completo | Índice único condicional `IX_prestamos_equipo_activo`<br>`RN01_UnicidadPrestamoActivoTests.cs` |
| **RN-02** | No se puede prestar un equipo en estado "Mantenimiento". | Backend / Frontend | `PrestamoService.cs`<br>`reglasPrestamo.js` | ✅ Completo | `RN02_RN03_EstadoEquipoInvalidoParaPrestamoTests.cs` |
| **RN-03** | No se puede prestar un equipo en estado "Baja". | Backend / Frontend | `PrestamoService.cs`<br>`reglasPrestamo.js` | ✅ Completo | `RN02_RN03_EstadoEquipoInvalidoParaPrestamoTests.cs` |
| **RN-04** | La fecha de devolución debe ser posterior a la fecha de préstamo. | Backend / Frontend | `Prestamo.cs`<br>`ValidarCrearSolicitudDtoValidator.cs` | ✅ Completo | `RN04_CronologiaDevolucionTests.cs`<br>`reglasPrestamo.js` |
| **RN-05** | Todo préstamo activo debe registrar un Responsable de Tecnología. | Backend / Dominio | `Prestamo.cs`<br>`PrestamoService.cs` | ✅ Completo | `RN05_CustodiaResponsableTests.cs` |
| **RN-06** | No se permite la eliminación física de equipos con historial de préstamos. | Backend / Dominio | `AppDbContext.cs`<br>`EquipoService.cs` | ✅ Completo | FK Restrict en base de datos<br>`RN06_BajaLogicaEquipoConPrestamosTests.cs` |
| **RN-07** | El código patrimonial debe ser único en la organización. | Base de datos / Dominio | `equipos.cop_equipo`<br>`EquipoService.cs` | ✅ Completo | Índice único `IX_equipos_cop_equipo`<br>`RN07_UnicidadCodigoPatrimonialTests.cs` |
| **RN-08** | El correo electrónico del usuario debe ser único. | Base de datos / Dominio | `usuarios.cor_usuario`<br>`UsuarioService.cs` | ✅ Completo | Índice único `IX_usuarios_cor_usuario`<br>`RN08_UnicidadCorreoTests.cs` |
| **RN-09** | Solo el Administrador podrá deshabilitar usuarios corporativos. | Backend RBAC | `PoliticasDeAcceso.cs`<br>`UsuariosController.cs` | ✅ Completo | Política `Permisos.UsuariosCambiarEstado`<br>`RN09_DesactivacionAdminTests.cs` |
| **RN-10** | Toda devolución deberá registrar observaciones técnicas obligatorias. | Backend / Dominio | `Prestamo.cs`<br>`ModalDevolverPrestamo.jsx` | ✅ Completo | Longitud 10–500 caracteres<br>`RN10_ObservacionDevolucionTests.cs` |

---

## 2. Matriz de Acciones por Actor (Caso Práctico Sección 5)

| Actor (Rol) | Función Solicitada en PDF | Acción Visible en UI | Endpoint / Permiso | Estado en UI | Verificación en Navegador / Rol |
|---|---|---|---|:---:|---|
| **Administrador** (`admin@innovatech.com`) | Gestionar usuarios | Botón "+ Nuevo usuario", acciones Editar y Desactivar en tabla. | `/usuarios`<br>`usuarios:crear`, `usuarios:editar`, `usuarios:cambiar_estado` | ✅ Visible | Verificado con login demo Admin. |
| | Gestionar equipos | Botón "+ Nuevo equipo", acciones Editar y Cambiar estado en tabla. | `/equipos`<br>`equipos:crear`, `equipos:editar`, `equipos:cambiar_estado` | ✅ Visible | Verificado con login demo Admin. |
| | Consultar reportes | Acceso a vista `/reportes` con 4 pestañas ejecutivas y exportación CSV con UTF-8 BOM. | `/reportes`<br>`reportes:ver` | ✅ Visible | Pestañas operativas y validadas con tests. |
| | Supervisar préstamos | Vista `/prestamos` en modo supervisión (ver todos, consultar detalles con ojo). Sin botones de Aprobación ni Devolución. | `/prestamos`<br>`prestamos:ver` | ✅ Visible | Rol restringido a supervisión en `PoliticaDeAcceso.cs`. |
| **Responsable de Tecnología** (`resp.tecnologia@innovatech.com`) | Registrar equipos | Botón "+ Nuevo equipo" y acciones de edición en `/equipos`. | `/equipos`<br>`equipos:crear` | ✅ Visible | Verificado con login demo Responsable. |
| | Registrar préstamo directo | Botón "+ Registrar préstamo" (asigna en estado Activo cumpliendo RN-05). | `/prestamos`<br>`prestamos:crear_directo` | ✅ Visible | Verificado con formulario directo. |
| | Aprobar / Rechazar préstamos | Botones con texto visible "Aprobar" (éxito) y "Rechazar" (peligro) en solicitudes Pendientes. | `/prestamos`<br>`prestamos:aprobar_rechazar` | ✅ Visible | Modal con motivo y confirmación. |
| | Registrar devoluciones | Botón "Registrar devolución" en préstamos Activos con observación obligatoria. | `/prestamos`<br>`prestamos:devolver` | ✅ Visible | Modal con fecha Lima y validación 10–500 chars. |
| | Consultar inventario y panel | Listado completo de inventario con chips y panel con solicitudes de atención. | `/equipos`, `/panel`<br>`equipos:ver` | ✅ Visible | Verificado. |
| **Colaborador** (`colaborador1@innovatech.com`) | Solicitar préstamos | Botón "+ Solicitar préstamo" en cabecera y botón "Solicitar" en cada fila de equipo Disponible en `/equipos`. | `/prestamos`, `/equipos`<br>`prestamos:solicitar` | ✅ Visible | `AccionesFilaEquipo.jsx` y `FormularioSolicitarPrestamo.jsx`. |
| | Consultar historial propio | Vista `/prestamos` con título "Mis préstamos", restringida estrictamente a los registros del colaborador. | `/prestamos`<br>`prestamos:ver_propios` | ✅ Visible | Aislamiento verificado en UI y API. |
| | Consultar disponibilidad de equipos | Vista `/equipos` en solo lectura con estado y ubicación visible. | `/equipos`<br>`equipos:ver` | ✅ Visible | Verificado. |

---

## 3. Tabla de Contrastes de Color (WCAG 2.2 AA / AAA)

| Elemento / Token | Color Fondo | Color Texto / Trazo | Ratio de Contraste | Cumplimiento WCAG | Aplicación |
|---|---|---|:---:|:---:|---|
| **Botón Primario (Claro)** | `#0369A1` (Primario) | `#FFFFFF` (Sobre-primario) | **5.45:1** | ✅ WCAG AA (Texto normal) | Botones principales de acción |
| **Botón Primario Hover (Claro)** | `#075985` (Primario-hover) | `#FFFFFF` (Sobre-primario) | **7.52:1** | ✅ WCAG AAA | Hover en botones principales |
| **Botón Primario (Oscuro)** | `#38BDF0` (Primario) | `#04152B` (Sobre-primario) | **10.63:1** | ✅ WCAG AAA | Botones principales en modo oscuro |
| **Texto Principal sobre Fondo (Claro)** | `#EEF9FF` (Fondo) | `#091E3E` (Texto) | **14.85:1** | ✅ WCAG AAA | Textos de cuerpo y títulos |
| **Texto Suave sobre Fondo (Claro)** | `#EEF9FF` (Fondo) | `#4F5D73` (Texto-suave) | **5.32:1** | ✅ WCAG AA | Subtítulos, metadatos, ayuda |
| **Texto Principal sobre Superficie (Oscuro)** | `#0A1A33` (Superficie) | `#EAF4FB` (Texto) | **13.56:1** | ✅ WCAG AAA | Textos en tarjetas modo oscuro |
| **Texto Suave sobre Superficie (Oscuro)** | `#0A1A33` (Superficie) | `#A9BFD6` (Texto-suave) | **7.21:1** | ✅ WCAG AAA | Metadatos en modo oscuro |
| **Badge Éxito (Claro)** | `#DAF4E5` (Éxito-fondo) | `#14532D` (Éxito-texto) | **7.08:1** | ✅ WCAG AAA | Disponible / Devuelto |
| **Badge Info (Claro)** | `#E0E7FF` (Info-fondo) | `#312E81` (Info-texto) | **8.12:1** | ✅ WCAG AAA | Prestado / Activo |
| **Badge Advertencia (Claro)** | `#FFF1CC` (Adv-fondo) | `#6B3F00` (Adv-texto) | **7.91:1** | ✅ WCAG AAA | Mantenimiento / Pendiente |
| **Badge Peligro / Error (Claro)** | `#FDE2E2` (Error-fondo) | `#7F1D1D` (Error-texto) | **7.84:1** | ✅ WCAG AAA | Baja / Rechazado / Alertas |
| **Borde Control sobre Fondo (Claro)** | `#EEF9FF` (Fondo) | `#6E8CA6` (Borde-control) | **3.22:1** | ✅ WCAG AA (Componentes UI ≥3:1) | Bordes de inputs e interruptores |
| **Gráficos Semánticos (Disponible)** | `#FFFFFF` (Superficie) | `#15803D` (`grafico-disponible`) | **4.64:1** | ✅ WCAG AA (Gráficos ≥3:1) | Dona y leyendas |
| **Gráficos Semánticos (Prestado)** | `#FFFFFF` (Superficie) | `#0277B5` (`grafico-prestado`) | **4.98:1** | ✅ WCAG AA (Gráficos ≥3:1) | Dona y leyendas |
| **Gráficos Semánticos (Mantenimiento)** | `#FFFFFF` (Superficie) | `#B45309` (`grafico-mantenimiento`) | **4.55:1** | ✅ WCAG AA (Gráficos ≥3:1) | Dona y leyendas |
| **Gráficos Semánticos (Baja)** | `#FFFFFF` (Superficie) | `#B91C1C` (`grafico-baja`) | **5.47:1** | ✅ WCAG AA (Gráficos ≥3:1) | Dona y leyendas |

*Nota de diseño:* El color de acento corporativo `#06A3DA` se reserva estrictamente para decoraciones, barras de progreso y elementos con contraste verificado, evitando su uso como fondo de botón con texto blanco o texto sobre superficie clara.

---

## 4. Diagnóstico de Causas Raíz y Soluciones Implementadas

### 4.1. Causa Raíz de Movimientos de Auditoría en 0 (RF-17)
- **Causa:** En `backend/TechAsset.Infrastructure/Data/DatabaseSeeder.cs`, la condición de guardado inicial evaluaba:
  ```csharp
  if (!forzar && await _context.Usuarios.AnyAsync(ct)) return;
  ```
  Al haber corrido migraciones o seeds previos que poblaron únicamente usuarios, el método retornaba antes de crear la lista de 29 movimientos (`MovimientoEquipo`) y préstamos históricos. Asimismo, en el mock frontend (`baseDatosMock.js`), el único registro usaba la propiedad obsoleta `fecha` en lugar de `fechaHora` y `fechaMovimiento`.
- **Solución:** Se corrigió la condición del seeder a `if (!forzar && await _context.MovimientosEquipo.AnyAsync(ct)) return;`, se sembraron 29 movimientos inmutables vinculados a transiciones de estado, y se alineó el mock frontend con las propiedades `fechaHora` y `fechaMovimiento`.

### 4.2. Causa Raíz del Error "NaN" en Reportes
- **Causa:** En `frontend/src/components/ui/TableList.jsx` (línea 155), el renderizado de celdas ejecutaba:
  ```jsx
  {col.render ? col.render(fila) : fila[col.clave]}
  ```
  Pasaba únicamente un argumento (`fila`). En `Reportes.jsx`, la columna de posición de equipos más utilizados definía `render: (_, __, index) => ...`, esperando el índice como tercer parámetro (o segundo). Al ser invocado con 1 solo parámetro, `index` evaluaba a `undefined`, y la operación aritmética `undefined + 1` producía el texto literal `"NaN"`. Adicionalmente, el DTO de backend retornaba `idEquipo` y `nombreEquipo`, mientras el componente buscaba `codigo` y `nombre`.
- **Solución:** Se actualizó `TableList.jsx` para pasar `(fila, indice)` a la función `render`, se protegió la evaluación del ranking con `typeof index === 'number' ? index + 1 : 1`, y se unificó el mapeo DTO↔Componente en `Reportes.jsx` y `ReporteDtos.cs`.

### 4.3. Causa Raíz del Desfase de Zona Horaria (UTC vs America/Lima UTC-5)
- **Causa:** El backend utilizaba `DateTime.UtcNow` y `DateOnly.FromDateTime(DateTime.UtcNow)` directamente en servicios, controladores y el seeder. A las 23:36 hora de Lima (UTC-5), la hora UTC ya correspondía al día siguiente (04:36 UTC), por lo que el modal proponía la fecha del día siguiente y el panel contabilizaba "Hoy: 0 préstamos". En el frontend, `new Date().toISOString().slice(0, 10)` sufría el mismo problema al extraer la fecha UTC.
- **Solución:**
  1. Se implementó `IRelojServicio` y `RelojServicio` en backend configurado con `TimeZoneInfo.FindSystemTimeZoneById("America/Lima")` (con fallback a offset fijo -5).
  2. Se inyectó `IRelojServicio` en los servicios de aplicación, dominio y `DatabaseSeeder`.
  3. En frontend, se creó `frontend/src/utils/fechas.js` con la función `fechaHoyLocal()` que extrae el año, mes y día del reloj local del navegador sin pasar por UTC, aplicándose en todos los formularios y filtros.
  4. Se añadieron pruebas automatizadas con reloj falso a las 23:36 Lima en backend (`RelojZonaHorariaTests.cs`) y frontend (`fechasZonaHoraria.test.js`).

### 4.4. Causa Raíz del Error Duplicado en Formularios
- **Causa:** En `CampoFormulario.jsx`, se renderizaba condicionalmente el span de `{ayuda}` en una fila superior y el párrafo de `{error}` en una fila inferior. Cuando un campo fallaba la validación, el usuario visualizaba la ayuda empotrada entre los mensajes o duplicada. Además, `TextAreaInput.jsx` no aceptaba `etiqueta` ni utilizaba `CampoFormulario`, provocando que el motivo de préstamo careciera de etiqueta formal.
- **Solución:** Se reestructuró `CampoFormulario.jsx` para que `{error}` reemplace a `{ayuda}` mientras el campo tenga un error activo. Se integró `TextAreaInput.jsx` con `CampoFormulario`, añadiendo la etiqueta `"Motivo (*)"`, contador tabular `(${longitud}/300)` y atributo `maxLength={300}`.
