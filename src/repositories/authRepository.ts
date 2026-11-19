import { api } from '../services/api';
import type { LoginRequest, RegistroRequest, RegistroResponse, Sessao } from '../models';
import { statusDoErro } from '../services/erroApi';

const tempoParaAcordar = 4 * 60_000;

export async function login(dados: LoginRequest) {
  const limite = Date.now() + tempoParaAcordar;

  for (;;) {
    try {
      const resposta = await api.post<Sessao>('/auth/login', dados, {
        timeout: Math.max(1, limite - Date.now()),
      });

      return resposta.data;
    } catch (erro) {
      if (![502, 503, 504].includes(statusDoErro(erro) ?? 0) || limite - Date.now() <= 10_000)
        throw erro;

      await new Promise<void>((resolver) => setTimeout(resolver, 10_000));

      if (Date.now() >= limite) throw erro;
    }
  }
}

export async function registrar(dados: RegistroRequest) {
  const resposta = await api.post<RegistroResponse>('/auth/registro', dados, { timeout: 90_000 });

  return resposta.data;
}

export async function acordarServidor(signal: AbortSignal) {
  await api.get('/actuator/health', { signal, timeout: tempoParaAcordar });
}
