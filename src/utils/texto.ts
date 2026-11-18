export function emailValido(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function senhaValida(senha: string) {
  return senha.length >= 8;
}

export function iniciaisDoNome(nome: string) {
  const partes = nome.trim().split(/\s+/);

  return (
    (partes[0][0] ?? '') + (partes.length > 1 ? partes[partes.length - 1][0] : '')
  ).toLocaleUpperCase('pt-BR');
}
