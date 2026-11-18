import { Feather, Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { Cartao } from './Cartao';
import { Etiqueta } from './Etiqueta';
import { formatarData } from '../utils/datas';
import { cores } from '../theme/cores';
import type { Ocorrencia } from '../models';

export function CartaoOcorrencia({
  ocorrencia,
  abrir,
}: {
  ocorrencia: Ocorrencia;
  abrir: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={abrir}>
      <Cartao>
        <View className="flex-row items-center justify-between gap-2">
          <Etiqueta status={ocorrencia.status} />
          <Text className="font-sans text-legenda text-texto-apoio">
            {formatarData(ocorrencia.dataAbertura)}
          </Text>
        </View>
        <Text numberOfLines={2} className="font-sans text-corpo text-texto">
          {ocorrencia.descricao}
        </Text>
        <View className="flex-row flex-wrap items-center justify-between gap-2">
          <View className="flex-row items-center gap-1">
            <Feather name="map-pin" size={14} color={cores.textoApoio} />
            <Text className="font-sans text-legenda text-texto-apoio">{ocorrencia.bairro}</Text>
          </View>
          {ocorrencia.status === 'RECEBIDA' ? (
            <View className="flex-row items-center gap-1">
              <Ionicons name="sparkles-outline" size={14} color={cores.textoApoio} />
              <Text className="font-sans text-legenda text-texto-apoio">Aguardando a IA</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap items-center gap-1">
              {ocorrencia.categoria && (
                <Text className="rounded-full border border-borda px-2 py-1 font-sans-semibold text-legenda text-texto">
                  {ocorrencia.categoria.nome}
                </Text>
              )}
              {ocorrencia.prioridade && <Etiqueta prioridade={ocorrencia.prioridade} />}
            </View>
          )}
        </View>
      </Cartao>
    </Pressable>
  );
}
