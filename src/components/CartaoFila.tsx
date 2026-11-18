import { Text, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Cartao } from './Cartao';
import { Etiqueta } from './Etiqueta';
import type { Ocorrencia } from '../models';
import { haQuantosDias } from '../utils/datas';

export function CartaoFila({ ocorrencia, abrir }: { ocorrencia: Ocorrencia; abrir: () => void }) {
  const { categoria, prioridade, dataAbertura, descricao, bairro, prazoEstimadoDias } = ocorrencia;

  return (
    <Pressable accessibilityRole="button" onPress={abrir}>
      <Cartao>
        <View className="flex-row items-center gap-2">
          {categoria && prioridade && <Etiqueta prioridade={prioridade} />}
          <Text className="flex-1 font-sans-bold text-corpo text-texto">
            {categoria?.nome ?? 'Sem triagem'}
          </Text>
          <Text className="font-sans text-legenda text-texto-apoio">
            {haQuantosDias(dataAbertura)}
          </Text>
        </View>
        <Text className="font-sans text-corpo text-texto" numberOfLines={2}>
          {descricao}
        </Text>
        <View className="flex-row flex-wrap gap-3">
          <Text className="font-sans text-legenda text-texto-apoio">
            <Feather name="map-pin" /> {bairro}
          </Text>
          <Text className="font-sans text-legenda text-texto-apoio">
            <Feather name="clock" /> Prazo:{' '}
            {prazoEstimadoDias == null
              ? '—'
              : prazoEstimadoDias === 1
                ? '1 dia'
                : prazoEstimadoDias + ' dias'}
          </Text>
        </View>
      </Cartao>
    </Pressable>
  );
}
