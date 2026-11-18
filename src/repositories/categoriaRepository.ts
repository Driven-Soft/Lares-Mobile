import { api } from '../services/api';
import type { Categoria } from '../models';

export async function listar(signal?: AbortSignal) {
  const { data } = await api.get<Categoria[]>('/categorias', { signal });

  return data;
}
