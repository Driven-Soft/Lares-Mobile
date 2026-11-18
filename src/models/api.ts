export interface Pagina<T> {
  itens: T[];
  pagina: number;
  tamanho: number;
  totalItens: number;
  totalPaginas: number;
}

export interface ErroApi {
  status: number;
  erro: string;
  mensagem: string;
  campos?: Record<string, string>;
}
