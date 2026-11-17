using System;
using TechAsset.Domain.Common;
using TechAsset.Domain.Enums;

namespace TechAsset.Application.Interfaces;

public interface IUsuarioActual : IActor
{
    string Correo { get; }
    bool EstaAutenticado { get; }
}
