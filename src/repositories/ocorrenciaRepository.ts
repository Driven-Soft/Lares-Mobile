import { api } from '../services/api';
import type { Ocorrencia, OcorrenciaRequest, Pagina } from '../models';

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

export async function atualizar(id: number, dados: OcorrenciaRequest) {
  const { data } = await api.put<Ocorrencia>(`/ocorrencias/${id}`, dados);

  return data;
}
