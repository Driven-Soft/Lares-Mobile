import { ScrollView, View } from 'react-native';
import { Chip } from './Chip';

export function FiltrosStatus<T extends string>({
  opcoes,
  valor,
  selecionar,
}: {
  opcoes: readonly T[];
  valor: T;
  selecionar: (opcao: T) => void;
}) {
  return (
    <View>
      <ScrollView horizontal keyboardShouldPersistTaps="handled" contentContainerClassName="gap-2">
        {opcoes.map((opcao) => (
          <Chip
            key={opcao}
            rotulo={opcao}
            selecionado={valor === opcao}
            aoPressionar={() => selecionar(opcao)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
