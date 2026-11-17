import { useAuth } from './useAuth';

export function usePermisos() {
  const { permisos, puede } = useAuth();
  return { permisos, puede };
}
