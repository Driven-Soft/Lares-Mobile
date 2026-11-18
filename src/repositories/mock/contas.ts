import { AxiosError, AxiosHeaders } from 'axios';
import type { LoginRequest, RegistroRequest, Sessao, UsuarioMe } from '../../models';
import { restaurarSessao } from '../../services/sessaoStorage';

export function falhar(status: number, mensagem: string, url?: string): never {
  const config = { headers: new AxiosHeaders(), url };
  throw new AxiosError(mensagem, undefined, config, undefined, {
    status,
    statusText: mensagem,
    data: { mensagem },
    headers: {},
    config,
  });
}

const contas: { perfil: UsuarioMe; senha: string }[] = [
  {
    perfil: { id: 10, nome: 'Moradora de teste', email: 'cidadao@lares.test', papel: 'CIDADAO' },
    senha: 'LaresTeste7',
  },
  {
    perfil: { id: 11, nome: 'Gestor de teste', email: 'gestor@lares.test', papel: 'GESTOR' },
    senha: 'LaresTeste7',
  },
];

async function login(dados: LoginRequest): Promise<Sessao> {
  const conta = contas.find(
    (c) => c.perfil.email === dados.email.toLowerCase() && c.senha === dados.senha,
  );

  if (!conta) falhar(401, 'E-mail ou senha incorretos.', '/auth/login');

  const { id: usuarioId, nome, papel } = conta.perfil;

  return { usuarioId, nome, papel, token: 'sessao-local-' + usuarioId };
}

async function registrar({ nome, email, senha }: RegistroRequest) {
  const endereco = email.toLowerCase();

  if (contas.some((c) => c.perfil.email === endereco)) falhar(409, 'Este e-mail já tem conta.');

  const perfil: UsuarioMe = { id: 10 + contas.length, nome, email: endereco, papel: 'CIDADAO' };
  contas.push({ perfil, senha });

  return perfil;
}

export async function buscarMe() {
  const sessao = await restaurarSessao();

  const conta = contas.find((c) => c.perfil.id === sessao?.usuarioId);

  if (!conta) falhar(401, 'Sua sessão expirou.');

  return conta.perfil;
}

export const authRepository = { login, registrar, acordarServidor: async () => {} };

export const usuarioRepository = { buscarMe };
