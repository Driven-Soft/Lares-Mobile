import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AppState } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useOcorrencia } from './useOcorrencias';
import { limiteDaTriagem } from '../utils/ocorrencia';
import type { StatusOcorrencia } from '../models';

export function useDetalheOcorrencia(id: number, acompanhar: boolean) {
  const focada = useIsFocused();

  const cliente = useQueryClient();

  const ultimoStatus = useRef<StatusOcorrencia | undefined>(undefined);

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

  const status = consulta.data?.status;

  const aguardando = status === 'RECEBIDA' && acompanhar;

  useEffect(() => {
    if (!status) return;

    if (ultimoStatus.current === 'RECEBIDA' && status !== 'RECEBIDA') {
      void cliente.invalidateQueries({
        queryKey: ['ocorrencias'],
        predicate: (query) => query.queryKey[1] !== 'detalhe',
      });
    }

    ultimoStatus.current = status;
  }, [cliente, status]);

  useEffect(() => {
    if (!ativa || !aguardando || esgotado) return;

    const timer = setTimeout(() => esgotar(true), Math.max(0, limite - Date.now()));

    return () => clearTimeout(timer);
  }, [ativa, aguardando, esgotado, limite]);

  return { consulta, demorando: aguardando && (esgotado || limite <= aberturaDaTela) };
}
