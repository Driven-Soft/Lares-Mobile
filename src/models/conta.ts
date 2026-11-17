export type Papel = 'CIDADAO' | 'GESTOR';
export interface LoginRequest {
  email: string;
  senha: string;
}
export interface RegistroRequest extends LoginRequest {
  nome: string;
}
export interface UsuarioMe {
  id: number;
  nome: string;
  email: string;
  papel: Papel;
}
export type RegistroResponse = UsuarioMe;
export interface Sessao {
  token: string;
  papel: Papel;
  nome: string;
  usuarioId: number;
}
