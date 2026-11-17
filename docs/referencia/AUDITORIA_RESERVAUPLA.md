REPORTE DE AUDITORÍA TÉCNICA Y ARQUITECTÓNICA — RESERVAUPLA



Nota de entrega: Debido a la profundidad y extensión requerida para las 10 secciones, este reporte se entrega en partes numeradas según lo solicitado. A continuación se presenta la PARTE 1 (Secciones 1 a 3).



1\. RESUMEN DEL PROYECTO

1.1. Qué hace y módulos existentes



ReservaUPLA es una plataforma web institucional orientada a la gestión, solicitud, evaluación y control de reservas de ambientes universitarios (laboratorios de cómputo, laboratorios especializados, auditorios y salas académicas) sin cruces de horarios.



Los módulos implementados en el código son:



Landing Page pública (/): Presentación estática institucional, resumen de reglas operativas, catálogo estático informativo y accesos directos al sistema.

Autenticación y Registro (/login, /registro): Inicio de sesión mediante cookies seguras, persistencia de credenciales locales opcionales, protección contra fuerza bruta y registro público para el rol Solicitante.

Módulo de Usuarios (Administración) (/usuarios): Control de acceso exclusivo para el rol Administrador. Gestión de altas, modificación de datos, reasignación de roles y desactivación lógica con verificación de dependencias de ambientes.

Catálogo de Ambientes (/ambientes): Listado paginado, alta y edición de infraestructura física, asignación de usuarios responsables y cambio de estados operativos (Disponible, Mantenimiento).

Gestión de Reservas (/reservas, /reservas/:id): Solicitud de espacios por solicitantes, consulta de disponibilidad en tiempo real, detección y prevención de solapamientos horarios, y flujo de aprobación/rechazo por administradores.

Dashboard y Métricas (/panel): Indicadores clave de desempeño (KPIs), gráficas de reservas por estado, ranking de ocupación de ambientes y bandeja de solicitudes pendientes de atención.

Preferencias de Usuario y Accesibilidad: Conmutación de tema claro/oscuro persistente y escala de fuente tipográfica accesible (A- / A / A+).

1.2. Estructura de carpetas raíz (Árbol de 3 niveles)

text

.

├── .env.example

├── .gitignore

├── CHANGELOG.md

├── docker-compose.yml

├── README.md

├── ReservaUpla.sln

├── .github/

│   └── workflows/

│       └── ci.yml

├── backend/

│   ├── .dockerignore

│   ├── Dockerfile

│   ├── README-seguridad.md

│   ├── ReservaUpla.Api/

│   │   ├── Controllers/

│   │   ├── Extensions/

│   │   ├── Middlewares/

│   │   ├── Properties/

│   │   ├── Security/

│   │   ├── Program.cs

│   │   ├── ReservaUpla.Api.csproj

│   │   └── appsettings.json

│   ├── ReservaUpla.Application/

│   │   ├── DTOs/

│   │   ├── Extensions/

│   │   ├── Interfaces/

│   │   ├── Mappers/

│   │   ├── Services/

│   │   └── ReservaUpla.Application.csproj

│   ├── ReservaUpla.Domain/

│   │   ├── Common/

│   │   ├── Constants/

│   │   ├── Entities/

│   │   ├── Enums/

│   │   ├── Exceptions/

│   │   ├── Security/

│   │   └── ReservaUpla.Domain.csproj

│   ├── ReservaUpla.Infrastructure/

│   │   ├── Data/

│   │   ├── Extensions/

│   │   ├── Migrations/

│   │   ├── Repositories/

│   │   ├── Security/

│   │   └── ReservaUpla.Infrastructure.csproj

│   └── scripts/

│       └── crear\_rol\_app.sql

├── docs/

│   ├── database/

│   │   └── init/

│   ├── diagramas/

│   ├── hooks/

│   └── img/

├── frontend/

│   ├── .dockerignore

│   ├── Dockerfile

│   ├── eslint.config.js

│   ├── index.html

│   ├── package.json

│   ├── postcss.config.js

│   ├── tailwind.config.js

│   ├── vite.config.js

│   ├── public/

│   ├── scripts/

│   └── src/

│       ├── assets/

│       ├── components/

│       ├── constants/

│       ├── context/

│       ├── hooks/

│       ├── layouts/

│       ├── mocks/

│       ├── pages/

│       ├── routes/

│       ├── services/

│       ├── styles/

│       ├── tests/

│       ├── utils/

│       └── validation/

└── tests/

&#x20;   └── ReservaUpla.Tests/

&#x20;       ├── Common/

&#x20;       ├── Integration/

&#x20;       ├── Unit/

&#x20;       └── ReservaUpla.Tests.csproj

1.3. Versiones exactas del Stack

Backend (.NET y NuGet)

Target Framework: net8.0 (Compilador / SDK del entorno: 10.0.400)

ReservaUpla.Api.csproj:

Microsoft.AspNetCore.OpenApi: 8.0.10

Microsoft.EntityFrameworkCore.Design: 8.0.11

Swashbuckle.AspNetCore: 6.6.2

ReservaUpla.Application.csproj:

Microsoft.Extensions.DependencyInjection.Abstractions: 8.0.0

ReservaUpla.Domain.csproj:

