import { create, isAxiosError } from 'axios';

export const api = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 20_000,
  transitional: { clarifyTimeoutError: true },
});

export function configurarAutenticacao(
  obterToken: () => string | undefined,
  expirar: (token: string) => Promise<void>,
) {
  const request = api.interceptors.request.use((config) => {
    const token = obterToken();

    if (token && !config.url?.startsWith('/auth/')) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  });

  const response = api.interceptors.response.use(undefined, async (erro: unknown) => {
    if (isAxiosError(erro) && erro.response?.status === 401) {
      const autorizacao = erro.config?.headers?.Authorization;

      if (
        typeof autorizacao === 'string' &&
        autorizacao.startsWith('Bearer ') &&
        !erro.config?.url?.startsWith('/auth/')
      ) {
        await expirar(autorizacao.slice(7));
      }
    }

    throw erro;
  });

  return () => {
    api.interceptors.request.eject(request);
    api.interceptors.response.eject(response);
  };
}
