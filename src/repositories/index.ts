import * as authRepository from './authRepository';
import * as ocorrenciaRepository from './ocorrenciaRepository';
import * as usuarioRepository from './usuarioRepository';
import * as categoriaRepository from './categoriaRepository';
import { usarMock } from '../config/mock';

const reais = { authRepository, ocorrenciaRepository, usuarioRepository, categoriaRepository };

let repositories: typeof reais = reais;

if (__DEV__ && usarMock) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- O Metro elimina este carregamento no bundle de produção.
  repositories = require('./mock') as typeof import('./mock');
}

export default repositories;