Sin dependencias externas de NuGet (Pure C# POCOs).

ReservaUpla.Infrastructure.csproj:

Microsoft.AspNetCore.Identity.EntityFrameworkCore: 8.0.11

Microsoft.EntityFrameworkCore.InMemory: 8.0.11

Npgsql.EntityFrameworkCore.PostgreSQL: 8.0.11

ReservaUpla.Tests.csproj:

coverlet.collector: 6.0.0

Microsoft.AspNetCore.Mvc.Testing: 8.0.11

Microsoft.EntityFrameworkCore.InMemory: 8.0.11

Microsoft.NET.Test.Sdk: 17.8.0

Moq: 4.20.72

xunit: 2.5.3

xunit.runner.visualstudio: 2.5.3

Frontend (Node y npm)

Node runtime: v24.21.0 (compatible con LTS v18+)

frontend/package.json:

Dependencies:

@fontsource-variable/montserrat: 5.1.0

lucide-react: 0.460.0

react: 18.3.1

react-dom: 18.3.1

react-router-dom: 6.28.0

DevDependencies:

@eslint/js: 9.39.5

@testing-library/jest-dom: 6.9.1

@testing-library/react: 16.3.3

@testing-library/user-event: 14.6.8

@types/react: 18.3.12

@types/react-dom: 18.3.1

@vitejs/plugin-react: 6.2.1

autoprefixer: 10.4.20

eslint: 9.39.5

eslint-plugin-jsx-a11y: 6.10.2

eslint-plugin-react: 7.37.5

eslint-plugin-react-hooks: 5.2.0

jsdom: 26.1.0

postcss: 8.4.49

tailwindcss: 3.4.3

vite: 8.3.5

vitest: 3.2.7

2\. ARQUITECTURA BACKEND

2.1. Capas y Dirección de Dependencias



El backend implementa estrictamente los principios de Clean Architecture (Arquitectura Cebolla / Puertos y Adaptadores):



text

\[ ReservaUpla.Api ] ────────► \[ ReservaUpla.Application ] ◄──────── \[ ReservaUpla.Infrastructure ]

&#x20;       │                                  │                                     │

&#x20;       └───────────────────────────────►  │  ◄──────────────────────────────────┘

&#x20;                                          ▼

&#x20;                               \[ ReservaUpla.Domain ] (Núcleo puro)

ReservaUpla.Domain: Capa central agnóstica. Cero dependencias hacia frameworks o bases de datos. Contiene entidades de negocio, enumeraciones, excepciones de dominio, interfaces de identidad (IActor) y reglas de validación invariantes.

ReservaUpla.Application: Casos de uso. Depende únicamente de Domain. Define interfaces de repositorios, Unit of Work, servicios de aplicación, contratos DTOs y clases de mapeo.

ReservaUpla.Infrastructure: Adaptadores secundarios. Depende de Application y Domain. Implementa persistencia con EF Core y PostgreSQL (AppDbContext), repositorios concretos, hashing de contraseñas y seed de datos.

ReservaUpla.Api: Adaptador primario (entrada). Depende de Application e Infrastructure (para registrar el contenedor IoC). Controladores REST, middlewares globales, filtros de autorización y configuración del pipeline HTTP.

2.2. Patrones Utilizados y Descartados

Patrón	Estado	Implementación / Ubicación en el Código

Repository Pattern	Usado	Interfaces en Application/Interfaces/ e implementaciones en Infrastructure/Repositories/ (AmbienteRepository, ReservaRepository, UsuarioRepository).

Unit of Work	Usado	Contrato IUnitOfWork e implementación UnitOfWork que coordina transaccionalmente DbContext.SaveChangesAsync().

Service Layer	Usado	Orquestación de casos de uso (AmbienteService, AuthService, ReservaService, UsuarioService).

DTO (Data Transfer Object)	Usado	Desacoplamiento total entre modelos relacionales y contratos JSON en Application/DTOs/.

Static Extension Mappers	Usado	Métodos de extensión estáticos (AmbienteMapper, ReservaMapper, UsuarioMapper) de alto rendimiento sin reflexión en tiempo de ejecución.

Mediator / CQRS (MediatR)	NO se usa	Los controladores invocan directamente la interfaz del servicio correspondiente.

AutoMapper / Mapster	NO se usa	Se utiliza mapeo manual estático para evitar sobrecarga y errores de mapeo silencioso.

Specification Pattern	NO se usa	Las consultas parametrizadas se resuelven directamente con LINQ dentro de cada repositorio.

Generic Result Wrapper (ApiResponse<T>)	NO se usa	Los controladores retornan tipos nativos ActionResult<T> (200, 201, 204), y los fallos se interceptan en el middleware global como ProblemDetails o { error, mensaje }.

2.3. Aplicación de Programación Orientada a Objetos (POO)

Herencia



Uso de herencia de clases base para excepciones y controladores.



Ejemplo real: DomainException.cs

csharp

public class DomainException : Exception

{

&#x20;   public bool EsConflicto { get; }

&#x20;   public DomainException(string mensaje, bool esConflicto = false) : base(mensaje)

&#x20;   {

&#x20;       EsConflicto = esConflicto;

&#x20;   }

}

Encapsulación



Constructores privados en entidades para forzar la creación mediante Factory Methods estáticos que garantizan la integridad de las invariantes de negocio desde el momento de instanciación.



Ejemplo real: Reserva.cs

csharp

public class Reserva

{

&#x20;   public Guid Id\_Reserva { get; private set; }

&#x20;   public DateOnly Fec\_Reserva { get; private set; }

&#x20;   public TimeSpan Hin\_Reserva { get; private set; }

&#x20;   public TimeSpan Hfi\_Reserva { get; private set; }

&#x20;   public string Mot\_Reserva { get; private set; } = string.Empty;

&#x20;   public EstadoReserva Est\_Reserva { get; private set; }

&#x20;   // Constructor privado que impide instanciación sin validar invariantes

&#x20;   private Reserva() { }

&#x20;   public static Reserva Crear(DateOnly fecha, TimeSpan horaInicio, TimeSpan horaFin, string motivo, Guid solicitanteId, Guid ambienteId, DateOnly? fechaReferenciaHoy = null)

&#x20;   {

&#x20;       ValidarHorarioYFecha(fecha, horaInicio, horaFin, fechaReferenciaHoy ?? DateOnly.FromDateTime(DateTime.UtcNow));

&#x20;       ValidarMotivo(motivo?.Trim() ?? string.Empty);

&#x20;       return new Reserva { ... };

&#x20;   }

}

Polimorfismo e Interfaces



Desacoplamiento de implementación mediante inyección de interfaces.



Ejemplo real: IUnitOfWork.cs implementado en UnitOfWork.cs, permitiendo intercambiar la persistencia en pruebas unitarias por un Mock<IUnitOfWork>.

2.4. Inyección de Dependencias



El registro en el contenedor IoC se estructura de forma modular mediante métodos de extensión específicos por capa en Program.cs:



AddApplicationServices() en ApplicationExtensions.cs: Registra los servicios de aplicación con ciclo de vida Scoped (IAmbienteService, IAuthService, IReservaService, IUsuarioService).

AddInfrastructure() en InfrastructureExtensions.cs: Configura el DbContext con PostgreSQL (o InMemory según configuración), repositorios y servicios de seguridad (IPasswordHasherService, IUnitOfWork, DatabaseSeeder).

AddFrontendCors(), AddAuthCookie(), AddPoliticasDeAcceso(), AddLoginRateLimiting() en ApiExtensions.cs: Registra configuración web y seguridad.

2.5. Mapeo Entidad ↔ DTO



Se implementa mediante métodos de extensión estáticos puros (sin librerías de terceros).



Ejemplo real: AmbienteMapper.cs

csharp

public static class AmbienteMapper

{

&#x20;   public static AmbienteDto ToDto(this Ambiente ambiente, string? nombreResponsable = null)

&#x20;   {

&#x20;       return new AmbienteDto(

&#x20;           ambiente.Id\_Ambiente,

&#x20;           ambiente.Nom\_Ambiente,

&#x20;           ambiente.Tip\_Ambiente.ToString(),

&#x20;           ambiente.Cap\_Ambiente,

&#x20;           ambiente.Ubi\_Ambiente,

&#x20;           ambiente.Est\_Ambiente.ToString(),

&#x20;           ambiente.Idr\_Ambiente,

&#x20;           nombreResponsable

&#x20;       );

&#x20;   }

}

2.6. Validación Backend

FluentValidation: No existe.

DataAnnotations en entidades: No existen.

Mecanismo real: Validaciones de invariantes puras en las entidades del Dominio y validaciones de unicidad/lógica temporal en los Servicios de Aplicación. Si una regla no se cumple, se dispara una DomainException con mensaje tipificado.

Ejemplo real en Dominio: ReglasReserva.cs y Reserva.cs:

csharp

private static void ValidarHorarioYFecha(DateOnly fecha, TimeSpan horaInicio, TimeSpan horaFin, DateOnly hoy)

{

&#x20;   if (fecha < hoy)

&#x20;       throw new DomainException(Mensajes.FechaPasadaInvalida);

&#x20;   if (horaInicio < ReglasReserva.HoraApertura || horaFin > ReglasReserva.HoraCierre)

&#x20;       throw new DomainException(Mensajes.HorarioFueraDeRango);

&#x20;   if (horaInicio >= horaFin)

&#x20;       throw new DomainException(Mensajes.HoraInicioMayorOFing);

}

2.7. Manejo Global de Errores



Se gestiona a través del middleware GlobalExceptionHandlerMiddleware.cs:



DomainException:

404 Not Found: Si el mensaje indica recurso no encontrado.

403 Forbidden: Si el mensaje corresponde a restricción de permisos o regla exclusiva de Administrador.

409 Conflict: Si ex.EsConflicto == true (solape de horarios en reservas o duplicidad de correo de usuario).

400 Bad Request: Resto de validaciones de entrada.

Formato JSON estándar de salida: { "error": "...", "mensaje": "..." }.

UnauthorizedAccessException: Mapea a 401 Unauthorized con { "error": "...", "mensaje": "..." }.

Exception (no controlada): Mapea a 500 Internal Server Error devolviendo ProblemDetails según RFC 7807 (Status, Title, Detail, Instance).

RateLimitRejected (429): Devuelve ProblemDetails con encabezado Retry-After: 60.

2.8. Autenticación y Autorización

JWT (JSON Web Token): No existe en este proyecto.

Esquema de autenticación real: Cookies seguras de sesión de ASP.NET Core (CookieAuthenticationDefaults.AuthenticationScheme).

Nombre de cookie: ReservaUpla.Auth

Propiedades: HttpOnly = true, SameSite = SameSiteMode.Lax, SecurePolicy = Always (en producción) / SameAsRequest (en desarrollo).

Eventos personalizados: OnRedirectToLogin devuelve 401 Unauthorized y OnRedirectToAccessDenied devuelve 403 Forbidden en JSON (sin redirecciones HTML).

Hashing de contraseñas: PasswordHasherService.cs encapsula Microsoft.AspNetCore.Identity.PasswordHasher<object>, ejecutando PBKDF2 con HMAC-SHA256, sal de 128 bits y 100,000 iteraciones. Incluye además un método VerifyDummyPassword() que ejecuta una verificación ficticia cuando el correo no existe, mitigando ataques de sincronización temporal (timing attacks).

Protección de endpoints:

\[Authorize]: Requiere sesión activa.

\[Authorize(Policy = Permisos.X)]: Políticas declarativas dinámicas mapeadas contra PermisoAuthorizationHandler (PermisoAuthorization.cs), que evalúa el rol contenido en los Claims del usuario contra la matriz estricta PoliticaDeAcceso.cs.

Rate Limiting de login: 5 solicitudes por minuto por IP en producción (50 en dev) mediante Microsoft.AspNetCore.RateLimiting.

2.9. Configuración de Swagger, CORS y AppSettings

Swagger: Registrado en Program.cs con AddSwaggerGen(). No incluye configuración de JWT Bearer debido a que la autenticación es por cookies de sesión nativas del navegador. Habilitado únicamente en entorno de desarrollo (app.Environment.IsDevelopment()).

CORS: Política "FrontendCors" configurada con origen estricto http://localhost:5173, .AllowCredentials(), .AllowAnyHeader() y .AllowAnyMethod().

AppSettings: appsettings.json contiene la sección "ConnectionStrings": { "DefaultConnection": "..." } y configuraciones de logging. Las contraseñas productivas se inyectan mediante variables de entorno en Docker.

2.10. Convención de Endpoints



Se cuenta con un total de 21 acciones HTTP distribuidas en 5 controladores:



Verbo	Ruta	Protección	Descripción

POST	/api/auth/login	Anónimo (Rate Limited)	Inicia sesión y emite la cookie ReservaUpla.Auth.

POST	/api/auth/logout	\[Authorize]	Invalida y borra la cookie de sesión.

GET	/api/auth/me	\[Authorize]	Devuelve datos y permisos del usuario en sesión.

POST	/api/usuarios	Anónimo	Registro público de nuevos solicitantes.

GET	/api/usuarios/{id}	\[Authorize]	Consulta individual de usuario.

GET	/api/usuarios/responsables	\[Authorize(usuarios.listarResponsables)]	Lista responsables activos para asignar a ambientes.

PATCH	/api/usuarios/preferencias	\[Authorize]	Actualiza tema (claro/oscuro) y tamaño de letra.

GET	/api/usuarios	\[Authorize(usuarios.listar)]	Listado paginado de usuarios con filtros.

POST	/api/usuarios/admin	\[Authorize(usuarios.crear)]	Creación de cuentas por el Administrador.

PUT	/api/usuarios/{id}	\[Authorize(usuarios.editar)]	Edición de nombre, rol o contraseña de un usuario.

PATCH	/api/usuarios/{id}/estado	\[Authorize(usuarios.cambiarEstado)]	Desactivación o reactivación lógica de usuario.

GET	/api/ambientes	\[Authorize(ambientes.listar)]	Catálogo de ambientes con filtros de tipo y estado.

POST	/api/ambientes	\[Authorize(ambientes.crear)]	Alta de nuevo ambiente.

GET	/api/ambientes/{id}	\[Authorize(ambientes.listar)]	Consulta individual de ambiente.

PUT	/api/ambientes/{id}	\[Authorize(ambientes.editar)]	Modificación de capacidad, tipo, ubicación y responsable.

PATCH	/api/ambientes/{id}/estado	\[Authorize(ambientes.cambiarEstado)]	Cambio a Disponible o Mantenimiento.

POST	/api/reservas	\[Authorize(reservas.crear)]	Registro de solicitud de reserva.

GET	/api/reservas	\[Authorize(reservas.ver)]	Listado paginado con filtros (estado, ambienteId, fecha).

GET	/api/reservas/{id}	\[Authorize(reservas.ver)]	Consulta de detalle con trazabilidad.

PATCH	/api/reservas/{id}/estado	\[Authorize(reservas.aprobarRechazar)]	Aprobación o rechazo administrativo.

GET	/api/dashboard/estadisticas	\[Authorize(dashboard.ver)]	KPIs, métricas agrupadas y reservas pendientes.

Paginación: Se modela con el DTO genérico PaginadoDto<T>(IReadOnlyList<T> Items, int TotalItems, int PaginaActual, int TotalPaginas).

Filtros: Se transmiten por \[FromQuery] mapeados a DTOs de consulta (FiltroReservasDto, etc.).

Ordenamiento: Implementado de forma predeterminada en repositorios por fecha/hora descendente.

3\. BASE DE DATOS

3.1. Configuración del DbContext y Fluent API



El contexto relacional está implementado en AppDbContext.cs.



Enfoque de configuración: 100% Fluent API en OnModelCreating, separado en métodos privados por entidad (ConfigurarUsuario, ConfigurarAmbiente, ConfigurarReserva).

Data Annotations de EF en entidades: No existen. Las entidades de dominio se mantienen limpias de atributos acoplados al ORM.

csharp

protected override void OnModelCreating(ModelBuilder modelBuilder)

{

&#x20;   base.OnModelCreating(modelBuilder);

&#x20;   ConfigurarUsuario(modelBuilder);

&#x20;   ConfigurarAmbiente(modelBuilder);

&#x20;   ConfigurarReserva(modelBuilder);

}

3.2. Convenciones de Nombres y Tipos de ID

Tablas: Plurales en minúsculas y snake\_case (usuarios, ambientes, reservas).

Columnas: Minúsculas en snake\_case con prefijo mnemotécnico de 3 letras (id\_usuario, nom\_usuario, cor\_usuario, has\_usuario, rol\_usuario, act\_usuario, id\_ambiente, nom\_ambiente, cap\_ambiente, id\_reserva, fec\_reserva, hin\_reserva, etc.).

Propiedades C#: PascalCase con guion bajo separador (Id\_Usuario, Nom\_Usuario).

Tipo de Identificador: UUID / GUID nativo (Guid en C#, uuid en PostgreSQL) generado mediante Guid.NewGuid(). No se utilizan enteros autoincrementales.

3.3. Migraciones y Estrategia de Seed

Historial de migraciones en ReservaUpla.Infrastructure/Migrations/:

20261103163834\_MigracionInicial: Creación de tablas base usuarios, ambientes y reservas, índices y restricciones.

20261105071329\_AgregarPreferenciasUsuario: Adición de columnas tema y tamano\_letra con check constraints.

20261105081257\_AgregarCheckCapacidadAmbiente: Adición del check constraint cap\_ambiente > 0.

Estrategia de Seed: Implementada en DatabaseSeeder.cs. Se ejecuta automáticamente en el arranque de la API mediante Program.cs:

Verifica dbContext.Database.IsRelational() y ejecuta MigrateAsync().

Si la tabla usuarios está vacía, inserta las cuentas predeterminadas (Administrador, Responsable y Solicitante) con sus hashes PBKDF2 correspondientes.

Inserta el catálogo inicial de ambientes universitarios y reservas de prueba.

3.4. Soft Delete, Auditoría y Restricciones Únicas

Soft Delete (Borrado Lógico):

En usuarios: Implementado con el campo booleano act\_usuario (true = activo, false = inactivo). No existe borrado físico; UsuarioService ejecuta desactivación lógica.

En ambientes: No se eliminan registros; se pasa su estado a EstadoAmbiente.Mantenimiento.

En reservas: No se eliminan registros; se pasa su estado a EstadoReserva.Cancelada o EstadoReserva.Rechazada.

Auditoría:

En reservas: Se audita la fecha/hora de creación con fre\_reserva (DateTime.UtcNow).

Entidad base genérica de auditoría (CreatedAt, UpdatedAt, CreatedBy, UpdatedBy) con interceptor automático en SaveChangesAsync: No existe.

Restricciones e Índices Únicos:

Índice único en correo de usuario: b.HasIndex(u => u.Cor\_Usuario).IsUnique();

Restricciones Check en usuarios:

CK\_usuarios\_tema: tema IN ('claro', 'oscuro')

CK\_usuarios\_tamano\_letra: tamano\_letra IN ('pequeno', 'normal', 'grande')

Restricción Check en ambientes:

CK\_ambientes\_cap\_ambiente: cap\_ambiente > 0

Índice compuesto de consulta rápida en reservas:

b.HasIndex(r => new { r.Ida\_Reserva, r.Fec\_Reserva, r.Est\_Reserva });

Claves foráneas:

ambientes.idr\_ambiente -> usuarios.id\_usuario con OnDelete(DeleteBehavior.SetNull).

reservas.idu\_reserva -> usuarios.id\_usuario con OnDelete(DeleteBehavior.Restrict).

reservas.ida\_reserva -> ambientes.id\_ambiente con OnDelete(DeleteBehavior.Restrict).

3.5. Cadena de Conexión y Orquestación con PostgreSQL

Formato de la cadena de conexión (sin secretos reales)

text

Host=localhost;Port=5432;Database=reservaupla\_db;Username=reservas\_app;Password=\*\*\*\*\*\*\*\*



(En entorno Docker se resuelve con Host=db;Port=5432;Database=${POSTGRES\_DB};Username=${DB\_APP\_USER};Password=${DB\_APP\_PASSWORD}).



Despliegue con Docker Compose



Definido en docker-compose.yml:



Servicio db:

Imagen: postgres:16-alpine.

Contenedor: reservaupla-db.

Volumen persistente: pgdata:/var/lib/postgresql/data.

Inicialización: Monta scripts en /docker-entrypoint-initdb.d/ (01-esquema.sql, 02-crear-rol-app.sh) para crear la base de datos y otorgar permisos con principio de mínimo privilegio a un rol no-superusuario (reservas\_app).

Healthcheck configurado con pg\_isready -U postgres -d ReservasUPLA\_DB para asegurar que la API espere a que la base de datos esté lista antes de arrancar.

Comando para levantar la base de datos de forma aislada:

bash

docker compose up -d db

PARTE 2 DE 3: SECCIONES 4 A 6

4\. ARQUITECTURA FRONTEND

4.1. Estructura de carpetas de src/ y lógica de organización



La aplicación frontend sigue una arquitectura modular híbrida (por tipo técnico para utilidades y componentes compartidos, y por dominio/feature para vistas y componentes especializados):



text

frontend/src/

├── assets/                 # Recursos multimedia estáticos optimizados (logos SVG/PNG, fondos WebP/JPG)

├── components/             # Componentes de presentación divididos por ámbito:

│   ├── ambientes/          # Componentes del módulo de Ambientes (Formulario, Filtros, Acciones)

│   ├── detalle/            # Vista de detalle de reserva (Encabezado, Trazabilidad, Acciones)

│   ├── formulario/         # Controles de entrada de formularios (TextInput, SelectInput, DateInput, etc.)

│   ├── landing/            # Secciones estáticas de la Landing Page (Hero, Navbar, QueEs, ComoFunciona, etc.)

│   ├── navegacion/         # Elementos de shell (Sidebar, Header, MigasDePan, GuiaNormativa, Conmutadores)

│   ├── panel/              # Widgets del Dashboard (Kpis, Grafica, Ranking, FilaAtencion)

│   ├── reservas/           # Componentes del módulo de Reservas (Formulario, Filtros, ModalAccion, etc.)

│   ├── ui/                 # Catálogo de átomos y moléculas genéricas de UI (Button, TableList, Modal, etc.)

│   └── usuarios/           # Componentes del módulo de Usuarios (Formulario, Filtros, AccionesFila)

├── constants/              # Constantes de configuración, reglas, rutas, roles y permisos

├── context/                # Contextos globales de React (PreferenciasContext)

├── hooks/                  # Custom hooks de lógica de negocio, UI, accesibilidad y autenticación

├── layouts/                # Plantillas envolventes de página (LayoutPrincipal, LayoutAutenticacion)

├── mocks/                  # Adaptador simulado en memoria para demostración sin backend (VITE\_USAR\_MOCK)

├── pages/                  # Vistas completas asociadas directamente a rutas

├── routes/                 # Configuración del enrutador y guardas de seguridad (RutaProtegida, RutasApp)

├── services/               # Clientes HTTP y llamadas a la API REST (apiClient, authService, etc.)

├── styles/                 # Capas de estilos CSS y tokens de diseño (base.css, tokens.css, index.css)

├── tests/                  # Pruebas automatizadas de integración y componentes con Vitest y Testing Library

├── utils/                  # Funciones utilitarias puras (formato de fechas, horas, ordenamiento, etc.)

└── validation/             # Esquemas y funciones funcionales de validación

4.2. Enrutamiento y Guardas por Rol

Librería: react-router-dom v6.28.0 utilizando Routes, Route y Outlet.

Organización de rutas: Centralizada en rutas.jsx:

Rutas Públicas: / (Landing Page).

Rutas de Autenticación (bajo LayoutAutenticacion): /login (RUTAS.INGRESAR) y /registro (RUTAS.REGISTRO).

Rutas Protegidas (bajo RutaProtegida y LayoutPrincipal):

/panel: Exige permiso dashboard.ver.

/reservas y /reservas/:id: Exige permiso reservas.ver.

/ambientes: Exige permiso ambientes.ver.

/usuarios: Exige permiso usuarios.listar.

Mecanismo de Guardas: Implementado en RutaProtegida.jsx:

Verifica cargandoSesion (muestra spinner <Cargando />).

Si no está autenticado, redirige inmediatamente a /login preservando el historial (<Navigate to={RUTAS.INGRESAR} replace />).

Si se especifica un permiso (permiso) y el hook usePermisos().puede(permiso) retorna false, redirige a /panel inyectando en location.state el mensaje: "No tiene permiso para acceder a esa sección.".

4.3. Gestión de Estado

Librerías externas (Redux, Zustand, Recoil, React Query): NO se usan.

Mecanismo real:

Estado Global de UI (PreferenciasContext): Ubicado en PreferenciasContext.jsx. Gestiona el tema (claro/oscuro) y tamaño tipográfico (pequeno/normal/grande). Sincroniza bidireccionalmente con localStorage, atributos HTML (data-tema, data-tamano) y el endpoint PATCH /api/usuarios/preferencias si hay sesión activa.

Estado de Sesión (useAuth): Mantiene en memoria el usuario actual (UsuarioDto) y verifica el estado consultando GET /api/auth/me.

Estado de Módulo / Vistas (Co-located Hooks): Cada módulo encapsula su ciclo de vida y caché en memoria con hooks dedicados (useReservas, useAmbientes, useUsuarios, useDashboard).

Justificación arquitectónica: Mantiene el paquete ligero (bundle pequeño sin sobrecarga de dependencias), reduce el tiempo de arranque y facilita el mantenimiento sin boilerplate complejo.

4.4. Capa de Servicios y Cliente HTTP



Implementada en apiClient.js:



Cliente HTTP: Fetch nativo del navegador (Axios No se usa).

Manejo de credenciales: Todas las solicitudes incluyen credentials: 'include', permitiendo que el navegador transmita y reciba automáticamente la cookie de sesión HTTP-only (ReservaUpla.Auth).

Control de Tiempo de Espera (Timeout): Cada petición instancia un AbortController configurado a 10 segundos (TIMEOUT\_PETICION\_MS = 10000).

Adaptador Mock Integrado: Permite ejecutar el frontend 100% autónomo (ideal para demos, diseño y pruebas locales) si VITE\_USAR\_MOCK=true.

javascript

// frontend/src/services/apiClient.js (L15-L38)

async function ejecutarFetchReal(ruta, { metodo = 'GET', cuerpo = null, signal } = {}) {

&#x20; const controlador = new AbortController();

&#x20; const idTimeout = setTimeout(() => controlador.abort(), TIMEOUT\_PETICION\_MS);

&#x20; const abortarExterno = () => controlador.abort();

&#x20; if (typeof signal?.addEventListener === 'function') signal.addEventListener('abort', abortarExterno, { once: true });

&#x20; try {

&#x20;   const opciones = {

&#x20;     method: metodo,

&#x20;     credentials: 'include',

&#x20;     headers: { 'Content-Type': 'application/json', Accept: 'application/json' },

&#x20;     signal: controlador.signal

&#x20;   };

&#x20;   if (cuerpo !== null \&\& metodo !== 'GET') opciones.body = JSON.stringify(cuerpo);

&#x20;   const resp = await fetch(construirUrl(ruta), opciones);

&#x20;   const datos = await resp.json().catch(() => null);

&#x20;   return { estado: resp.status, datos };

&#x20; } catch {

&#x20;   return { estado: 0, datos: null };

&#x20; } finally {

&#x20;   clearTimeout(idTimeout);

&#x20;   if (typeof signal?.removeEventListener === 'function') signal.removeEventListener('abort', abortarExterno);

&#x20; }

}

4.5. Catálogo de Custom Hooks

Custom Hook	Propósito	Firma / Retorno Principal

useAuth	Sesión del usuario, inicio de sesión, logout y estado de carga.	() => { usuario, autenticado, cargandoSesion, ingresar, salir }

usePermisos	Evaluación declarativa de permisos según rol activo.	() => { rol, puede, esAdmin, esResponsable, esSolicitante }

useFormulario	Control de estado de formulario, validación, prevención de doble envío y foco en error.	({ valoresIniciales, validar, alEnviar }) => { valores, errores, tocados, enProceso, errorGeneral, cambiarValor, manejarEnvio, ... }

useReservas	Listado paginado de reservas, filtros por estado/fecha/ambiente y recarga.	(filtroInicial) => { reservas, total, pagina, cargando, error, cambiarFiltro, recargar }

useAccionesReserva	Flujo de aprobación, rechazo y cancelación de reservas.	() => { ejecutarAccion, modal, abrirModal, cerrarModal, enProceso }

useAmbientes	Consulta de catálogo de ambientes, estados y responsables.	() => { ambientes, cargando, error, recargar, guardarAmbiente, cambiarEstado }

useUsuarios	Gestión administrativa de usuarios (listado, creación, edición, estado).	() => { usuarios, cargando, error, crearUsuario, editarUsuario, alternarEstado }

useDashboard	Métricas de ocupación, KPIs, reservas por estado y pendientes de atención.	() => { datos, cargando, error, recargar }

useTema	Alternancia y lectura del tema (claro / oscuro).	() => { tema, alternarTema, esOscuro }

useTamanoFuente	Gestión accesible de la escala de fuente (pequeno, normal, grande).	() => { tamano, cambiarTamano, siguienteTamano }

useSincronizarPreferencias	Persiste preferencias en el backend cuando el usuario inicia sesión.	(usuario) => void

useDebounce	Retrasa el valor de entrada para búsquedas reactivas en vivo.	(valor, demoraMs) => valorDebounceado

useTrampaFoco	Atrapa el foco del teclado dentro de modales accesibles (WCAG 2.2).	(abierto, alCerrar, selectorInicial) => refContenedor

useFocoAlMontar	Enfoca automáticamente un elemento HTML al montarse el componente.	() => ref

useBloqMayus	Detecta si la tecla Bloq Mayús (Caps Lock) está activada en inputs de contraseña.	() => { activo, manejadorKeyDown, manejadorKeyUp }

useCorreoRecordado	Guarda y recupera de forma segura el último correo ingresado en el login.	() => \[correoRecordado, guardarCorreoRecordado]

useMenuDesplegable	Controla apertura/cierre de menús flotantes con clic externo y teclado.	() => { abierto, abrir, cerrar, alternar, refContenedor }

useMediaQuery	Evaluación reactiva de Media Queries de CSS en JavaScript.	(query) => coincideBooleano

4.6. Manejo de Formularios y Validación Frontend

Librerías (Formik, React Hook Form, Zod, Yup): No se usan.

Mecanismo: El hook useFormulario.js centraliza:

Prevención estricta de doble envío mediante un useRef atómico (enProcesoRef.current).

Detección de campos tocados (onBlur).

Foco accesible automático en el primer campo que presente error tras el intento de envío (enfocarPrimerError).

Esquemas funcionales desacoplados en frontend/src/validation/ (validadores.js, reglasReserva.js, etc.).

5\. CATÁLOGO DE COMPONENTES REUTILIZABLES

5.1. Botones y Acciones

Button

Ruta: frontend/src/components/ui/Button.jsx

Props:

children (Node, opcional, default: null)

variante (String, opcional, default: 'primary'): 'primary', 'neutral-info', 'success', 'danger', 'danger-outline', 'warning', 'secondary', 'ghost', 'icon-only' (soporta alias en español: 'primario', 'peligro', etc.).

tamano (String, opcional, default: 'md'): 'sm', 'md'.

enProceso (Boolean, opcional, default: false): Muestra spinner y bloquea el botón.

textoProceso (String, opcional, default: 'Cargando…').

icono (String, opcional, default: null): Nombre del icono de Lucide.

disabled (Boolean, opcional, default: false).

tooltip (String, opcional, default: '').

aria-label (String, opcional).

onClick (Function, opcional).

Ejemplo real:

jsx

<Button variante="success" icono="Check" enProceso={guardando} onClick={aprobar}>

&#x20; Aprobar reserva

</Button>

Clasificación: Genérico (Reutilizable tal cual).

5.2. Controles de Formulario

CampoFormulario

Ruta: frontend/src/components/formulario/CampoFormulario.jsx

Props: id (String, req), etiqueta (String, opt), obligatorio (Boolean, default: true), ayuda (String, opt), error (String, opt), contador (String/Node, opt), children (Node, req).

Clasificación: Genérico. Vincula automáticamente aria-describedby entre el input y su mensaje de error o ayuda.

TextInput, PasswordInput, SelectInput, TextAreaInput, DateInput, TimeInput

Ruta: frontend/src/components/formulario/

Props comunes: id, name, value, onChange, onBlur, error, disabled, placeholder, ref. En SelectInput: opciones (\[{ valor, etiqueta }]).

Clasificación: Genéricos.

5.3. Modales y Diálogos

ModalConfirmacion

Ruta: frontend/src/components/ui/ModalConfirmacion.jsx

Props: abierto (Boolean, req), titulo (String, req), descripcion (String, opt), resumen (Node, opt), esIrreversible (Boolean, default: false), requiereMotivo (Boolean, default: false), motivo (String), alCambiarMotivo (Func), etiquetaConfirmar (String), varianteConfirmar (String), enProceso (Boolean), alConfirmar (Func), alCancelar (Func).

Ejemplo real:

jsx

<ModalConfirmacion

&#x20; abierto={modal.abierto}

&#x20; titulo="Desactivar Usuario"

&#x20; descripcion="El usuario perderá el acceso a la plataforma."

&#x20; varianteConfirmar="danger"

&#x20; esIrreversible={false}

&#x20; alConfirmar={confirmarDesactivacion}

&#x20; alCancelar={cerrarModal}

/>

Clasificación: Híbrido. Posee soporte para renderizar un objeto reserva directamente si se pasa la prop reserva, pero es completamente genérico si se usa la prop resumen o children.

5.4. Tablas y Paginación

TableList

Ruta: frontend/src/components/ui/TableList.jsx

Props:

caption (String, req): Título accesible oculto para lectores de pantalla.

columnas (Array, req): \[{ clave, encabezado, ordenable, render, claseEncabezado, claseCelda }].

datos (Array, req): Arreglo de filas.

claveFila (String, default: 'id').

cargando (Boolean, default: false): Renderiza filas de esqueleto (animate-pulse).

mensajeVacio (String), esFiltroActivo (Boolean), alLimpiarFiltros (Func).

paginacion (Boolean, default: true), tamanoPaginaInicial (Number, default: 5).

Clasificación: Genérico (Reutilizable tal cual en cualquier entidad).

PaginacionTabla

Ruta: frontend/src/components/ui/PaginacionTabla.jsx

Props: paginaActual, totalPaginas, totalRegistros, tamanoPagina, alCambiarPagina, alCambiarTamano.

Clasificación: Genérico.

5.5. Indicadores, Badges y Mensajes

CardIndicador

Ruta: frontend/src/components/ui/CardIndicador.jsx

Props: titulo, valor, descripcion, icono, enlace, etiquetaEnlace, variante.

Clasificación: Genérico.

Badge

Ruta: frontend/src/components/ui/Badge.jsx

Props: children, variante ('neutro', 'exito', 'peligro', 'advertencia', 'primario'), tamano, icono.

Clasificación: Genérico.

EstadoBadge, EstadoAmbienteBadge, TipoAmbienteChip

Ruta: frontend/src/components/ui/

Clasificación: Específicos del Dominio (Mapean enums propios de ReservaUPLA: estados de reservas y tipos de ambientes universitarios).

AlertMessage y Toast

Ruta: frontend/src/components/ui/AlertMessage.jsx y Toast.jsx

Props: tipo ('exito', 'error', 'advertencia', 'info'), mensaje, onCerrar.

Clasificación: Genéricos.

5.6. Estado de Carga, Vacío e Iconos

Cargando y EstadoVacio

Ruta: frontend/src/components/ui/Cargando.jsx y EstadoVacio.jsx

Clasificación: Genéricos.

Icono

Ruta: frontend/src/components/ui/Icono.jsx

Props: nombre (String, nombre del icono en Lucide), className, ...props.

Clasificación: Genérico.

5.7. Oportunidades de Refactorización / Componentes Duplicados

Modales de acción especializados: Existen ModalAccionReserva.jsx, ModalCambiarEstadoAmbiente.jsx y ModalConfirmacion.jsx. Tienen cerca de un 80% de lógica y marcado estructural idéntico (trampa de foco, encabezado con botón cerrar, campo de motivo opcional, botones de acción). En un nuevo proyecto, conviene parametrizar un único <ModalDialog> reutilizable.

Barras de filtros repetidas: FiltrosReservas.jsx, FiltrosAmbientes.jsx y FiltrosUsuarios.jsx implementan de forma separada la disposición del buscador con debounce y selectores de estado. Pueden unificarse mediante un componente genérico <FilterBar>.

6\. SISTEMA DE DISEÑO (UI)

6.1. Configuración de Tailwind CSS



El archivo frontend/tailwind.config.js mapea tokens semánticos definidos como variables CSS nativas:



javascript

// frontend/tailwind.config.js

export default {

&#x20; content: \['./index.html', './src/\*\*/\*.{js,jsx}'],

&#x20; theme: {

&#x20;   extend: {

&#x20;     colors: {

&#x20;       fondo: 'var(--fondo)',

&#x20;       superficie: 'var(--superficie)',

&#x20;       'superficie-2': 'var(--superficie-2)',

&#x20;       borde: 'var(--borde)',

&#x20;       'borde-control': 'var(--borde-control)',

&#x20;       texto: 'var(--texto)',

&#x20;       'texto-suave': 'var(--texto-suave)',

&#x20;       primario: 'var(--primario)',

&#x20;       'primario-hover': 'var(--primario-hover)',

&#x20;       'primario-enlace': 'var(--primario-enlace)',

&#x20;       'sobre-primario': 'var(--sobre-primario)',

&#x20;       'lateral-fondo': 'var(--lateral-fondo)',

&#x20;       'lateral-texto': 'var(--lateral-texto)',

&#x20;       'lateral-activo-fondo': 'var(--lateral-activo-fondo)',

&#x20;       'anillo-foco': 'var(--anillo-foco)',

&#x20;       'pendiente-texto': 'var(--pendiente-texto)',

&#x20;       'pendiente-fondo': 'var(--pendiente-fondo)',

&#x20;       'aprobada-texto': 'var(--aprobada-texto)',

&#x20;       'aprobada-fondo': 'var(--aprobada-fondo)',

&#x20;       'rechazada-texto': 'var(--rechazada-texto)',

&#x20;       'rechazada-fondo': 'var(--rechazada-fondo)'

&#x20;     },

&#x20;     fontFamily: {

&#x20;       sans: \['"Montserrat Variable"', '"Segoe UI"', 'system-ui', 'Arial', 'sans-serif']

&#x20;     },

&#x20;     borderRadius: {

&#x20;       sm: 'var(--radius-sm)',      // 0.375rem (6px)

&#x20;       md: 'var(--radius-md)',      // 0.5rem (8px)

&#x20;       lg: 'var(--radius-lg)',      // 0.875rem (14px)

&#x20;       pill: 'var(--radius-pill)',  // 999px

&#x20;       control: 'var(--radio-control)', // 0.5rem

&#x20;       tarjeta: 'var(--radio-tarjeta)'  // 0.875rem

&#x20;     },

&#x20;     height: {

&#x20;       control: 'var(--alto-control)' // 2.75rem (44px, tamaño táctil mínimo WCAG)

&#x20;     }

&#x20;   }

&#x20; },

&#x20; plugins: \[]

};

6.2. Paleta de Colores Efectivamente Usada



Definida en frontend/src/styles/tokens.css:



Propósito Semántico	Modo Claro (Hex)	Modo Oscuro (Hex)	Uso / Elementos de Aplicación

Fondo Principal (--fondo)	#F4F6FA	#0B1220	<body>, fondo general de la aplicación.

Superficie (--superficie)	#FFFFFF	#121C33	Tarjetas, modales, contenedores de tablas, inputs.

Superficie 2 (--superficie-2)	#EBF0F8	#172443	Encabezados de tabla (<thead>), filas alternas, fondos de chips.

Borde Base (--borde)	#D0D8E8	#263554	Divisores, bordes de tarjetas y celdas.

Borde Control (--borde-control)	#8C9BB5	#6F83A8	Bordes de inputs en reposo.

Texto Principal (--texto)	#0F172A	#E8EEF9	Títulos, cuerpo principal de texto, valores de tabla.

Texto Suave (--texto-suave)	#4A5568	#A9B8D4	Subtítulos, etiquetas secundarias, placeholders.

Primario / Acción (--primario)	#0A3D91	#2563D6	Botones de acción principal, enlaces activos, branding.

Brand Institucional (--color-brand)	#0A2540	#2563D6	Botón principal de login y cabecera de sidebar.

Barra Lateral (--lateral-fondo)	#0A2540	#08101F	Fondo del Sidebar (azul marino institucional).

Éxito / Aprobado (--btn-success-bg)	#15803D / Fondo: #DAF4E5	Fondo: #0F3323	Botones de aprobación, badge de reserva aprobada.

Peligro / Rechazado (--btn-danger-bg)	#B91C1C / Fondo: #FDE2E2	Fondo: #3A1414	Botones de rechazar/eliminar, badge de rechazo.

Advertencia (--pendiente-fondo)	#FFF1CC (Texto: #6B3F00)	#3A2A0A (Texto: #FFD58A)	Badge de reserva pendiente, alertas de advertencia.

Anillo de Foco (--anillo-foco)	#0B4DA2	#7DB8FF	focus-visible:ring-2 para accesibilidad por teclado.

6.3. Tipografía e Iconografía

Fuente: @fontsource-variable/montserrat. Se importa en frontend/src/styles/index.css como fuente variable (pesos 100 a 900). Se configuran números tabulares (cifra-tabular / font-variant-numeric: tabular-nums) para fechas, horas y cifras estadísticas.

Iconos: lucide-react v0.460.0. No se importan sueltos por los componentes; se consumen centralizados mediante el envoltorio accesible <Icono nombre="..." /> (Icono.jsx).

6.4. Estructura del Layout Principal

Sidebar:

Escritorio (md: en adelante): Ancho fijo de 16rem (256px), posición fixed inset-y-0 left-0, fondo azul noche (#0A2540), enlaces con estado activo (bg-\[#13395E] y barra lateral de acento celeste).

Móvil: Oculto por defecto. Se abre como un cajón deslizante (drawer) superpuesto sobre un telón con desenfoque de fondo.

Header:

Altura fija de 4rem (64px / h-16).

Pegajoso en la parte superior (sticky top-0 z-30).

Contiene: botón de menú hamburguesa (en móvil), migas de pan dinámicas (MigasDePan), botón modal de guía normativa, conmutador de tema claro/oscuro, selector de tamaño de fuente (A- / A / A+) y avatar con menú desplegable de usuario.

Área de Contenido (PageContainer):

Ocupa el espacio restante (flex-1 min-w-0).

Relleno responsive: px-4 sm:px-6 py-6.

Ancho máximo adaptable: max-w-7xl para panel y formularios; ancho completo con scroll horizontal fluido para tablas.

6.5. Estilo Visual de Vistas y Componentes Clave

Login y Registro:

Layout de dos columnas en escritorio: panel izquierdo con imagen de fondo institucional, superposición con gradiente azul noche y textos de bienvenida; panel derecho con tarjeta limpia y centrada para el formulario.

Detección de Bloq Mayús en el campo de contraseña con aviso visual amarillo.

Checkbox accesible de "Recordar correo en este equipo".

Dashboard:

Cuadrícula de tarjetas de KPIs (CardIndicador) con iconos coloridos en recuadros redondeados, valor numérico en tipografía grande seminegrita y enlace de acción directo.

Gráfica de Reservas por Estado: Implementada con SVG nativo puro (cero librerías externas), mediante círculos concéntricos con strokeDasharray y strokeDashoffset, etiqueta accesible para lectores de pantalla (aria-label) y leyenda lateral con cifras y porcentajes.

Tablas:

Encabezado con fondo diferenciado (bg-superficie-2), bordes sutiles de 1px, botones accesibles para ordenamiento de columnas con flechas indicadoras (ArrowUp/ArrowDown).

Filas con efecto hover:bg-superficie-2 y altura táctil confortable (56px a 64px).

Formularios y Validaciones:

Inputs con altura mínima de 44px (h-control), esquinas redondeadas (rounded-control = 8px) y bordes contrastados.

Mensajes de error en color rojo (text-rechazada-texto), ubicados debajo de cada campo con role="alert", acompañados de borde rojo en el input.

Estados Vacíos y de Carga:

Estado de carga en tablas mediante 5 filas con barras animadas de pulso (animate-pulse).

Estado vacío (EstadoVacio) con icono circular grande en tono gris suave, título explicativo, texto orientativo y botón para limpiar filtros o crear el primer registro.

PARTE 3 DE 3: SECCIONES 7 A 10

7\. CLEAN CODE Y CONVENCIONES

7.1. Convenciones de Nombres

Backend (C# / .NET):

Clases, Métodos y Enums: PascalCase estricto (ReservaService, ObtenerDashboardAsync, EstadoReserva.Pendiente).

Interfaces: Prefijo I con PascalCase (IReservaRepository, IUnitOfWork, IActor).

Campos privados / Dependencias inyectadas: Prefijo \_ con camelCase (\_reservaRepo, \_context, \_logger).

DTOs y Records: Sufijo Dto (CrearReservaDto, ReservaDetalleDto, PaginadoDto<T>).

Entidades de Dominio: Propiedades en PascalCase con convención de base de datos (Id\_Reserva, Fec\_Reserva, Mot\_Reserva).

Frontend (React / JavaScript):

Componentes y Layouts: PascalCase con extensión .jsx (Button.jsx, TableList.jsx, LayoutPrincipal.jsx).

Custom Hooks: Prefijo use con camelCase en archivos .js o .jsx (useFormulario.js, useAuth.js).

Servicios y Utilidades: camelCase (apiClient.js, authService.js, formatearFecha.js).

Constantes globales: UPPER\_SNAKE\_CASE en objetos congelados (RUTAS, PERMISOS, ESTADOS\_RESERVA).

7.2. Configuración de Linter y Formatter

Prettier: No existe (.prettierrc ausente).

EditorConfig: No existe (.editorconfig ausente).

ESLint: Implementado bajo la especificación moderna Flat Config de ESLint 9 en frontend/eslint.config.js:

Plugins: @eslint/js, eslint-plugin-react, eslint-plugin-react-hooks, eslint-plugin-jsx-a11y.

Reglas estrictas aplicadas:

'no-console': 'error': Prohíbe dejar llamadas a console.log en el código productivo.

'no-unused-vars': \['error', { argsIgnorePattern: '^\_' }]: Exige limpieza de variables sin uso.

'react-hooks/rules-of-hooks': 'error' y 'react-hooks/exhaustive-deps': 'error': Obligatoriedad en los arreglos de dependencias de hooks.

Integración total de reglas de accesibilidad WCAG (...jsxA11y.configs.recommended.rules).

7.3. Aplicación de Principios SOLID y Ejemplos de Refactorización

1\. Principio de Inversión de Dependencias (DIP) y Responsabilidad Única (SRP)

Compromiso Git: ff74cdc (refactor(backend): encapsulate domain invariants and inject iactor abstractions).

Antes: Las entidades y servicios recibían directamente ClaimsPrincipal o cadenas de texto dependientes de ASP.NET Core, acoplando el núcleo de dominio con la infraestructura HTTP.

Después: Se introdujo la abstracción IActor.cs (Guid Id, RolUsuario Rol), permitiendo evaluar permisos e invariantes puras en Reserva.cs sin depender de Microsoft.AspNetCore.

2\. Reemplazo de Listas Largas de Parámetros por Parameter Objects

Compromiso Git: 709c64b (refactor(backend): introduce parameter objects and clean up auth controller).

Antes: Los métodos del repositorio recibían hasta 7 parámetros sueltos (Guid? solicitanteId, Guid? ambienteId, DateOnly? fecha, int pagina...).

Después: Se encapsuló en el record inmutable ParametrosConsultaReservas.cs, simplificando la firma de métodos y facilitando la extensibilidad.

3\. Principio Abierto/Cerrado (OCP) y DRY en Variantes de Botones

Compromiso Git: e6d98ed (refactor(frontend): unifica componentes reutilizables y elimina duplicidad en filtros, toasts y modales).

Antes: Cada botón creaba clases de Tailwind con concatenaciones manuales y variantes dispersas sin consistencia cromática ni semántica.

Después: Se centralizó el diccionario extensible VARIANTES\_BASE y ALIAS\_VARIANTES en Button.jsx, permitiendo añadir nuevas variantes de estilo sin tocar la lógica interna del componente.

7.4. Estructura de Commits y Ramas Observada en Git

Convención de Commits: Conventional Commits estricto (feat:, fix:, refactor:, style:, docs:, chore:, test:).

Atribución: Sin marcas de autoría asistida ni Co-Authored-By.

Estrategia de Ramificación: Modelo basado en ramas por funcionalidad (feature/landing-page, feature/modulo-usuarios, fix/correcciones-auditoria) integradas a main mediante fusiones limpias (merge commits o fast-forward).

7.5. Estrategia de Pruebas Automatizadas



El proyecto cuenta con una batería de 207 pruebas automáticas en total, divididas en:



Backend (ReservaUpla.Tests): 108 pruebas ejecutadas con xUnit, Moq y Microsoft.AspNetCore.Mvc.Testing.

Pruebas Unitarias: Verifican invariantes de las entidades de dominio (validación de horarios 07:00-22:00, rechazo de solapes, duraciones mínimas y máximas, transiciones de estado).

Pruebas de Integración: Levantan un WebApplicationFactory<Program> con base de datos en memoria (UseInMemoryDatabase), evaluando endpoints reales, autorización RBAC (respuestas 401 para anónimos, 403 para roles sin permiso y 200 para autorizados) y el middleware de rate limiting.

Frontend (frontend/src/tests): 99 pruebas en 25 suites ejecutadas con Vitest, @testing-library/react y jsdom.

Evalúan accesibilidad (foco inicial, trampas de foco en modales, atributos ARIA dinámicos), paginación, filtros de tablas, persistencia de preferencias de usuario y flujos de pantalla.

8\. DASHBOARD Y REPORTES

8.1. Implementación de Consultas Agregadas



Las estadísticas del panel se calculan mediante LINQ puro proyectado sobre EF Core, optimizado con AsNoTracking() para evitar consumo innecesario de memoria en el Change Tracker.



Ubicación: ReservaRepository.cs

csharp

public async Task<DashboardEstadisticasDto> ObtenerEstadisticasDashboardAsync(Guid? solicitanteId, Guid? responsableId, CancellationToken ct = default)

{

&#x20;   var query = ConstruirFiltro(new ParametrosConsultaReservas(SolicitanteId: solicitanteId, ResponsableId: responsableId));

&#x20;   var total = await query.CountAsync(ct);

&#x20;   var pendientes = await query.CountAsync(r => r.Est\_Reserva == EstadoReserva.Pendiente, ct);

&#x20;   var aprobadas = await query.CountAsync(r => r.Est\_Reserva == EstadoReserva.Aprobada, ct);

&#x20;   var rechazadas = await query.CountAsync(r => r.Est\_Reserva == EstadoReserva.Rechazada, ct);

&#x20;   var canceladas = await query.CountAsync(r => r.Est\_Reserva == EstadoReserva.Cancelada, ct);

&#x20;   var (nombreAmbienteMasUsado, usoMaximo) = await ObtenerAmbienteMasUtilizadoAsync(query, ct);

&#x20;   return new DashboardEstadisticasDto(total, pendientes, aprobadas, rechazadas, canceladas, nombreAmbienteMasUsado, usoMaximo);

}

private async Task<(string Nombre, int Cantidad)> ObtenerAmbienteMasUtilizadoAsync(IQueryable<Reserva> query, CancellationToken ct)

{

&#x20;   var agrupados = await query

&#x20;       .GroupBy(r => r.Ida\_Reserva)

&#x20;       .Select(g => new { AmbienteId = g.Key, Cantidad = g.Count() })

&#x20;       .OrderByDescending(x => x.Cantidad)

&#x20;       .ToListAsync(ct);

&#x20;   if (agrupados.Count == 0) return ("Sin registros", 0);

&#x20;   var maxCantidad = agrupados\[0].Cantidad;

&#x20;   var ambiente = await \_context.Ambientes.AsNoTracking()

&#x20;       .Where(a => a.Id\_Ambiente == agrupados\[0].AmbienteId)

&#x20;       .FirstOrDefaultAsync(ct);

&#x20;   return (ambiente?.Nom\_Ambiente ?? "Desconocido", maxCantidad);

}

8.2. Flujo Completo de Filtros, Búsqueda y Paginación

text

\[ Usuario escribe en Search Input ] 

&#x20;      │

&#x20;      ▼ (Retraso de 300 ms con useDebounce en Frontend)

\[ Disparo de petición GET /api/reservas?estado=Pendiente\&pagina=1\&tamanoPagina=10 ]

&#x20;      │

&#x20;      ▼ (apiClient envía solicitud con credentials: 'include')

\[ ReservasController.ListarReservas ] 

&#x20;      │

&#x20;      ▼ (Mapea FromQuery a FiltroReservasDto)

\[ ReservaService.ListarReservasAsync ]

&#x20;      │

&#x20;      ▼ (Resuelve alcance del usuario: Solicitante ve lo propio, Responsable lo asignado, Admin todo)

\[ ReservaRepository.ListarReservasAsync ]

&#x20;      │

&#x20;      ▼ (Construye IQueryable dinámico con Where, Skip y Take en PostgreSQL)

\[ Retorna PaginadoDto<ReservaDto> con Items, TotalItems, PaginaActual, TotalPaginas ]

&#x20;      │

&#x20;      ▼ (Frontend actualiza TableList con datos y monta PaginacionTabla)

\[ Renderizado de filas con estados y botones de acción contextuales ]

9\. DOCUMENTACIÓN Y DESPLIEGUE

9.1. Archivos de Configuración y Despliegue

README.md: Documentación integral con arquitectura, tabla de credenciales semilla de prueba, matriz de roles, instrucciones de ejecución local y con Docker, y catálogo de capturas.

.env.example: Plantilla de variables de entorno para Docker Compose:

POSTGRES\_DB: Nombre de base de datos (ReservasUPLA\_DB).

POSTGRES\_USER: Usuario administrador de PostgreSQL (postgres).

POSTGRES\_PASSWORD: Contraseña maestra.

DB\_APP\_USER: Rol de mínimo privilegio en runtime (reservas\_app).

DB\_APP\_PASSWORD: Contraseña del rol de aplicación.

VITE\_USAR\_MOCK: Bandera para alternar entre backend real o mocks en memoria (false).

VITE\_API\_URL: URL del servidor backend (http://localhost:5000).

docker-compose.yml: Orquesta 3 servicios (db, api, web) con redes internas y volúmenes persistentes (pgdata).

9.2. Comandos de Ejecución y Arranque

Opción A: Despliegue Integral con Docker

bash

\# 1. Crear el archivo de entorno a partir de la plantilla

cp .env.example .env

\# 2. Levantar los 3 contenedores (PostgreSQL, Backend .NET y Frontend Vite)

docker compose up -d --build

\# 3. Acceder al sistema

\# Frontend: http://localhost:5173

\# Backend / Swagger: http://localhost:5000/swagger

Opción B: Ejecución Local para Desarrollo

bash

\# 1. Levantar únicamente la base de datos PostgreSQL

docker compose up -d db

\# 2. Ejecutar el Backend (aplica migraciones y seeder automáticamente al arrancar)

dotnet run --project backend/ReservaUpla.Api --launch-profile http

\# 3. En otra terminal, arrancar el Frontend

cd frontend

npm install

npm run dev

\# 4. Ejecutar pruebas automatizadas

dotnet test

cd frontend \&\& npm test

10\. MAPA DE REUTILIZACIÓN ARQUITECTÓNICA



Esta sección desglosa qué componentes del proyecto podés llevarte directamente a tu nuevo desarrollo con el mismo stack, qué componentes requieren parametrización y qué partes debés descartar por pertenecer estrictamente a la lógica de reservas de ambientes universitarios.



A) COPIAR TAL CUAL (100% Genérico)	B) ADAPTAR (Genérico con Ajustes Menores)	C) DESCARTAR (Específico de ReservaUPLA)

frontend/src/components/ui/Button.jsx: Sistema completo de botones con variantes, tamaños, soporte de accesibilidad y estados de carga.	backend/.../Data/AppDbContext.cs: La estructura de configuración 100% Fluent API y naming convention; cambiar las entidades por las de tu nuevo dominio.	Entidades de Dominio: Ambiente.cs y Reserva.cs.

frontend/src/components/ui/TableList.jsx: Tabla responsiva con ordenamiento de columnas en memoria, esqueletos de carga y paginación.	backend/.../Data/DatabaseSeeder.cs: El patrón de ejecución condicional de seeds; cambiar los usuarios y registros por los del nuevo proyecto.	DTOs específicos: CrearReservaDto, CrearAmbienteDto, etc.

frontend/src/components/ui/PaginacionTabla.jsx: Barra de navegación por páginas con selector de tamaño de página.	backend/.../Security/PermisoAuthorization.cs: El manejador de políticas por permiso; ajustar la lista de permisos de tu nuevo negocio.	Componentes de vista: FormularioReserva.jsx, FormularioAmbiente.jsx, AccionesReserva.jsx, etc.

frontend/src/components/ui/CardIndicador.jsx: Tarjeta de KPI accesible para cuadros de mando.	frontend/src/layouts/LayoutPrincipal.jsx: La estructura de Sidebar + Header + PageContainer; cambiar los items del menú por tus nuevos módulos.	Páginas de negocio: Ambientes.jsx, ListadoReservas.jsx, DetalleReserva.jsx.

frontend/src/components/ui/Icono.jsx: Envoltorio dinámico para el consumo centralizado de iconos Lucide.	frontend/src/components/ui/ModalConfirmacion.jsx: Desacoplar el fallback de reserva para dejarlo como un diálogo de confirmación totalmente neutro.	Validadores de negocio: reglasReserva.js, reglasAmbiente.js.

frontend/src/components/ui/AlertMessage.jsx y Toast.jsx: Componentes de notificación y alertas semánticas con auto-cierre.	frontend/src/hooks/usePermisos.js: El hook de evaluación de capacidades según el nuevo catálogo de roles del proyecto.	Gráfica de dona de reservas: GraficaReservasEstado.jsx (adaptar los segmentos del SVG nativo a tus nuevos estados).

frontend/src/components/formulario/ (TextInput, PasswordInput, SelectInput, TextAreaInput, DateInput, TimeInput, CampoFormulario): Controles de entrada de formularios totalmente desacoplados con soporte ARIA.	backend/.../Middlewares/GlobalExceptionHandlerMiddleware.cs: La estructura de intercepción; adaptar los tipos de excepciones si tu nuevo dominio usa otras.	Mocks de ReservaUPLA: datosSemilla.js, manejadoresReservasDashboard.js.

frontend/src/hooks/useFormulario.js: Hook de gestión de formularios con prevención de doble clic y auto-foco en errores.	docker-compose.yml: La infraestructura con healthchecks y rol de mínimo privilegio; cambiar nombres de base de datos.	Badges de dominio: EstadoBadge.jsx, EstadoAmbienteBadge.jsx, TipoAmbienteChip.jsx.

frontend/src/hooks/useTrampaFoco.js, useFocoAlMontar.js, useDebounce.js, useBloqMayus.js: Utilidades puras de interacción y accesibilidad.	frontend/src/services/apiClient.js: El cliente fetch con AbortController y cookies; ajustar endpoints base si cambia la ruta prefijo.	

frontend/src/context/PreferenciasContext.jsx: Conmutador completo de tema claro/oscuro y escala tipográfica persistente.	frontend/src/constants/rutas.js: La centralización de URLs; actualizar a las rutas de tus nuevos módulos.	

backend/.../Security/PasswordHasherService.cs: Implementación de PBKDF2 (100k iteraciones) con protección contra timing attacks.		

backend/.../DTOs/PaginadoDto.cs: Contrato genérico inmutable para respuestas paginadas PaginadoDto<T>.		

backend/.../Exceptions/DomainException.cs: Excepción de dominio para controlar violaciones de reglas de negocio.		

frontend/tailwind.config.js y tokens.css: Sistema de diseño con variables semánticas, radios, alturas mínimas táctiles de 44px y paleta accesible.		

10.1. Deudas Técnicas y Malas Prácticas Detectadas que NO Deben Replicarse



Contraseñas quemadas en código (Hardcoded) en PasswordHasherService.cs:



Hallazgo: PasswordHasherService.cs contiene comparaciones explícitas con contraseñas en texto plano como "Admin123\*", "AdminUpla2026!" y "RespUpla2026!" como mecanismo de compatibilidad para pruebas.

Riesgo: Si este código llega a un entorno de producción, compromete la seguridad de las cuentas de demostración.

Recomendación: En el nuevo proyecto, las credenciales de prueba deben inyectarse exclusivamente a través de los datos del Seeder y verificarse siempre mediante el hash criptográfico estándar, sin atajos en el servicio de hashing.



Acoplamiento residual en ModalConfirmacion.jsx:



Hallazgo: Líneas 40-47 de ModalConfirmacion.jsx inspeccionan propiedades específicas de reservas (reserva.ambiente.nombre, reserva.horaInicio).

Riesgo: Un componente ubicado en components/ui/ debe ser agnóstico del dominio. Si cambia la entidad, este componente falla o arrastra acoplamiento indebido.

Recomendación: Extraer todo contenido contextual hacia la prop children o resumen, dejando el modal puramente estructural.



Ausencia de Interceptor Global de Auditoría en EF Core:



Hallazgo: Las entidades no heredan de una clase base común con metadatos de auditoría (CreatedAt, UpdatedAt, CreatedBy, UpdatedBy). Cada tabla gestiona sus fechas de forma aislada (por ejemplo fre\_reserva en reservas, pero ausente en usuarios y ambientes).

Recomendación: En el nuevo proyecto, crear una clase abstracta AuditableEntity y sobreescribir SaveChangesAsync en el DbContext (o utilizar un SaveChangesInterceptor) para rellenar de forma automática y consistente la fecha y usuario de creación/modificación.



Invalidez de Sesiones por Cookie sin Lista de Revocación en Servidor:



Hallazgo: Las cookies de sesión de ASP.NET Core son validadas por firma criptográfica en el cliente. Si un Administrador desactiva a un usuario (act\_usuario = false), su cookie existente sigue siendo técnicamente válida ante peticiones directas hasta que expire, a menos que el endpoint re-consulte la base de datos o se valide un SecurityStamp en cada solicitud.

Recomendación: Implementar un CookieAuthenticationEvents.ValidatePrincipal para verificar que el usuario continúe activo en la base de datos durante el ciclo de vida de la cookie, o utilizar tokens revocables centralizados.



Ausencia de formateador unificado (.editorconfig / Prettier):



Hallazgo: El proyecto tiene un linter muy bien configurado con ESLint 9, pero carece de un archivo .editorconfig en la raíz. Esto puede provocar discrepancias de fin de línea (LF vs CRLF) y espacios/tabulaciones al trabajar en equipos con desarrolladores en Windows, macOS o Linux.

Recomendación: Incluir un archivo .editorconfig en la raíz desde el primer commit del nuevo proyecto.

