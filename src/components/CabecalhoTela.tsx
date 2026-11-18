import { Feather } from '@expo/vector-icons';
import { View, Text, Pressable } from 'react-native';
import { cores } from '../theme/cores';

export function CabecalhoTela({
  titulo,
  voltar,
  fechar = false,
}: {
  titulo: string;
  voltar?: () => void;
  fechar?: boolean;
}) {
  return (
    <View className="flex-row items-center gap-2">
      {voltar && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={fechar ? 'Fechar' : 'Voltar'}
          onPress={voltar}
          className="min-h-12 min-w-12 items-center justify-center"
        >
          <Feather name={fechar ? 'x' : 'arrow-left'} size={24} color={cores.texto} />
        </Pressable>
      )}
      <Text
        accessibilityRole="header"
        className="flex-shrink font-sans-bold text-titulo text-texto"
      >
        {titulo}
      </Text>
    </View>
  );
}
