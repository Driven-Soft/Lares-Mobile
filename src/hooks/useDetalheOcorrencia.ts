import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useOcorrencia } from './useOcorrencias';

const duracaoDaTriagem = 180_000;

export function useDetalheOcorrencia(id: number, acompanhar: boolean) {
  const focada = useIsFocused();

  const [estadoApp, definirEstadoApp] = useState(AppState.currentState);

  const [limite] = useState(() => Date.now() + duracaoDaTriagem);

  const [esgotado, esgotar] = useState(false);

  const ativa = focada && (estadoApp === null || estadoApp === 'active');

  useEffect(() => {
    const inscricao = AppState.addEventListener('change', definirEstadoApp);

    return () => inscricao.remove();
  }, []);
  const consulta = useOcorrencia(id, {
    ativa,
    limite: acompanhar && !esgotado ? limite : undefined,
  });

  const aguardando = consulta.data?.status === 'RECEBIDA' && acompanhar;

  useEffect(() => {
    if (!ativa || !aguardando || esgotado) return;

    const timer = setTimeout(() => esgotar(true), Math.max(0, limite - Date.now()));

    return () => clearTimeout(timer);
  }, [ativa, aguardando, esgotado, limite]);

  return { consulta, demorando: aguardando && esgotado };
}
