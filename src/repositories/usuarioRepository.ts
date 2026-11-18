import { api } from '../services/api';
import type { UsuarioMe } from '../models';

export async function buscarMe() {
  const resposta = await api.get<UsuarioMe>('/usuarios/me');

  return resposta.data;
}
