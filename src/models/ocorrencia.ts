export type StatusOcorrencia = 'RECEBIDA' | 'TRIADA' | 'EM_ANDAMENTO' | 'RESOLVIDA';
export type Prioridade = 'BAIXA' | 'MEDIA' | 'ALTA';
export interface Categoria {
  id: number;
  codigo: string;
  nome: string;
}
export interface HistoricoStatus {
  statusAnterior: StatusOcorrencia | null;
  statusNovo: StatusOcorrencia;
  comentario: string | null;
  usuarioNome: string | null;
  dataAlteracao: string;
}
export interface OcorrenciaRequest {
  descricao: string;
  bairro: string;
  latitude?: number | null;
  longitude?: number | null;
}
export interface Ocorrencia extends OcorrenciaRequest {
  id: number;
  latitude: number | null;
  longitude: number | null;
  status: StatusOcorrencia;
  prioridade: Prioridade | null;
  prazoEstimadoDias: number | null;
  resumoIa: string | null;
  mensagemCidadao: string | null;
  categoria: Categoria | null;
  usuario: { id: number; nome: string };
  dataAbertura: string;
  dataAtualizacao: string;
  historico?: HistoricoStatus[];
}
export interface AtualizarStatusRequest {
  status: 'EM_ANDAMENTO' | 'RESOLVIDA';
  comentario?: string;
  categoriaId?: number;
}
export interface FiltroBusca {
  bairro?: string;
  status?: StatusOcorrencia;
  sort?: 'prioridade';
}
