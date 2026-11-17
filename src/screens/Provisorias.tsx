import { SafeAreaView } from 'react-native-safe-area-context';
import { CabecalhoTela } from '../components/CabecalhoTela';

const titulos: Record<string, string> = {
  Detalhe: 'Ocorrência',
  FormOcorrencia: 'Nova ocorrência',
  AtualizarStatus: 'Atualizar status',
  Sobre: 'Sobre o app',
};

export function TelaProvisoria({ route }: { route: { name: string } }) {
  return (
    <SafeAreaView className="flex-1 bg-fundo p-4">
      <CabecalhoTela titulo={titulos[route.name] ?? route.name} />
    </SafeAreaView>
  );
}
