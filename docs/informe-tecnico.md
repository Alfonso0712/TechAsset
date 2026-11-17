# Informe Técnico y Arquitectónico — Proyecto TechAsset

**Sistema de Gestión de Inventario y Préstamo de Equipos Tecnológicos**  
**Organización:** Innovatech Solutions S.A.C.  
**Fecha:** Noviembre 2026  
**Versión:** 1.0.0  

---

## 1. Resumen Ejecutivo

Innovatech Solutions S.A.C. es una organización tecnológica con más de 500 colaboradores distribuidos en múltiples áreas operativas (Desarrollo, Infraestructura, Soporte, Ciberseguridad, etc.). El incremento exponencial de activos de cómputo y periféricos demandó reemplazar los registros informales por una solución corporativa centralizada, auditable y accesible.

El sistema **TechAsset** fue diseñado e implementado desde cero bajo estrictos estándares de la industria, replicando las buenas prácticas de arquitectura y diseño del proyecto de referencia *ReservaUPLA*, subsanando integralmente sus deudas técnicas identificadas y adaptando el dominio al control de inventario de equipos tecnológicos.

### Métricas de Calidad de la Solución
- **Backend:** 45 pruebas automatizadas (38 pruebas unitarias de invariantes de dominio y 7 pruebas de integración end-to-end con `WebApplicationFactory`), 100% exitosas.
- **Frontend:** 32 pruebas automatizadas con Vitest y React Testing Library, 100% exitosas.
- **Calidad de Código:** Cero advertencias y cero errores bajo ESLint 9 (flat config) y compilación .NET 8 con cero advertencias.
- **Accesibilidad:** Conformidad integral con el estándar **WCAG 2.2 Nivel AA**.

---

## 2. Arquitectura de Software

La solución sigue fielmente los postulados de **Clean Architecture** (Arquitectura Limpia), aislando las reglas de negocio del software de los detalles de infraestructura, frameworks y mecanismos de entrega.

```
                      ┌────────────────────────────────────────┐
                      │             TechAsset.Api              │
                      │  (Controladores, Middlewares, Auth)   │
                      └──────────────────┬─────────────────────┘
                                         │ depende de
                                         ▼
                      ┌────────────────────────────────────────┐
                      │         TechAsset.Application          │
                      │    (Servicios, DTOs, Mappers, Interfaces)    │
                      └──────────────────┬─────────────────────┘
                                         │ depende de
                                         ▼
                      ┌────────────────────────────────────────┐
                      │           TechAsset.Domain             │
                      │ (Entidades, Enums, Reglas, Excepciones)│
                      └──────────────────▲─────────────────────┘
                                         │ implementa
                      ┌──────────────────┴─────────────────────┘
                      │       TechAsset.Infrastructure         │
                      │   (EF Core, Repositorios, Interceptor) │
                      └────────────────────────────────────────┘
```

### 2.1. Responsabilidades por Capa

1. **TechAsset.Domain (Cúspide de la Arquitectura):**
   - No tiene dependencias de librerías externas ni de Entity Framework Core.
   - Contiene las entidades ricas (`Area`, `Usuario`, `Equipo`, `Prestamo`, `MovimientoEquipo`), todas heredando de `AuditableEntity`.
   - POO rigurosa: Setters privados, constructores privados y Factory Methods estáticos (`Crear`, `RegistrarSolicitud`, etc.) que impiden estados inválidos.
   - Métodos de comportamiento de negocio: `Equipo.PuedePrestarse()`, `Equipo.AsignarPrestamo()`, `Equipo.RegistrarDevolucion()`, `Prestamo.Aprobar()`, `Prestamo.Rechazar()`, `Prestamo.RegistrarDevolucion()`.
   - Excepciones semánticas (`DomainException`) con discriminación de conflictos de negocio (HTTP 409).

