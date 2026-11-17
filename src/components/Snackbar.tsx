import { Feather } from '@expo/vector-icons';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cores } from '../theme/cores';

export interface Aviso {
  mensagem: string;
  tipo: 'sucesso' | 'erro';
  tentarNovamente?: () => void;
}

export function Snackbar({ aviso, fechar }: { aviso: Aviso; fechar: () => void }) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      accessibilityLiveRegion="polite"
      className="absolute left-4 right-4 flex-row items-center gap-3 rounded-xl bg-texto px-4 py-3"
      style={{ bottom: bottom + 72, elevation: 8 }}
    >
      <Feather
        name={aviso.tipo === 'sucesso' ? 'check' : 'alert-circle'}
        size={20}
        color={cores.verdeClaro}
      />
      <Text className="flex-1 font-sans text-legenda text-cartao">{aviso.mensagem}</Text>
      {aviso.tentarNovamente && (
        <Pressable
          accessibilityRole="button"
          className="min-h-12 justify-center"
          onPress={() => {
            fechar();
            aviso.tentarNovamente?.();
          }}
        >
          <Text className="font-sans-semibold text-legenda text-verde-claro">Tentar de novo</Text>
        </Pressable>
      )}
    </View>
  );
}
