import { useEffect, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Cartao } from './Cartao';
import { cores } from '../theme/cores';

export function AcordandoServidor({ login = false }: { login?: boolean }) {
  const [progresso] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animacao = Animated.loop(
      Animated.timing(progresso, { toValue: 1, duration: 1500, useNativeDriver: true }),
    );
    animacao.start();

    return () => animacao.stop();
  }, [progresso]);

  return (
    <Cartao>
      <View className="flex-row items-start gap-3">
        <View className="rounded-lg bg-verde-claro p-2">
          <Feather name="moon" size={21} color={cores.verde} />
        </View>
        <View className="flex-1">
          <Text className="font-sans-semibold text-texto">Acordando o servidor…</Text>
          <Text className="font-sans text-legenda text-texto-apoio">
            {login
              ? 'O primeiro login pode levar até 4 minutos.'
              : 'O primeiro cadastro pode levar até 90 segundos.'}{' '}
            Mantenha o app aberto.
          </Text>
        </View>
      </View>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel="Aguardando o servidor"
        className="h-1 overflow-hidden rounded-full bg-verde-claro"
      >
        <Animated.View
          className="h-1 w-full bg-verde"
          style={{
            opacity: progresso.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.12, 0.85, 0.12],
            }),
          }}
        />
      </View>
    </Cartao>
  );
}