2. **TechAsset.Application (Casos de Uso):**
   - Desacoplada totalmente de EF Core mediante abstracciones de repositorio (`IUsuarioRepository`, `IEquipoRepository`, `IPrestamoRepository`, etc.) agrupadas en `IUnitOfWork`.
   - Servicios de aplicación (`AuthService`, `EquipoService`, `PrestamoService`, `UsuarioService`, `AreaService`, `ReporteService`).
   - Transferencia de datos estricta: DTOs inmutables implementados como C# `records` y Parameter Objects (`ParametrosConsultaEquipo`, `ParametrosConsultaPrestamo`).
   - Mapeo explícito mediante clases estáticas de extensión (`EquipoMappers`, `PrestamoMappers`, etc.), eliminando magia refleja de AutoMapper.

3. **TechAsset.Infrastructure (Acceso a Datos y Servicios Externos):**
   - Configuración Fluent API al 100% en `AppDbContext` (cero DataAnnotations en entidades).
   - Generación de claves primarias UUID con `Guid.NewGuid()`.
   - Nomenclatura snake_case en BD con prefijos mnemotécnicos de tres letras (`cop_equipo`, `fde_prestamo`).
   - Interceptor automático `AuditoriaInterceptor` (`SaveChangesInterceptor`) para auditoría de creación y modificación de entidades.

4. **TechAsset.Api (Puntos de Entrada HTTP):**
   - Controladores REST delgados (`[ApiController]`), sin lógica de negocio.
   - Autenticación por cookies de sesión cifradas `TechAsset.Auth` (sin tokens JWT en almacenamiento local).
   - Autorización declarativa por políticas basadas en permisos (`PoliticaDeAcceso`, `PermisoAuthorizationHandler`).
   - `GlobalExceptionHandlerMiddleware` que traduce excepciones a respuestas estandarizadas `{ error, mensaje }`.

---

## 3. Seguridad y Autenticación

El diseño de seguridad del sistema implementa un modelo de defensa en profundidad:

### 3.1. Hashing Criptográfico PBKDF2 (Mejora Obligatoria #1)
- Implementación basada en `Microsoft.AspNetCore.Identity.PasswordHasher<T>` con derivación de clave PBKDF2 utilizando algoritmo HMAC-SHA256 y 100,000 iteraciones con sal criptográfica única por credencial.
- Se eliminaron por completo las contraseñas en texto plano y los atajos condicionales de depuración presentes en proyectos legacy.
- Protección contra ataques de temporización mediante `VerifyDummyPassword()` ante correos no registrados.

### 3.2. Validación Continua de Sesión en Base de Datos (Mejora Obligatoria #3)
- Mediante el evento `CookieAuthenticationEvents.OnValidatePrincipal`, cada petición HTTP entrante consulta de manera eficiente el estado del usuario en la base de datos.
- Si el usuario fue desactivado (`Act_Usuario = false`) o su rol corporativo fue revocado/modificado, la cookie de sesión es destruida y el contexto de seguridad se invalida de inmediato con HTTP 401 JSON (sin redirecciones HTML).

### 3.3. Mitigación de Ataques de Fuerza Bruta
- Middleware de Rate Limiting con partición por IP en el endpoint de autenticación (`/api/auth/login`).
- Límite fijado en 5 peticiones por minuto. Al superarse, se emite una respuesta estándar HTTP 429 Too Many Requests en formato `ProblemDetails`.

### 3.4. Protección de Datos y Variables de Entorno (Mejora Obligatoria #6)
- Cero credenciales hardcodeadas en archivos fuente ni en `appsettings.json`.
- Inyección mediante variables de entorno del sistema (`POSTGRES_PASSWORD`, `DB_APP_PASSWORD`) y soporte de .NET User-Secrets en desarrollo local.

---

## 4. Usabilidad y Accesibilidad (WCAG 2.2 Nivel AA)

El frontend de TechAsset fue construido priorizando la accesibilidad universal, garantizando que usuarios con diversas capacidades o que utilicen tecnologías asistivas interactúen sin barreras.

### 4.1. Tokens Semánticos y Colorimetría
- Paleta primaria en base a **Teal / Esmeralda** (`#0D9488` / `#0F766E`), seleccionada específicamente para asegurar ratios de contraste superiores a **4.5:1** contra fondos claros y oscuros.
- Modo oscuro completo mediante variables CSS dinámicas y clase `.dark`.

