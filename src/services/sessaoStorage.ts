import * as SecureStore from 'expo-secure-store';
import type { Sessao } from '../models';
import { usarMock } from '../config/mock';

let sessaoDeTeste: Sessao | null = null;

const chave = 'lares.sessao';

export async function salvarSessao(sessao: Sessao) {
  if (usarMock) {
    sessaoDeTeste = sessao;

    return;
  }

  return SecureStore.setItemAsync(chave, JSON.stringify(sessao));
}

export async function apagarSessao() {
  if (usarMock) {
    sessaoDeTeste = null;

    return;
  }

  return SecureStore.deleteItemAsync(chave);
}

function sessaoValida(dados: unknown): dados is Sessao {
  if (!dados || typeof dados !== 'object') return false;

  return (
    'token' in dados &&
    typeof dados.token === 'string' &&
    dados.token.length > 0 &&
    'usuarioId' in dados &&
    typeof dados.usuarioId === 'number' &&
    'nome' in dados &&
    typeof dados.nome === 'string' &&
    'papel' in dados &&
    (dados.papel === 'CIDADAO' || dados.papel === 'GESTOR')
  );
}

export async function restaurarSessao(): Promise<Sessao | null> {
  if (usarMock) return sessaoDeTeste;

  const texto = await SecureStore.getItemAsync(chave);

  if (!texto) return null;

  let dados: unknown;
  try {
    dados = JSON.parse(texto);
  } catch {
    dados = null;
  }

  if (sessaoValida(dados)) return dados;

  await apagarSessao();

  return null;
}
