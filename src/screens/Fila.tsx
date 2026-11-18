import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { ListaBusca } from '../components/ListaBusca';
import { CartaoFila } from '../components/CartaoFila';
import { FiltrosStatus } from '../components/FiltrosStatus';
import { useBuscarOcorrencias } from '../hooks/useOcorrencias';
import { STATUS } from '../theme/cores';
import type { StatusOcorrencia } from '../models';

const opcoes = ['Triadas', 'Recebidas', 'Em andamento', 'Resolvidas'] as const;

type Opcao = (typeof opcoes)[number];

const filtros: Record<Opcao, StatusOcorrencia> = {
  Triadas: 'TRIADA',
  Recebidas: 'RECEBIDA',
  'Em andamento': 'EM_ANDAMENTO',
  Resolvidas: 'RESOLVIDA',
};

export function Fila() {
  const [opcao, selecionar] = useState<Opcao>('Triadas');

  const [bairro, filtrar] = useState('');

  const [texto, editar] = useState('');

  const [aberto, abrir] = useState(false);

  const status = filtros[opcao];

  const consulta = useBuscarOcorrencias({
    status,
    bairro: bairro || undefined,
    sort: 'prioridade',
  });

  const total = consulta.data?.pages[0]?.totalItens;

  function aplicar(valor: string) {
    filtrar(valor.trim());
    abrir(false);
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
      <View className="gap-3 px-4 py-4">
        <CabecalhoTela titulo="Fila" />
        <Text className="font-sans text-corpo text-texto-apoio">
          Prefeitura · ordenada por prioridade
        </Text>
        <FiltrosStatus opcoes={opcoes} valor={opcao} selecionar={selecionar} />
        <View className="flex-row items-center justify-between gap-2">
          <Text className="font-sans text-legenda text-texto">
            {total !== undefined && (
              <>
                <Text className="font-sans-bold">{total}</Text>{' '}
                {(total === 1 ? STATUS[status].rotulo : opcao).toLowerCase()}
              </>
            )}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={'Filtrar por bairro: ' + (bairro || 'Todos os bairros')}
            className="min-h-toque shrink flex-row items-center gap-2 rounded-xl border border-borda bg-cartao px-3"
            onPress={() => {
              editar(bairro);
              abrir(true);
            }}
          >
            <Feather name="map-pin" />
            <Text numberOfLines={1} className="shrink font-sans-semibold text-legenda text-texto">
              {bairro || 'Todos os bairros'}
            </Text>
            <Feather name="chevron-down" />
          </Pressable>
        </View>
      </View>
      <ListaBusca
        consulta={consulta}
        dica="Tente outro status ou altere o bairro."
        CartaoItem={CartaoFila}
      />
      <Modal visible={aberto} onRequestClose={() => abrir(false)} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerClassName="grow gap-4 bg-fundo p-4"
            >
              <CabecalhoTela titulo="Filtrar por bairro" voltar={() => abrir(false)} />
              <Campo
                rotulo="Bairro"
                value={texto}
                onChangeText={editar}
                placeholder="Todos os bairros"
                onSubmitEditing={() => aplicar(texto)}
              />
              <Botao titulo="Aplicar" aoPressionar={() => aplicar(texto)} />
              <Botao titulo="Limpar" variante="secundario" aoPressionar={() => aplicar('')} />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
