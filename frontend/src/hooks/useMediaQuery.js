import { useState, useEffect } from 'react';

export function useMediaQuery(consulta) {
  const [coincide, setCoincide] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(consulta).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const media = window.matchMedia(consulta);
    const listener = (e) => setCoincide(e.matches);

    media.addEventListener('change', listener);
    setCoincide(media.matches);

    return () => media.removeEventListener('change', listener);
  }, [consulta]);

  return coincide;
}
