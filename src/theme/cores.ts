import type { Prioridade, StatusOcorrencia } from '../models';

export const cores = {
  verde: '#1F6B4F',
  gestor: '#1E46B4',
  gestorClaro: '#E4ECFC',
  verdeClaro: '#E3F1EA',
  texto: '#18211D',
  textoApoio: '#56615B',
  fundo: '#F6F7F5',
  cartao: '#FFFFFF',
  borda: '#DDE2DE',
  erro: '#B42318',
};

export const STATUS: Record<StatusOcorrencia, { rotulo: string; fundo: string; texto: string }> = {
  RECEBIDA: { rotulo: 'Recebida', fundo: '#EEF0EF', texto: '#3D4642' },
  TRIADA: { rotulo: 'Triada', fundo: '#E4ECFC', texto: '#1E46B4' },
  EM_ANDAMENTO: { rotulo: 'Em andamento', fundo: '#FDF0D5', texto: '#8A4B00' },
  RESOLVIDA: { rotulo: 'Resolvida', fundo: '#DDF2E5', texto: '#17663A' },
};

export const PRIORIDADE: Record<Prioridade, { rotulo: string; fundo: string; texto: string }> = {
  ALTA: { rotulo: 'Alta', fundo: '#B42318', texto: '#FFFFFF' },
  MEDIA: { rotulo: 'Média', fundo: '#F4B740', texto: '#3D2600' },
  BAIXA: { rotulo: 'Baixa', fundo: '#E6EAF0', texto: '#344054' },
};
