import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { Snackbar, type Aviso } from '../components/Snackbar';

const Contexto = createContext<((aviso: Aviso) => void) | null>(null);

export function SnackbarProvider({ children }: PropsWithChildren) {
  const [aviso, mostrar] = useState<Aviso | null>(null);

  useEffect(() => {
    if (!aviso) return;

    const timer = setTimeout(() => mostrar(null), 4000);

    return () => clearTimeout(timer);
  }, [aviso]);

  return (
    <Contexto.Provider value={mostrar}>
      {children}
      {aviso && <Snackbar aviso={aviso} fechar={() => mostrar(null)} />}
    </Contexto.Provider>
  );
}

export function useSnackbar() {
  const mostrar = useContext(Contexto);

  if (!mostrar) throw new Error('SnackbarProvider ausente');

  return mostrar;
}
