import { Feather } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { cores } from '../theme/cores';

export function Logo({
  tamanho = 64,
  mostrarNome = true,
}: {
  tamanho?: number;
  mostrarNome?: boolean;
}) {
  return (
    <View accessible accessibilityLabel="Lares" className="flex-row items-center gap-3">
      <View
        className="items-center justify-center bg-verde"
        style={{ width: tamanho, height: tamanho, borderRadius: tamanho / 4 }}
      >
        <Feather name="home" size={tamanho * 0.6} color={cores.cartao} />
      </View>
      {mostrarNome && (
        <Text className="font-sans-bold text-texto" style={{ fontSize: tamanho * 0.7 }}>
          lares
        </Text>
      )}
    </View>
  );
}
