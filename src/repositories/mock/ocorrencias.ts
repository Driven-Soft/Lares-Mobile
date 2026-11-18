import { AxiosError } from 'axios';
import exemplos from './detalhe-ocorrencias.json';
import type {
  AtualizarStatusRequest,
  Categoria,
  FiltroBusca,
  Ocorrencia,
  OcorrenciaRequest,
  Pagina,
} from '../../models';
import { proximoStatus } from '../../utils/ocorrencia';
import { dataDaApi } from '../../utils/datas';
import { buscarMe, falhar } from './contas';

const recebida = exemplos.recebidaSemTriagem as Ocorrencia;

const triada = exemplos.triadaSemTextosEPrazo as Ocorrencia;

const iluminacao = exemplos.triadaSemTextosEPrazo.categoria;

const categorias: Categoria[] = [
  iluminacao,
  { id: 1, codigo: 'BURACO', nome: 'Buraco na via' },
  { id: 3, codigo: 'OUTROS', nome: 'Outros' },
];

export const categoriaRepository = { listar: async () => categorias };

const exemplosIniciais: Ocorrencia[] = [
  { ...recebida, descricao: 'Teste: iluminação sem triagem permanente.' },
  { ...triada, id: 2, descricao: 'Teste: triagem sem textos da IA.', prazoEstimadoDias: 5 },
  {
    ...triada,
    id: 3,
    descricao: 'Teste: iluminação sem prazo estimado.',
    resumoIa: 'Solicitada vistoria da iluminação.',
    mensagemCidadao: 'Uma equipe avaliará a iluminação.',
  },
  { ...recebida, id: 4, descricao: 'Teste: falha de rede na primeira abertura do detalhe.' },
];

let proximoId = 5;

// A ocorrência permanente já ultrapassou três minutos, seja qual for a data do aparelho.
const deslocamento = Date.now() - 240_000 - dataDaApi(recebida.dataAbertura).getTime();

function dataDoCenario(data: string) {
  return new Date(dataDaApi(data).getTime() + deslocamento).toISOString();
}

const registros: Ocorrencia[] = exemplosIniciais.map((item) => ({
  ...item,
  dataAbertura: dataDoCenario(item.dataAbertura),
  dataAtualizacao: dataDoCenario(item.dataAtualizacao),
  historico: item.historico?.map((evento) => ({
    ...evento,
    dataAlteracao: dataDoCenario(evento.dataAlteracao),
  })),
}));

let falhaPendente = true;

const pendentes = new Map<number, number>();

function copiar(item: Ocorrencia): Ocorrencia {
  return { ...item, historico: item.historico?.map((evento) => ({ ...evento })) };
}

function classificarPendentes() {
  for (const [id, instante] of pendentes) {
    if (Date.now() < instante) continue;

    pendentes.delete(id);
    const item = registros.find((r) => r.id === id);

    if (!item || item.status !== 'RECEBIDA') continue;

    const data = new Date(instante).toISOString();

    Object.assign(item, {
      status: 'TRIADA',
      categoria: iluminacao,
      prioridade: 'ALTA',
      prazoEstimadoDias: 5,
      resumoIa: 'Verificar o relato no bairro informado.',
      mensagemCidadao: 'Seu relato foi encaminhado para vistoria.',
      dataAtualizacao: data,
    });
    item.historico?.push({
      statusAnterior: 'RECEBIDA',
      statusNovo: 'TRIADA',
      usuarioNome: null,
      comentario: null,
      dataAlteracao: data,
    });
  }
}

function obter(id: number) {
  classificarPendentes();
  const item = registros.find((r) => r.id === id);

  if (!item) falhar(404, 'Esta ocorrência não existe mais.');

  return item;
}

async function buscarPorId(id: number) {
  await buscarMe();

  if (id === 4 && falhaPendente) {
    falhaPendente = false;
    throw new AxiosError('Sem conexão com o servidor', 'ERR_NETWORK');
  }

  return copiar(obter(id));
}

