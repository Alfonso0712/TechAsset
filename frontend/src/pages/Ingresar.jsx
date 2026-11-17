import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFormulario } from '../hooks/useFormulario';
import { useCorreoRecordado } from '../hooks/useCorreoRecordado';
import { validarLogin } from '../validation/reglasAuth';
import { RUTAS } from '../constants/rutas';
import LogoTechAsset from '../components/navegacion/LogoTechAsset';
import CampoFormulario from '../components/formulario/CampoFormulario';
import TextInput from '../components/formulario/TextInput';
import PasswordInput from '../components/formulario/PasswordInput';
import Button from '../components/ui/Button';
import AlertMessage from '../components/ui/AlertMessage';

export default function Ingresar() {
  const { iniciarSesion, autenticado } = useAuth();
  const { correoRecordado, guardarCorreo } = useCorreoRecordado();
  const [recordar, setRecordar] = useState(Boolean(correoRecordado));
  const navigate = useNavigate();
  const location = useLocation();

  const origen = location.state?.from?.pathname || RUTAS.PANEL;

  useEffect(() => {
    if (autenticado) {
      navigate(origen, { replace: true });
    }
  }, [autenticado, navigate, origen]);

  const {
    valores,
    errores,
    enviando,
    mensajeGeneral,
    setMensajeGeneral,
    cambiarValor,
    marcarTocado,
    manejarEnvio,
    setValores
  } = useFormulario({
    valoresIniciales: {
      correo: correoRecordado || '',
      contrasena: ''
    },
    validar: validarLogin,
    onSubmit: async ({ correo, contrasena }) => {
      const resultado = await iniciarSesion(correo, contrasena);
      if (resultado.ok) {
        guardarCorreo(correo, recordar);
        navigate(origen, { replace: true });
      } else {
        setMensajeGeneral(resultado.error);
      }
    }
  });

  const cargarDemo = (correoDemo, claveDemo) => {
    setValores({ correo: correoDemo, contrasena: claveDemo });
    setMensajeGeneral(null);
  };

  return (
    <div className="min-h-screen bg-fondo flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-2">
          <LogoTechAsset />
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-texto">
          Sistema de Inventario y Préstamos
        </h2>
        <p className="mt-1 text-xs text-texto-suave">
          Ingrese sus credenciales corporativas autorizadas
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-superficie py-8 px-6 shadow-xl rounded-2xl border border-borde sm:px-10">
          {mensajeGeneral && (
            <AlertMessage
              variante="peligro"
              mensaje={mensajeGeneral}
              className="mb-6"
            />
          )}

          <form onSubmit={manejarEnvio} className="space-y-5" noValidate>
            <CampoFormulario
              id="correo"
              etiqueta="Correo electrónico"
              error={errores.correo}
              obligatorio
            >
              <TextInput
                id="correo"
                name="correo"
                type="email"
                placeholder="usuario@innovatech.com"
                value={valores.correo}
                onChange={(e) => cambiarValor('correo', e.target.value)}
                onBlur={() => marcarTocado('correo')}
                error={Boolean(errores.correo)}
                disabled={enviando}
                autoComplete="email"
              />
            </CampoFormulario>

            <CampoFormulario
              id="contrasena"
              etiqueta="Contraseña"
              error={errores.contrasena}
              obligatorio
            >
              <PasswordInput
                id="contrasena"
                name="contrasena"
                placeholder="••••••••"
                value={valores.contrasena}
                onChange={(e) => cambiarValor('contrasena', e.target.value)}
                onBlur={() => marcarTocado('contrasena')}
                error={Boolean(errores.contrasena)}
                disabled={enviando}
                autoComplete="current-password"
              />
            </CampoFormulario>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={recordar}
                  onChange={(e) => setRecordar(e.target.checked)}
                  className="rounded border-borde text-primario focus:ring-anillo-foco w-4 h-4"
                />
                <span className="text-texto-suave font-medium">Recordar correo</span>
              </label>
            </div>

            <Button
              tipo="submit"
              variante="primary"
              enProceso={enviando}
              textoProceso="Iniciando sesión…"
              className="w-full h-11 text-sm font-semibold"
            >
              Iniciar sesión
            </Button>
          </form>

          {/* Accesos rápidos de demostración */}
          <div className="mt-8 pt-6 border-t border-borde">
            <span className="block text-center text-xs font-semibold text-texto-suave uppercase tracking-wider mb-3">
              Credenciales de prueba
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => cargarDemo('admin@innovatech.com', 'Admin123*')}
                className="p-2 text-center rounded-lg border border-borde hover:border-primario hover:bg-superficie-2 text-[0.6875rem] font-semibold text-texto transition-colors"
              >
                <div className="font-bold text-primario truncate">Admin</div>
                <div className="text-texto-suave/80 truncate">Completo</div>
              </button>
              <button
                type="button"
                onClick={() => cargarDemo('resp.tecnologia@innovatech.com', 'Resp123*')}
                className="p-2 text-center rounded-lg border border-borde hover:border-primario hover:bg-superficie-2 text-[0.6875rem] font-semibold text-texto transition-colors"
              >
                <div className="font-bold text-primario truncate">Resp. TI</div>
                <div className="text-texto-suave/80 truncate">Gestión</div>
              </button>
              <button
                type="button"
                onClick={() => cargarDemo('colaborador1@innovatech.com', 'Colab123*')}
                className="p-2 text-center rounded-lg border border-borde hover:border-primario hover:bg-superficie-2 text-[0.6875rem] font-semibold text-texto transition-colors"
              >
                <div className="font-bold text-primario truncate">Colaborador</div>
                <div className="text-texto-suave/80 truncate">Solicitante</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
