import Constants from 'expo-constants';
import { Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { Cartao } from '../components/Cartao';
import { Logo } from '../components/Logo';
import type { RotasRaiz } from '../routes/types';
import { cores } from '../theme/cores';

const equipe = [
  'Felipe Bezerra Beatrici',
  'Henrique Cunha Torres',
  'Lucas da Silva Lima',
  'Max Hayashi Batista',
  'Yasmin Nathalin Miranda dos Santos',
];

export function Sobre({ navigation }: NativeStackScreenProps<RotasRaiz, 'Sobre'>) {
  const config = Constants.expoConfig;

  const hash: unknown = config?.extra?.commitHash;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerClassName="gap-4 p-5">
        <CabecalhoTela titulo="Sobre o app" voltar={navigation.goBack} />
        <View className="items-center gap-1">
          <Logo mostrarNome={false} />
          <Text className="font-sans-bold text-3xl text-texto">lares</Text>
          <Text className="font-sans text-legenda text-texto-apoio">
            Versão {config?.version ?? '1.0.0'}
          </Text>
        </View>
        <View className="flex-row items-center gap-3 rounded-xl bg-verde-claro p-4">
          <View className="rounded-lg bg-cartao p-3">
            <Feather name="git-commit" size={22} color={cores.verde} />
          </View>
          <View className="flex-1">
            <Text className="font-sans-semibold text-legenda text-verde">Commit desta versão</Text>
            <Text
              selectable
              className="text-secao text-texto"
              style={{ fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }}
            >
              {typeof hash === 'string' ? hash : 'indisponivel'}
            </Text>
          </View>
        </View>
        <Text className="text-center font-sans text-corpo text-texto-apoio">
          O Lares liga os moradores à prefeitura: você relata o problema da rua, a IA organiza e a
          gestão resolve.
        </Text>
        <View className="self-center rounded-full border border-borda bg-cartao px-3 py-1">
          <Text className="font-sans-semibold text-legenda text-texto">Tema CitizenTech</Text>
        </View>
        <Cartao>
          <Text className="font-sans-semibold text-legenda tracking-wide text-texto-apoio">
            EQUIPE DRIVEN SOFT
          </Text>
          <View className="gap-1">
            {equipe.map((nome) => (
              <Text key={nome} className="font-sans text-corpo text-texto">
                {nome}
              </Text>
            ))}
          </View>
        </Cartao>
      </ScrollView>
    </SafeAreaView>
  );
}
