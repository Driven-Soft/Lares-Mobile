import { api } from '../services/api';
import type { LoginRequest, RegistroRequest, RegistroResponse, Sessao } from '../models';

export async function login(dados: LoginRequest) {
  const resposta = await api.post<Sessao>('/auth/login', dados, { timeout: 90_000 });

  return resposta.data;
}

export async function registrar(dados: RegistroRequest) {
  const resposta = await api.post<RegistroResponse>('/auth/registro', dados, { timeout: 90_000 });

  return resposta.data;
}

export async function acordarServidor(signal: AbortSignal) {
  await api.get('/actuator/health', { signal, timeout: 90_000 });
}
