import { useEffect } from 'react';
import { acordarServidor } from '../repositories/authRepository';

export function useAcordarServidor() {
  useEffect(() => {
    const controle = new AbortController();
    // Inicia o despertar durante o preenchimento, sem bloquear o envio do formulário.
    void acordarServidor(controle.signal).catch(() => {});

    return () => controle.abort();
  }, []);
}
