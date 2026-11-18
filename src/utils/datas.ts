// A API Java envia LocalDateTime em UTC, com até nove casas na fração de segundo.
export function dataDaApi(iso: string) {
  const normalizada = iso.replace(/(\.\d{3})\d+/, '$1');

  const semFuso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(normalizada);

  return new Date(semFuso ? normalizada + 'Z' : normalizada);
}

export function formatarData(iso: string, comHora = false) {
  const data = dataDaApi(iso);

  if (Number.isNaN(data.getTime())) return '—';

  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(comHora ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

export function haQuantosDias(iso: string, agora = new Date()) {
  const data = dataDaApi(iso);

  if (Number.isNaN(data.getTime())) return '—';

  const dia = (valor: Date) => Date.UTC(valor.getFullYear(), valor.getMonth(), valor.getDate());

  const dias = Math.max(0, Math.round((dia(agora) - dia(data)) / 86400000));

  return dias === 0 ? 'hoje' : dias === 1 ? 'há 1 dia' : `há ${dias} dias`;
}
