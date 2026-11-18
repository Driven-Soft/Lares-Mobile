import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Perfil } from '../screens/Perfil';
import { Fila } from '../screens/Fila';
import type { AbasGestor } from './types';
import { opcoesAbas } from './opcoesAbas';

const Abas = createBottomTabNavigator<AbasGestor>();

export function GestorTabs() {
  return (
    <Abas.Navigator initialRouteName="Fila" screenOptions={opcoesAbas}>
      <Abas.Screen name="Fila" component={Fila} />
      <Abas.Screen name="Perfil" component={Perfil} />
    </Abas.Navigator>
  );
}
