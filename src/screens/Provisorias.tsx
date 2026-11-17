import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Botao } from '../components/Botao';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

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

export function PerfilProvisorio() {
  const { sair } = useAuth();

  const avisar = useSnackbar();

  function confirmar() {
    Alert.alert(
      'Sair da conta?',
      'Para voltar, você vai precisar entrar de novo com e-mail e senha.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            void sair().catch(() =>
              avisar({
                tipo: 'erro',
                mensagem: 'Não foi possível sair da conta. Tente novamente.',
              }),
            );
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView className="flex-1 gap-4 bg-fundo p-4">
      <CabecalhoTela titulo="Perfil" />
      <Botao titulo="Sair" variante="perigo" aoPressionar={confirmar} />
    </SafeAreaView>
  );
}
