import { Text, View } from 'react-native';
import { STATUS, PRIORIDADE } from '../theme/cores';
import type { StatusOcorrencia, Prioridade } from '../models';

export function Etiqueta(props: { status: StatusOcorrencia } | { prioridade: Prioridade }) {
  const item = 'status' in props ? STATUS[props.status] : PRIORIDADE[props.prioridade];

  return (
    <View className="self-start rounded-full px-3 py-1" style={{ backgroundColor: item.fundo }}>
      <Text className="font-sans-semibold text-legenda" style={{ color: item.texto }}>
        {'status' in props ? '● ' : ''}
        {item.rotulo}
      </Text>
    </View>
  );
}
