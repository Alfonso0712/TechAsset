using System.Collections.Generic;

namespace TechAsset.Application.DTOs;

public record PaginadoDto<T>(
    IReadOnlyList<T> Items,
    int Pagina,
    int TamanoPagina,
    int TotalItems,
    int TotalPaginas
);
