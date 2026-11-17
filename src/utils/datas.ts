export function formatarData(iso: string, comHora = false) {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return '—';
  return data.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(comHora ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}
export function haQuantosDias(iso: string, agora = new Date()) {
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return '—';
  const dia = (valor: Date) => Date.UTC(valor.getFullYear(), valor.getMonth(), valor.getDate());
  const dias = Math.max(0, Math.round((dia(agora) - dia(data)) / 86400000));
  return dias === 0 ? 'hoje' : dias === 1 ? 'há 1 dia' : `há ${dias} dias`;
}
