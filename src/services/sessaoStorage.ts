import * as SecureStore from 'expo-secure-store';
import type { Sessao } from '../models';

const chave = 'lares.sessao';

export function salvarSessao(sessao: Sessao) {
  return SecureStore.setItemAsync(chave, JSON.stringify(sessao));
}

export function apagarSessao() {
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
