import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { limiteDaTriagem } from '../utils/ocorrencia';
import { statusDoErro } from '../services/erroApi';
import { useAuth } from '../context/AuthContext';
import * as repository from '../repositories/ocorrenciaRepository';
import type { FiltroBusca, Ocorrencia, OcorrenciaRequest } from '../models';

export function useBuscarOcorrencias(filtros: FiltroBusca, ativa = true) {
  const { sessao } = useAuth();

  return useInfiniteQuery({
    queryKey: ['ocorrencias', 'busca', sessao?.usuarioId, filtros],
    enabled: !!sessao && ativa,
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) => repository.buscar(filtros, pageParam, 10, signal),
    getNextPageParam: (pagina) =>
      pagina.pagina + 1 < pagina.totalPaginas ? pagina.pagina + 1 : undefined,
    retry: false,
  });
}

export function useMinhasOcorrencias() {
  const { sessao } = useAuth();

  return useInfiniteQuery({
    queryKey: ['ocorrencias', 'minhas', sessao?.usuarioId],
    enabled: !!sessao,
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) => repository.listarMinhas(pageParam, signal),
    getNextPageParam: (pagina) =>
      pagina.pagina + 1 < pagina.totalPaginas ? pagina.pagina + 1 : undefined,
    retry: false,
  });
}

export function useOcorrencia(
  id?: number,
  { ativa = true, aberturaDaTela }: { ativa?: boolean; aberturaDaTela?: number } = {},
) {
  const { sessao } = useAuth();

  return useQuery<Ocorrencia>({
    queryKey: ['ocorrencias', 'detalhe', sessao?.usuarioId, id],
    enabled: !!sessao && id !== undefined && ativa,
    refetchInterval: (query) =>
      ativa &&
      aberturaDaTela !== undefined &&
      Date.now() < limiteDaTriagem(aberturaDaTela, query.state.data?.dataAbertura) &&
      ![401, 403, 404].includes(statusDoErro(query.state.error) ?? 0) &&
      query.state.data?.status === 'RECEBIDA'
        ? 3000
        : false,
    queryFn: ({ signal }) => {
      if (id === undefined) throw new Error('Ocorrência sem identificador.');

      return repository.buscarPorId(id, signal);
    },
    retry: false,
  });
}

function useInvalidarOcorrencias() {
  const cliente = useQueryClient();

  return () => {
    void cliente.invalidateQueries({ queryKey: ['ocorrencias'] });
  };
}

export function useExcluirOcorrencia() {
  const cliente = useQueryClient();

  const { sessao } = useAuth();

  const invalidar = useInvalidarOcorrencias();

  return useMutation({
    mutationFn: repository.excluir,
    retry: false,
    onSuccess: (_, id) => {
      cliente.removeQueries({
        queryKey: ['ocorrencias', 'detalhe', sessao?.usuarioId, id],
        exact: true,
      });
      void cliente.invalidateQueries({
        queryKey: ['ocorrencias'],
        predicate: (q) => q.queryKey[1] !== 'detalhe',
      });
    },
    onError: invalidar,
  });
}

export function useCriarOcorrencia() {
  const invalidar = useInvalidarOcorrencias();

  return useMutation({ mutationFn: repository.criar, onSuccess: invalidar });
}

export function useAtualizarOcorrencia() {
  const invalidar = useInvalidarOcorrencias();

  return useMutation({
    mutationFn: ({ id, dados }: { id: number; dados: OcorrenciaRequest }) =>
      repository.atualizar(id, dados),
    onSuccess: invalidar,
    onError: invalidar,
  });
}
