import { isAxiosError } from 'axios';
import type { ErroApi } from '../models';

export function statusDoErro(erro: unknown) {
  return isAxiosError(erro) ? erro.response?.status : undefined;
}

export function mensagemDeErro(erro: unknown): string {
  if (!isAxiosError<ErroApi>(erro)) return 'Não foi possível concluir a operação. Tente novamente.';

  const resposta = erro.response;

  if (
    !resposta &&
    erro.config?.url === '/auth/login' &&
    (erro.code === 'ECONNABORTED' || erro.code === 'ETIMEDOUT')
  ) {
    return 'O servidor demorou para responder. Tente entrar novamente.';
  }

  if (!resposta) return 'Sem conexão com o servidor. Confira sua internet e tente de novo.';

  if (resposta.status === 401 && erro.config?.url === '/auth/login')
    return 'E-mail ou senha incorretos.';

  if (resposta.status === 403) return 'Você não tem permissão para fazer isso.';

  if (resposta.status === 404) return 'Não encontramos o que você procurou.';

  if (resposta.status >= 500)
    return 'O servidor não respondeu direito. Tente de novo em instantes.';

  return resposta.data?.mensagem || 'Não foi possível concluir a operação. Tente novamente.';
}

export function camposDoErro(erro: unknown) {
  return isAxiosError<ErroApi>(erro) ? erro.response?.data?.campos : undefined;
}

export function semRespostaDoServidor(erro: unknown) {
  return isAxiosError(erro) && !erro.response;
}
