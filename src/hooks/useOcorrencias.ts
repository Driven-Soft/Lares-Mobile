import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import * as repository from '../repositories/ocorrenciaRepository';
import type { OcorrenciaRequest } from '../models';

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

export function useOcorrencia(id?: number) {
  const { sessao } = useAuth();

  return useQuery({
    queryKey: ['ocorrencias', 'detalhe', sessao?.usuarioId, id],
    enabled: !!sessao && id !== undefined,
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
