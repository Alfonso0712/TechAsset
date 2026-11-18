export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        fondo: 'var(--fondo)',
        superficie: 'var(--superficie)',
        'superficie-2': 'var(--superficie-2)',
        borde: 'var(--borde)',
        'borde-control': 'var(--borde-control)',
        texto: 'var(--texto)',
        'texto-suave': 'var(--texto-suave)',
        primario: 'var(--primario)',
        'primario-hover': 'var(--primario-hover)',
        'primario-enlace': 'var(--primario-enlace)',
        'primario-suave': 'var(--primario-suave)',
        'sobre-primario': 'var(--sobre-primario)',
        acento: 'var(--acento)',
        'acento-sobre-oscuro': 'var(--acento-sobre-oscuro)',
        'lateral-fondo': 'var(--lateral-fondo)',
        'lateral-texto': 'var(--lateral-texto)',
        'lateral-activo-fondo': 'var(--lateral-activo-fondo)',
        'lateral-hover': 'var(--lateral-hover)',
        'anillo-foco': 'var(--anillo-foco)',

        'exito-texto': 'var(--exito-texto)',
        'exito-borde': 'var(--exito-borde)',
        'exito-fondo': 'var(--exito-fondo)',
        'info-texto': 'var(--info-texto)',
        'info-borde': 'var(--info-borde)',
        'info-fondo': 'var(--info-fondo)',
        'advertencia-texto': 'var(--advertencia-texto)',
        'advertencia-borde': 'var(--advertencia-borde)',
        'advertencia-fondo': 'var(--advertencia-fondo)',
        'peligro-texto': 'var(--peligro-texto)',
        'peligro-fondo': 'var(--peligro-fondo)',

        'error-texto': 'var(--error-texto)',
        'error-borde': 'var(--error-borde)',
        'error-fondo': 'var(--error-fondo)',
        'error-banner-texto': 'var(--error-banner-texto)',

        'disponible-texto': 'var(--disponible-texto)',
        'disponible-fondo': 'var(--disponible-fondo)',
        'prestado-texto': 'var(--prestado-texto)',
        'prestado-fondo': 'var(--prestado-fondo)',
        'mantenimiento-texto': 'var(--mantenimiento-texto)',
        'mantenimiento-fondo': 'var(--mantenimiento-fondo)',
        'baja-texto': 'var(--baja-texto)',
        'baja-fondo': 'var(--baja-fondo)',
        'pendiente-texto': 'var(--pendiente-texto)',
        'pendiente-fondo': 'var(--pendiente-fondo)',
        'activo-texto': 'var(--activo-texto)',
        'activo-fondo': 'var(--activo-fondo)',
        'devuelto-texto': 'var(--devuelto-texto)',
        'devuelto-fondo': 'var(--devuelto-fondo)',
        'rechazado-texto': 'var(--rechazado-texto)',
        'rechazado-fondo': 'var(--rechazado-fondo)',
        'rechazada-texto': 'var(--rechazada-texto)',
        'rechazada-fondo': 'var(--rechazada-fondo)',
        'aprobada-texto': 'var(--aprobada-texto)',
        'aprobada-fondo': 'var(--aprobada-fondo)',
        'cancelada-texto': 'var(--cancelada-texto)',
        'cancelada-fondo': 'var(--cancelada-fondo)'
      },
      fontFamily: {
        sans: ['"Montserrat Variable"', '"Segoe UI"', 'system-ui', 'Arial', 'sans-serif']
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
        pill: 'var(--radius-pill)',
        control: 'var(--radio-control)',
        tarjeta: 'var(--radio-tarjeta)'
      },
      minHeight: {
        control: 'var(--alto-control)'
      },
      minWidth: {
        control: 'var(--alto-control)'
      },
      height: {
        control: 'var(--alto-control)'
      }
    }
  },
  plugins: []
};
