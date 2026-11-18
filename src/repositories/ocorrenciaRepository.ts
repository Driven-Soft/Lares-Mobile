import { api } from '../services/api';
import type {
  AtualizarStatusRequest,
  FiltroBusca,
  Ocorrencia,
  OcorrenciaRequest,
  Pagina,
} from '../models';

export async function atualizarStatus(id: number, dados: AtualizarStatusRequest) {
  const { data } = await api.patch<Ocorrencia>(`/ocorrencias/${id}/status`, dados);

  return data;
}

export async function buscar(
  filtros: FiltroBusca,
  page: number,
  size: number,
  signal?: AbortSignal,
) {
  const { data } = await api.get<Pagina<Ocorrencia>>('/ocorrencias', {
    params: { ...filtros, page, size },
    signal,
  });

  return data;
}

export async function listarMinhas(page: number, signal?: AbortSignal) {
  const { data } = await api.get<Pagina<Ocorrencia>>('/ocorrencias/minhas', {
    params: { page, size: 10 },
    signal,
  });

  return data;
}

export async function buscarPorId(id: number, signal?: AbortSignal) {
  const { data } = await api.get<Ocorrencia>(`/ocorrencias/${id}`, { signal });

  return data;
}

export async function criar(dados: OcorrenciaRequest) {
  const { data } = await api.post<Ocorrencia>('/ocorrencias', dados);

  return data;
}

export async function excluir(id: number) {
  await api.delete<void>(`/ocorrencias/${id}`);
}

export async function atualizar(id: number, dados: OcorrenciaRequest) {
  const { data } = await api.put<Ocorrencia>(`/ocorrencias/${id}`, dados);

  return data;
}
