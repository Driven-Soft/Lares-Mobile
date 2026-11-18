import { Pressable, Text } from 'react-native';

export function Chip({
  rotulo,
  selecionado,
  aoPressionar,
}: {
  rotulo: string;
  selecionado: boolean;
  aoPressionar: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: selecionado }}
      onPress={aoPressionar}
      className={`min-h-toque min-w-toque justify-center rounded-full border px-4 active:opacity-80 ${selecionado ? 'border-verde bg-verde' : 'border-borda bg-cartao'}`}
    >
      <Text
        className={`font-sans-semibold text-legenda ${selecionado ? 'text-cartao' : 'text-texto'}`}
      >
        {rotulo}
      </Text>
    </Pressable>
  );
}
