import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TelaProvisoria, PerfilProvisorio } from '../screens/Provisorias';
import type { AbasGestor } from './types';
import { opcoesAbas } from './opcoesAbas';

const Abas = createBottomTabNavigator<AbasGestor>();

export function GestorTabs() {
  return (
    <Abas.Navigator initialRouteName="Fila" screenOptions={opcoesAbas}>
      <Abas.Screen name="Fila" component={TelaProvisoria} />
      <Abas.Screen name="Perfil" component={PerfilProvisorio} />
    </Abas.Navigator>
  );
}
