namespace TechAsset.Domain.Constants;

public static class Mensajes
{
    // Reglas de Negocio (RN-01 a RN-10)
    public const string RN01_EquipoConPrestamoActivo = "El equipo seleccionado ya se encuentra asociado a un préstamo activo vigente.";
    public const string RN02_EquipoEnMantenimiento = "No es posible prestar un equipo que se encuentra en estado Mantenimiento.";
    public const string RN03_EquipoEnBaja = "No es posible prestar un equipo que ha sido dado de Baja.";
    public const string RN04_FechaDevolucionInvalida = "La fecha estimada de devolución debe ser estrictamente posterior a la fecha de préstamo.";
    public const string RN04_FechaDevolucionRealInvalida = "La fecha de devolución real no puede ser anterior a la fecha en que se inició el préstamo.";
    public const string RN05_ResponsableRequeridoEnActivo = "Todo préstamo en estado Activo debe contar con un Responsable de Tecnología asignado.";
    public const string RN06_EliminacionFisicaNoPermitida = "No se permite la eliminación física de equipos tecnológicos. Si el equipo no está operativo, debe pasarse al estado Baja.";
    public const string RN07_CodigoPatrimonialDuplicado = "El código patrimonial ingresado ya está registrado para otro equipo en el sistema.";
    public const string RN08_CorreoUsuarioDuplicado = "El correo electrónico corporativo ya está registrado para otro usuario.";
    public const string RN09_UsuarioConPrestamosActivos = "No se puede deshabilitar a un usuario que actualmente posee préstamos en estado Activo.";
    public const string RN10_ObservacionDevolucionRequerida = "El registro de devolución exige una observación descriptiva no vacía sobre la condición del equipo.";

    // Generales de Validación
    public const string NombreRequerido = "El nombre es obligatorio y debe tener un formato válido.";
    public const string CodigoPatrimonialRequerido = "El código patrimonial es obligatorio.";
    public const string MotivoRequerido = "El motivo de la solicitud o préstamo es obligatorio.";
    public const string ResponsableRequerido = "Debe indicarse un responsable válido.";
    public const string AreaRequerida = "Debe seleccionar un área válida.";
    public const string EstadoTransicionInvalida = "La transición de estado solicitada no es válida para la entidad.";
    public const string NoAutorizado = "No cuenta con los permisos necesarios para realizar esta operación.";
    public const string AccesoDenegado = "No cuenta con los permisos necesarios para realizar esta operación.";
    public const string RecursoNoEncontrado = "El recurso solicitado no fue encontrado.";
}
