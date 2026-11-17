import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Botao } from '../components/Botao';
import { Cartao } from '../components/Cartao';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { EstadoErro } from '../components/Estados';
import type { RotasRaiz } from '../routes/types';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { useUsuarioMe } from '../hooks/useUsuarioMe';
import { iniciaisDoNome } from '../utils/texto';
import { mensagemDeErro } from '../services/erroApi';
import { cores } from '../theme/cores';

export function Perfil() {
  const navigation = useNavigation<NativeStackNavigationProp<RotasRaiz>>();

  const { sessao, sair } = useAuth();

  const avisar = useSnackbar();

  const consulta = useUsuarioMe();

  const nome = consulta.data?.nome ?? sessao?.nome ?? '';

  const gestor = (consulta.data?.papel ?? sessao?.papel) === 'GESTOR';

  const cor = gestor ? cores.gestor : cores.verde;

  const fundo = gestor ? cores.gestorClaro : cores.verdeClaro;

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
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
      <ScrollView contentContainerClassName="grow gap-4 p-5">
        <CabecalhoTela titulo="Perfil" />
        {consulta.isError && !consulta.data ? (
          <EstadoErro
            mensagem={mensagemDeErro(consulta.error)}
            tentarNovamente={() => void consulta.refetch()}
          />
        ) : (
          <Cartao>
            <View className="items-center gap-2 py-3">
              <View
                className="h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: fundo }}
              >
                <Text className="font-sans-bold text-3xl" style={{ color: cor }}>
                  {iniciaisDoNome(nome)}
                </Text>
              </View>
              <Text className="text-center font-sans-bold text-secao text-texto">{nome}</Text>
              {consulta.data ? (
                <Text className="text-center font-sans text-corpo text-texto-apoio">
                  {consulta.data.email}
                </Text>
              ) : (
                <View
                  accessible
                  accessibilityLabel="Carregando e-mail"
                  className="h-4 w-40 rounded-full bg-borda"
                />
              )}
              <View
                className="flex-row items-center gap-2 rounded-full px-3 py-1"
                style={{ backgroundColor: fundo }}
              >
                <Feather name={gestor ? 'briefcase' : 'home'} size={14} color={cor} />
                <Text className="font-sans-semibold text-legenda" style={{ color: cor }}>
                  {gestor ? 'Conta de gestor' : 'Conta de cidadão'}
                </Text>
              </View>
            </View>
          </Cartao>
        )}
        <Pressable
          onPress={() => navigation.navigate('Sobre')}
          accessibilityRole="button"
          className="min-h-14 flex-row items-center gap-3 rounded-xl border border-borda bg-cartao px-4"
        >
          <Feather name="info" size={20} color={cores.verde} />
          <Text className="flex-1 font-sans-semibold text-corpo text-texto">Sobre o app</Text>
          <Feather name="chevron-right" size={20} color={cores.textoApoio} />
        </Pressable>
        <View className="grow" />
        <Botao titulo="Sair" icone="log-out" variante="perigo" aoPressionar={confirmar} />
      </ScrollView>
    </SafeAreaView>
  );
}
