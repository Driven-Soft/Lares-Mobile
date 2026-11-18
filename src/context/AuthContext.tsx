import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import type { Sessao, LoginRequest } from '../models';
import repositories from '../repositories';
import { configurarAutenticacao } from '../services/api';
import { apagarSessao, restaurarSessao, salvarSessao } from '../services/sessaoStorage';
import { queryClient } from '../config/queryClient';
import { useSnackbar } from './SnackbarContext';

const { authRepository } = repositories;

interface Autenticacao {
  sessao: Sessao | null;
  estado: 'restaurando' | 'autenticado' | 'nao-autenticado';
  entrar: (dados: LoginRequest) => Promise<void>;
  registrar: typeof authRepository.registrar;
  sair: () => Promise<void>;
}

const Contexto = createContext<Autenticacao | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [sessao, definirSessao] = useState<Sessao | null>(null);

  const [restaurando, definirRestaurando] = useState(true);

  const atual = useRef<Sessao | null>(null);

  const fila = useRef(Promise.resolve());

  const avisar = useSnackbar();

  function emSequencia(operacao: () => Promise<void>) {
    const resultado = fila.current.then(operacao);

    fila.current = resultado.catch(() => {
      /* A próxima operação poderá tentar novamente. */
    });

    return resultado;
  }

  const atualizar = useCallback((nova: Sessao | null) => {
    atual.current = nova;
    definirSessao(nova);
  }, []);

  const limpar = useCallback(async () => {
    await apagarSessao();
    atualizar(null);
    queryClient.clear();
  }, [atualizar]);

  useEffect(() => {
    let ativo = true;

    const remover = configurarAutenticacao(
      () => atual.current?.token,
      (token) =>
        emSequencia(async () => {
          if (atual.current?.token !== token) return;

          try {
            await limpar();
          } catch {
            atualizar(null);
            queryClient.clear();
            avisar({
              tipo: 'erro',
              mensagem: 'A sessão expirou. Não foi possível apagar os dados de acesso do aparelho.',
            });

            return;
          }
          avisar({ tipo: 'erro', mensagem: 'Sua sessão expirou. Entre novamente.' });
        }),
    );

    void emSequencia(async () => {
      try {
        const salva = await restaurarSessao();

        if (ativo) atualizar(salva);
      } catch {
        if (ativo) avisar({ tipo: 'erro', mensagem: 'Não foi possível restaurar a sessão.' });
      } finally {
        if (ativo) definirRestaurando(false);
      }
    });

    return () => {
      ativo = false;
      remover();
    };
  }, [avisar, atualizar, limpar]);

  function entrar(dados: LoginRequest) {
    return emSequencia(async () => {
      const nova = await authRepository.login(dados);
      await salvarSessao(nova);
      queryClient.clear();
      atualizar(nova);
    });
  }

  return (
    <Contexto.Provider
      value={{
        sessao,
        estado: restaurando ? 'restaurando' : sessao ? 'autenticado' : 'nao-autenticado',
        entrar,
        registrar: authRepository.registrar,
        sair: () => emSequencia(limpar),
      }}
    >
      {children}
    </Contexto.Provider>
  );
}

export function useAuth() {
  const auth = useContext(Contexto);

  if (!auth) throw new Error('AuthProvider ausente');

  return auth;
}
