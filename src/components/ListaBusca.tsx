import { useState, type ReactElement } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RotasRaiz } from '../routes/types';
import type { Ocorrencia } from '../models';
import type { useBuscarOcorrencias } from '../hooks/useOcorrencias';
import { mensagemDeErro } from '../services/erroApi';
import { cores } from '../theme/cores';
import { EstadoErro, EstadoVazio } from './Estados';
import { EsqueletoCartao } from './Cartao';
import { Botao } from './Botao';

export function ListaBusca({
  consulta,
  dica,
  cartao,
}: {
  consulta: ReturnType<typeof useBuscarOcorrencias>;
  dica: string;
  cartao: (item: Ocorrencia, abrir: () => void) => ReactElement;
}) {
  const navigation = useNavigation<NativeStackNavigationProp<RotasRaiz>>();

  const [atualizando, atualizar] = useState(false);

  const itens = consulta.data?.pages.flatMap((p) => p.itens) ?? [];

  async function recarregar() {
    atualizar(true);
    try {
      await consulta.refetch();
    } finally {
      atualizar(false);
    }
  }

  function mais() {
    if (consulta.hasNextPage && !consulta.isFetching) void consulta.fetchNextPage();
  }

  if (consulta.isPending)
    return (
      <View className="gap-3 px-4">
        {[1, 2, 3].map((i) => (
          <EsqueletoCartao key={i} />
        ))}
      </View>
    );

  if (consulta.isError && !itens.length)
    return <EstadoErro mensagem={mensagemDeErro(consulta.error)} tentarNovamente={recarregar} />;

  return (
    <FlatList
      data={itens}
      keyboardShouldPersistTaps="handled"
      keyExtractor={(item) => String(item.id)}
      contentContainerClassName="grow gap-3 px-4 pb-4"
      renderItem={({ item }) => cartao(item, () => navigation.navigate('Detalhe', { id: item.id }))}
      refreshing={atualizando}
      onRefresh={recarregar}
      onEndReachedThreshold={0.3}
      onEndReached={() => {
        if (!consulta.isFetchNextPageError) mais();
      }}
      ListEmptyComponent={<EstadoVazio titulo="Nenhuma ocorrência encontrada" mensagem={dica} />}
      ListFooterComponent={
        consulta.isFetchingNextPage ? (
          <ActivityIndicator accessibilityLabel="Carregando mais ocorrências" color={cores.verde} />
        ) : consulta.isError ? (
          <Botao
            titulo="Tentar novamente"
            variante="secundario"
            aoPressionar={consulta.isFetchNextPageError ? mais : recarregar}
          />
        ) : undefined
      }
    />
  );
}