### 4.2. Navegación por Teclado y Foco Visible
- Todo elemento accionable (`Button`, inputs, enlaces) dispone de indicadores visuales de foco de alto contraste mediante la variable de anillo `--anillo-foco`.
- Orden lógico de tabulación (`tabindex`) en todos los formularios y tablas de datos.
- Tamaño táctil mínimo de **44 × 44 píxeles** en botones y elementos de navegación, cumpliendo el criterio WCAG 2.2 Target Size (Minimum).

### 4.3. Trampa de Foco y Diálogos Modales (Mejora Obligatoria #4)
- El hook personalizado `useTrampaFoco` atrapa el foco del teclado dentro del diálogo modal mientras permanezca abierto, evitando que el usuario navegue accidentalmente por el contenido de fondo.
- Cierre intuitivo mediante la tecla `Escape` y restauración automática del foco en el elemento desencadenador al cerrarse.
- Atributos semánticos: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-titulo"`.

### 4.4. Preferencias del Usuario y Accesibilidad Cognitiva
- **Escalado Tipográfico:** Controles integrados para seleccionar escala de fuente (A- = 87.5%, A = 100%, A+ = 112.5%).
- **Detección de Bloqueo de Mayúsculas:** El hook `useBloqMayus` alerta inmediatamente al usuario si tiene activado el Bloq Mayús al ingresar contraseñas.
- **Alertas Vivas:** Notificaciones de error y éxito con `aria-live="polite"` y `role="alert"`.

---

## 5. Evaluación Heurística (10 Heurísticas de Jakob Nielsen)

| # | Heurística de Nielsen | Implementación y Evidencia Técnica en TechAsset |
| :- | :--- | :--- |
| **1** | **Visibilidad del estado del sistema** | Badges de colores normalizados (`Badge.jsx`) para estados de equipos y préstamos. Botones con indicador spinner (`Icono Loader2`) y `aria-busy="true"` durante peticiones asíncronas. Skeleton loaders durante la carga de tablas. |
| **2** | **Correspondencia entre el sistema y el mundo real** | Terminología clara del dominio de TI: Código patrimonial, ubicación física, motivo de préstamo, observación técnica de devolución. Lenguaje en español formal sin jerga interna del framework. |
| **3** | **Control y libertad del usuario** | Modales de confirmación con cancelación explícita (`ModalConfirmacion.jsx`). Botón para restablecer filtros en `FilterBar`. Posibilidad de cerrar cualquier modal con tecla Escape o clic en backdrop. |
| **4** | **Consistencia y estándares** | Sistema de diseño coherente basado en tokens Tailwind. Ubicación fija de barras de navegación y lateral. Mismo patrón en todas las pantallas de catálogo (Filtros superiores, tabla central, paginador inferior). |
| **5** | **Prevención de errores** | Deshabilitación de botones de acción cuando el formulario contiene errores. Bloqueo en frontend de fechas incoherentes (devolución estimada previa al préstamo). Detección de Bloq Mayús en login. Doble validación en backend con índices únicos. |
| **6** | **Reconocimiento antes que recuerdo** | Tarjetas de previsualización al confirmar acciones (aprobación/rechazo de préstamo). Filtros con etiquetas visibles y selección de categorías predeterminadas. Recordatorio opcional de correo en login (`useCorreoRecordado`). |
| **7** | **Flexibilidad y eficiencia de uso** | Búsqueda con debounce en tiempo real (`useDebounce` de 350ms) en catálogos. Acciones rápidas según rol. Botones de relleno rápido de credenciales en página de inicio de sesión para demostración ágil. |
| **8** | **Diseño estético y minimalista** | Interfaz limpia con paleta Teal y tipografía Montserrat Variable. Tarjetas de KPI con métricas concisas. Gráfico de dona SVG sin librerías pesadas externas. Información organizada sin saturación visual. |
| **9** | **Ayudar a reconocer, diagnosticar y recuperarse de errores** | Mensajes de error específicos asociados directamente al campo que falló (`CampoFormulario.jsx` con `aria-describedby`). El middleware global devuelve mensajes amigables y códigos de conflicto claros (409) si un código patrimonial ya existe. |
| **10** | **Ayuda y documentación** | Tooltips accesibles (`role="tooltip"`) en botones de solo icono. Textos de ayuda explicativos en modales de préstamo y devolución (recordando el cumplimiento de la RN-10). |

