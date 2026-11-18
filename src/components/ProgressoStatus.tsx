import { Text, View } from 'react-native';
import type { StatusOcorrencia } from '../models';
import { STATUS, cores } from '../theme/cores';
import { passoDoStatus } from '../utils/ocorrencia';
import { Cartao } from './Cartao';
import { Etiqueta } from './Etiqueta';

export function ProgressoStatus({ status }: { status: StatusOcorrencia }) {
  const passo = passoDoStatus(status);

  return (
    <Cartao>
      <View className="flex-row items-center justify-between gap-2">
        <Etiqueta status={status} />
        <Text className="font-sans text-legenda text-texto-apoio">Passo {passo} de 4</Text>
      </View>
      <View className="flex-row gap-1">
        {[1, 2, 3, 4].map((n) => (
          <View
            key={n}
            className="h-1.5 flex-1 rounded-full"
            style={{ backgroundColor: n <= passo ? STATUS[status].texto : cores.borda }}
          />
        ))}
      </View>
    </Cartao>
  );
}
