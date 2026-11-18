import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Detalhe } from '../screens/Detalhe';
import { FormOcorrencia } from '../screens/FormOcorrencia';
import { Sobre } from '../screens/Sobre';
import { Cadastro } from '../screens/Cadastro';
import { Login } from '../screens/Login';
import { AtualizarStatus } from '../screens/AtualizarStatus';
import { cores } from '../theme/cores';
import { CidadaoTabs } from './CidadaoTabs';
import { GestorTabs } from './GestorTabs';
import type { RotasRaiz } from './types';

const Pilha = createNativeStackNavigator<RotasRaiz>();

export function RootStack() {
  const { sessao, estado } = useAuth();

  if (estado === 'restaurando')
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-fundo">
        <ActivityIndicator color={cores.verde} />
        <Text className="font-sans text-texto">Restaurando sessão…</Text>
      </View>
    );

  return (
    <Pilha.Navigator screenOptions={{ headerShown: false }}>
      {sessao ? (
        <Pilha.Group navigationKey={String(sessao.usuarioId)}>
          <Pilha.Screen
            name="Tabs"
            component={sessao.papel === 'GESTOR' ? GestorTabs : CidadaoTabs}
          />
          <Pilha.Screen name="Detalhe" component={Detalhe} />
          {sessao.papel === 'GESTOR' ? (
            <Pilha.Screen name="AtualizarStatus" component={AtualizarStatus} />
          ) : (
            <Pilha.Screen name="FormOcorrencia" component={FormOcorrencia} />
          )}
          <Pilha.Screen name="Sobre" component={Sobre} />
        </Pilha.Group>
      ) : (
        <Pilha.Group navigationKey="publico">
          <Pilha.Screen name="Login" component={Login} />
          <Pilha.Screen name="Cadastro" component={Cadastro} />
        </Pilha.Group>
      )}
    </Pilha.Navigator>
  );
}
