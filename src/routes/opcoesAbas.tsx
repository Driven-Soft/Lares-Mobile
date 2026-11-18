import type { ComponentProps } from 'react';
import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { cores } from '../theme/cores';
import type { AbasCidadao, AbasGestor } from './types';

const icones: Record<keyof AbasCidadao | keyof AbasGestor, ComponentProps<typeof Feather>['name']> =
  { 'Minhas ocorrências': 'list', Bairro: 'map-pin', Perfil: 'user', Fila: 'inbox' };

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
    tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold' },
    tabBarIcon: ({ focused, color }) => (
      <View
        className={`items-center justify-center rounded-full px-3 py-1 ${focused ? 'bg-verde-claro' : ''}`}
      >
        <Feather name={icones[route.name]} color={color} size={19} />
      </View>
    ),
  };
}
