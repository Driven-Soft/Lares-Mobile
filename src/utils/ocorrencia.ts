import type { Sessao, Ocorrencia, StatusOcorrencia } from '../models';
const etapas: StatusOcorrencia[] = ['RECEBIDA', 'TRIADA', 'EM_ANDAMENTO', 'RESOLVIDA'];
export function passoDoStatus(status: StatusOcorrencia) {
  return etapas.indexOf(status) + 1;
}
export function proximoStatus(status: StatusOcorrencia) {
  switch (status) {
    case 'RECEBIDA':
    case 'TRIADA':
      return 'EM_ANDAMENTO';
    case 'EM_ANDAMENTO':
      return 'RESOLVIDA';
    case 'RESOLVIDA':
      return null;
  }
}
export function podeEditarOuExcluir(sessao: Sessao, ocorrencia: Ocorrencia) {
  return (
    sessao.papel === 'CIDADAO' &&
    sessao.usuarioId === ocorrencia.usuario.id &&
    ['RECEBIDA', 'TRIADA'].includes(ocorrencia.status)
  );
}