---

## 6. Matriz de Trazabilidad de Requerimientos

### 6.1. Requerimientos Funcionales (RF-01 a RF-17)

| RF | Descripción | Endpoint Backend | Componente / Vista Frontend | Prueba Automatizada |
| :- | :--- | :--- | :--- | :--- |
| **RF-01** | Registro de Usuarios | `POST /api/usuarios` | `FormularioUsuario.jsx` | `UsuarioServiceTests.cs` |
| **RF-02** | Edición de Usuarios | `PUT /api/usuarios/{id}` | `FormularioUsuario.jsx` | `UsuarioServiceTests.cs` |
| **RF-03** | Consulta de Usuarios | `GET /api/usuarios` | `Usuarios.jsx`, `TableList.jsx` | `UsuariosControllerTests.cs` |
| **RF-04** | Deshabilitación Lógica | `PATCH /api/usuarios/{id}/estado` | `Usuarios.jsx`, `ModalConfirmacion.jsx` | `UsuarioServiceTests.cs` (RN-09) |
| **RF-05** | Registro de Equipos | `POST /api/equipos` | `FormularioEquipo.jsx` | `EquipoServiceTests.cs` (RN-07) |
| **RF-06** | Edición de Equipos | `PUT /api/equipos/{id}` | `FormularioEquipo.jsx` | `EquipoServiceTests.cs` |
| **RF-07** | Consulta de Inventario | `GET /api/equipos` | `Equipos.jsx`, `FilterBar.jsx` | `apiClient.test.js` |
| **RF-08** | Cambio de Estado Operativo | `PATCH /api/equipos/{id}/estado` | `ModalCambiarEstadoEquipo.jsx` | `EquipoServiceTests.cs` (RN-02/03) |
| **RF-09** | Solicitud y Registro Préstamo | `POST /api/prestamos` | `FormularioSolicitarPrestamo.jsx`, `FormularioPrestamoDirecto.jsx` | `PrestamoFlujoIntegrationTests.cs` |
| **RF-10** | Registro de Devolución | `POST /api/prestamos/{id}/devolver` | `ModalDevolverPrestamo.jsx` | `PrestamoFlujoIntegrationTests.cs` (RN-10) |
| **RF-11** | Historial de Préstamos | `GET /api/prestamos` | `Prestamos.jsx`, `TableList.jsx` | `PrestamoServiceTests.cs` |
| **RF-12** | Préstamos Activos | `GET /api/prestamos?estado=Activo` | `Prestamos.jsx` (Pestaña Activos) | `PrestamoServiceTests.cs` |
| **RF-13** | Dashboard General | `GET /api/reportes/dashboard` | `Panel.jsx`, `GraficoDonaSVG.jsx` | `ReporteServiceTests.cs` |
| **RF-14** | Reporte Equipos por Estado | `GET /api/reportes/dashboard` | `Panel.jsx`, `Reportes.jsx` | `ReporteServiceTests.cs` |
| **RF-15** | Reporte Equipos Más Utilizados| `GET /api/reportes/equipos-mas-prestados` | `Reportes.jsx` | `ReporteServiceTests.cs` |
| **RF-16** | Reporte Préstamos por Área | `GET /api/reportes/prestamos-por-area` | `Reportes.jsx`, `RankingAreas.jsx` | `ReporteServiceTests.cs` |
| **RF-17** | Auditoría de Movimientos | `GET /api/reportes/movimientos` | `Reportes.jsx` (Tabla Auditoría) | `PrestamoFlujoIntegrationTests.cs` |

