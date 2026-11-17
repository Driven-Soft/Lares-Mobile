import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { buscarMe } from '../repositories/usuarioRepository';

export function useUsuarioMe() {
  const { sessao } = useAuth();

  return useQuery({
    queryKey: ['usuario', 'me', sessao?.usuarioId],
    queryFn: () => buscarMe(),
    enabled: !!sessao,
    retry: false,
  });
}
