import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { EsqueletoCartao } from '../components/Cartao';
import { CartaoOcorrencia } from '../components/CartaoOcorrencia';
import { EstadoErro, EstadoVazio } from '../components/Estados';
import { Botao } from '../components/Botao';
import { useAuth } from '../context/AuthContext';
import { useMinhasOcorrencias } from '../hooks/useOcorrencias';
import type { RotasRaiz } from '../routes/types';
import { cores } from '../theme/cores';
import { mensagemDeErro } from '../services/erroApi';

export function MinhasOcorrencias() {
  const navigation = useNavigation<NativeStackNavigationProp<RotasRaiz>>();

  const { sessao } = useAuth();

  const consulta = useMinhasOcorrencias();

  const itens = consulta.data?.pages.flatMap((pagina) => pagina.itens) ?? [];

  const nova = () => navigation.navigate('FormOcorrencia');

  const abrir = useCallback((id: number) => navigation.navigate('Detalhe', { id }), [navigation]);

  const [atualizando, definirAtualizando] = useState(false);

  async function atualizar() {
    definirAtualizando(true);
    try {
      await consulta.refetch();
    } finally {
      definirAtualizando(false);
    }
  }

  const mais = () => {
    if (consulta.hasNextPage && !consulta.isFetching) void consulta.fetchNextPage();
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
      <View className="gap-1 px-5 py-4">
        <CabecalhoTela titulo={`Olá, ${sessao?.nome.trim().split(/\s+/)[0] ?? ''}`} />
        <Text className="font-sans text-corpo text-texto-apoio">
          Acompanhe o que você registrou.
        </Text>
      </View>
      {consulta.isPending ? (
        <View className="gap-3 px-4">
          {[1, 2, 3].map((i) => (
            <EsqueletoCartao key={i} />
          ))}
        </View>
      ) : consulta.isError && !itens.length ? (
        <EstadoErro mensagem={mensagemDeErro(consulta.error)} tentarNovamente={atualizar} />
      ) : (
        <FlatList
          data={itens}
          keyExtractor={(item) => String(item.id)}
          contentContainerClassName={
            itens.length ? 'grow gap-3 px-4 pb-24' : 'grow justify-center px-4'
          }
          renderItem={({ item }) => <CartaoOcorrencia ocorrencia={item} abrir={abrir} />}
          refreshing={atualizando}
          onRefresh={atualizar}
          onEndReached={() => {
            if (!consulta.isFetchNextPageError) mais();
          }}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <EstadoVazio
              titulo="Nenhuma ocorrência ainda"
              mensagem="Viu um buraco, um poste apagado ou lixo na rua? Conte aqui e a prefeitura fica sabendo."
              acao="+ Registrar meu primeiro problema"
              aoPressionar={nova}
            />
          }
          ListFooterComponent={
            consulta.isFetchingNextPage ? (
              <View className="flex-row justify-center gap-2 py-3">
                <ActivityIndicator size="small" color={cores.verde} />
                <Text className="font-sans text-legenda text-texto-apoio">Carregando mais…</Text>
              </View>
            ) : consulta.isError && itens.length > 0 ? (
              <Botao
                titulo="Tentar novamente"
                variante="secundario"
                aoPressionar={consulta.isFetchNextPageError ? mais : atualizar}
              />
            ) : undefined
          }
        />
      )}
      {(consulta.isPending || itens.length > 0) && (
        <View className="absolute bottom-4 right-4">
          <Botao titulo="Nova ocorrência" icone="plus" aoPressionar={nova} />
        </View>
      )}
    </SafeAreaView>
  );
}