### 6.2. Reglas de Negocio (RN-01 a RN-10)

| Regla | Descripción | Mecanismo de Garantía | Prueba Automatizada |
| :- | :--- | :--- | :--- |
| **RN-01** | Unicidad de préstamo activo | Servicio `PrestamoService` + Índice único parcial en BD `IX_prestamos_equipo_activo` | `PrestamoServiceTests.cs`, `PrestamoFlujoIntegrationTests.cs` |
| **RN-02** | Equipos en mantenimiento no prestables | Método de dominio `Equipo.PuedePrestarse()` | `EquipoTests.cs`, `PrestamoServiceTests.cs` |
| **RN-03** | Equipos dados de baja no prestables | Método de dominio `Equipo.PuedePrestarse()` | `EquipoTests.cs`, `PrestamoServiceTests.cs` |
| **RN-04** | Fecha de devolución > Fecha préstamo | Invariante en `Prestamo.Crear()` + CHECK constraint `CK_prestamos_fechas_coherentes` | `PrestamoTests.cs`, `validadores.test.js` |
| **RN-05** | Préstamo activo exige Responsable | Invariante en entidad `Prestamo.Aprobar()` | `PrestamoTests.cs`, `PrestamoServiceTests.cs` |
| **RN-06** | Prohibido borrado físico de equipos | Ausencia de método DELETE; transición a estado `Baja` | `EquipoServiceTests.cs` |
| **RN-07** | Código patrimonial estrictamente único | Índice único en BD `IX_equipos_cop_equipo` + validación en servicio (409) | `EquipoServiceTests.cs`, `validadores.test.js` |
| **RN-08** | Correo corporativo único | Índice único en BD `IX_usuarios_cor_usuario` + validación en servicio (409) | `UsuarioServiceTests.cs` |
| **RN-09** | Protección de desactivación de usuarios | Verificación de préstamos activos en `UsuarioService.CambiarEstadoAsync()` | `UsuarioServiceTests.cs` |
| **RN-10** | Devolución exige observación técnica | Validación obligatoria en `Prestamo.RegistrarDevolucion()` y formulario UI | `PrestamoTests.cs`, `validadores.test.js` |

---

## 7. Deudas Técnicas Subsanadas (Mejoras vs Proyecto de Referencia)

1. **PasswordHasher Criptográfico Puro:** En ReservaUPLA existía soporte para texto plano residual; en TechAsset se eliminó al 100%, exigiendo PBKDF2 100k iteraciones.
2. **Entidades Auditables Universales (`AuditableEntity`):** Implementada como clase base abstracta (`Fre_`, `Fma_`, `Ucr_`, `Umo_`) y gestionada automáticamente por `AuditoriaInterceptor` en el ciclo de vida de EF Core.
3. **Validación Dinámica de Sesión (`OnValidatePrincipal`):** Se interceptan las peticiones para asegurar en base de datos que el usuario no ha sido deshabilitado ni modificado en su rol durante una sesión abierta.
4. **Componentes de UI Reutilizables y Agnósticos:** Se unificó `ModalDialog` y `ModalConfirmacion`, suprimiendo la duplicación de código en modales de acción, e implementando un `FilterBar` genérico reutilizable en todos los listados.
5. **Configuración de Calidad desde el Primer Commit:** Inclusión de `.editorconfig` y `.prettierrc` para garantizar consistencia de saltos de línea (LF), indentación y formato entre desarrolladores.
6. **Seguridad de Credenciales:** Uso estricto de variables de entorno y Secrets Manager sin almacenamiento de claves en repositorios.

---

## 8. Conclusiones

El proyecto **TechAsset** satisface con rigurosidad técnica la totalidad de requerimientos planteados para Innovatech Solutions S.A.C., adoptando una arquitectura escalable, mantenible y accesible. La combinación de validaciones ricas en el dominio, restricciones estrictas en la base de datos y un sistema de diseño con foco en accesibilidad garantiza una operación confiable y segura a largo plazo.