function pagina(itens: Ocorrencia[], page: number, size: number): Pagina<Ocorrencia> {
  return {
    itens: itens.slice(page * size, (page + 1) * size).map(copiar),
    pagina: page,
    tamanho: size,
    totalItens: itens.length,
    totalPaginas: Math.ceil(itens.length / size),
  };
}

async function listarMinhas(page: number) {
  const usuario = await buscarMe();
  classificarPendentes();

  return pagina(
    registros.filter((r) => r.usuario.id === usuario.id),
    page,
    10,
  );
}

async function buscar(filtros: FiltroBusca, page: number, size: number) {
  await buscarMe();
  classificarPendentes();
  const itens = registros.filter(
    (r) =>
      (!filtros.status || r.status === filtros.status) &&
      (!filtros.bairro || r.bairro.toLowerCase() === filtros.bairro.toLowerCase()),
  );

  const ordem = { ALTA: 0, MEDIA: 1, BAIXA: 2 };

  const peso = (r: Ocorrencia) => (r.prioridade ? ordem[r.prioridade] : 3);

  itens.sort(
    filtros.sort === 'prioridade'
      ? (a, b) => peso(a) - peso(b) || a.dataAbertura.localeCompare(b.dataAbertura)
      : (a, b) => b.dataAbertura.localeCompare(a.dataAbertura),
  );

  return pagina(itens, page, size);
}

async function criar(dados: OcorrenciaRequest) {
  const usuario = await buscarMe();

  if (usuario.papel !== 'CIDADAO') falhar(403, 'Apenas cidadãos podem registrar.');

  const data = new Date().toISOString();

  const item: Ocorrencia = {
    ...recebida,
    ...dados,
    latitude: dados.latitude ?? null,
    longitude: dados.longitude ?? null,
    id: proximoId++,
    usuario: { id: usuario.id, nome: usuario.nome },
    dataAbertura: data,
    dataAtualizacao: data,
    historico: [
      {
        statusAnterior: null,
        statusNovo: 'RECEBIDA',
        usuarioNome: usuario.nome,
        comentario: null,
        dataAlteracao: data,
      },
    ],
  };
  registros.push(item);
  pendentes.set(item.id, Date.now() + 5000);

  return copiar(item);
}

function editavel(id: number, usuario: Awaited<ReturnType<typeof buscarMe>>) {
  const item = obter(id);

  if (usuario.papel !== 'CIDADAO' || item.usuario.id !== usuario.id)
    falhar(403, 'Somente o autor pode alterar esta ocorrência.');

  if (item.status !== 'RECEBIDA' && item.status !== 'TRIADA')
    falhar(409, 'O atendimento já começou.');

  return item;
}

async function atualizar(id: number, dados: OcorrenciaRequest) {
  const item = editavel(id, await buscarMe());
  Object.assign(item, dados, { dataAtualizacao: new Date().toISOString() });

  return copiar(item);
}

async function excluir(id: number) {
  const item = editavel(id, await buscarMe());
  registros.splice(registros.indexOf(item), 1);
  pendentes.delete(id);
}

async function atualizarStatus(id: number, dados: AtualizarStatusRequest) {
  const usuario = await buscarMe();

  if (usuario.papel !== 'GESTOR') falhar(403, 'Somente gestores podem atualizar o status.');

  const item = obter(id);

  if (dados.status !== proximoStatus(item.status))
    falhar(409, 'O status desta ocorrência mudou. Confira o detalhe.');

  const categoria =
    dados.categoriaId === undefined
      ? item.categoria
      : categorias.find((c) => c.id === dados.categoriaId);

  if (!categoria) falhar(400, 'Escolha uma categoria.');

  const data = new Date().toISOString();

  item.historico?.push({
    statusAnterior: item.status,
    statusNovo: dados.status,
    usuarioNome: usuario.nome,
    comentario: dados.comentario ?? null,
    dataAlteracao: data,
  });
  Object.assign(item, { categoria, status: dados.status, dataAtualizacao: data });

  return copiar(item);
}

export const ocorrenciaRepository = {
  buscarPorId,
  listarMinhas,
  buscar,
  criar,
  atualizar,
  excluir,
  atualizarStatus,
};
