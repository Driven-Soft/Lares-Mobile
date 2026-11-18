import { useQuery } from '@tanstack/react-query';
import { listar } from '../repositories/categoriaRepository';
import { useAuth } from '../context/AuthContext';

export function useCategorias() {
  const { sessao } = useAuth();

  return useQuery({
    queryKey: ['categorias', sessao?.usuarioId],
    enabled: sessao?.papel === 'GESTOR',
    queryFn: ({ signal }) => listar(signal),
  });
}
