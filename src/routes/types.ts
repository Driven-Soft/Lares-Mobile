export type RotasRaiz = {
  Login: undefined;
  Cadastro: undefined;
  Tabs: undefined;
  Detalhe: { id: number };
  FormOcorrencia: { id?: number } | undefined;
  AtualizarStatus: { id: number };
  Sobre: undefined;
};

export type AbasCidadao = { 'Minhas ocorrências': undefined; Bairro: undefined; Perfil: undefined };

export type AbasGestor = { Fila: undefined; Perfil: undefined };
