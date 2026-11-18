import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MinhasOcorrencias } from '../screens/MinhasOcorrencias';
import { Perfil } from '../screens/Perfil';
import { TelaProvisoria } from '../screens/Provisorias';
import type { AbasCidadao } from './types';
import { opcoesAbas } from './opcoesAbas';

const Abas = createBottomTabNavigator<AbasCidadao>();

export function CidadaoTabs() {
  return (
    <Abas.Navigator initialRouteName="Minhas ocorrências" screenOptions={opcoesAbas}>
      <Abas.Screen name="Minhas ocorrências" component={MinhasOcorrencias} />
      <Abas.Screen name="Bairro" component={TelaProvisoria} />
      <Abas.Screen name="Perfil" component={Perfil} />
    </Abas.Navigator>
  );
}
