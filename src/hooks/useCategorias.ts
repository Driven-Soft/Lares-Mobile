import { useQuery } from '@tanstack/react-query';
import repositories from '../repositories';
import { useAuth } from '../context/AuthContext';

const { listar } = repositories.categoriaRepository;

export function useCategorias() {
  const { sessao } = useAuth();

  return useQuery({
    queryKey: ['categorias', sessao?.usuarioId],
    enabled: sessao?.papel === 'GESTOR',
    queryFn: ({ signal }) => listar(signal),
  });
}
