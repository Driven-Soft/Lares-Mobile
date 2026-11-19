import type { ComponentProps } from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { cores } from '../theme/cores';
import type { AbasCidadao, AbasGestor } from './types';

const icones: Record<keyof AbasCidadao | keyof AbasGestor, ComponentProps<typeof Feather>['name']> =
  { 'Minhas ocorrências': 'list', Bairro: 'map-pin', Perfil: 'user', Fila: 'inbox' };

const estilos = StyleSheet.create({
  espacoDoIcone: { width: 44, height: 26 },
  indicador: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },
  selecionado: { backgroundColor: cores.verdeClaro },
});

export function opcoesAbas({
  route,
}: {
  route: { name: keyof typeof icones };
}): BottomTabNavigationOptions {
  return {
    headerShown: false,
    tabBarAccessibilityLabel: route.name,
    tabBarActiveTintColor: cores.verde,
    tabBarInactiveTintColor: cores.textoApoio,
    tabBarIconStyle: estilos.espacoDoIcone,
    tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold' },
    tabBarIcon: ({ focused, color }) => (
      <View style={[estilos.indicador, focused && estilos.selecionado]}>
        <Feather name={icones[route.name]} color={color} size={20} allowFontScaling={false} />
      </View>
    ),
  };
}
