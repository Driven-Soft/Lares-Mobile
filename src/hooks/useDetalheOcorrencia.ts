import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useOcorrencia } from './useOcorrencias';

import { limiteDaTriagem } from '../utils/ocorrencia';

export function useDetalheOcorrencia(id: number, acompanhar: boolean) {
  const focada = useIsFocused();

  const [estadoApp, definirEstadoApp] = useState(AppState.currentState);

  const [aberturaDaTela] = useState(Date.now);

  const [esgotado, esgotar] = useState(false);

  const ativa = focada && (estadoApp === null || estadoApp === 'active');

  useEffect(() => {
    const inscricao = AppState.addEventListener('change', definirEstadoApp);

    return () => inscricao.remove();
  }, []);
  const consulta = useOcorrencia(id, {
    ativa,
    aberturaDaTela: acompanhar && !esgotado ? aberturaDaTela : undefined,
  });

  const limite = limiteDaTriagem(aberturaDaTela, consulta.data?.dataAbertura);

  const aguardando = consulta.data?.status === 'RECEBIDA' && acompanhar;

  useEffect(() => {
    if (!ativa || !aguardando || esgotado) return;

    const timer = setTimeout(() => esgotar(true), Math.max(0, limite - Date.now()));

    return () => clearTimeout(timer);
  }, [ativa, aguardando, esgotado, limite]);

  return { consulta, demorando: aguardando && (esgotado || limite <= aberturaDaTela) };
}
