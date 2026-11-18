import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { CartaoOcorrencia } from '../components/CartaoOcorrencia';
import { EstadoVazio } from '../components/Estados';
import { ListaBusca } from '../components/ListaBusca';
import { FiltrosStatus } from '../components/FiltrosStatus';
import { useLocalizacao } from '../hooks/useLocalizacao';
import { useBuscarOcorrencias } from '../hooks/useOcorrencias';
import { cores } from '../theme/cores';
import type { StatusOcorrencia } from '../models';

const opcoes = ['Todas', 'Recebida', 'Triada', 'Em andamento', 'Resolvida'] as const;

type Opcao = (typeof opcoes)[number];

const filtros: Record<Opcao, StatusOcorrencia | undefined> = {
  Todas: undefined,
  Recebida: 'RECEBIDA',
  Triada: 'TRIADA',
  'Em andamento': 'EM_ANDAMENTO',
  Resolvida: 'RESOLVIDA',
};

export function Bairro() {
  const [texto, editar] = useState('');

  const [bairro, buscar] = useState('');

  const [opcao, selecionar] = useState<Opcao>('Todas');

  const [origem, definirOrigem] = useState<'manual' | 'gps' | 'falha'>('manual');

  const edicao = useRef(0);

  const gps = useLocalizacao();

  const pronto = !!bairro && bairro === texto.trim();

  const consulta = useBuscarOcorrencias({ bairro, status: filtros[opcao] }, pronto);

  const total = consulta.data?.pages[0]?.totalItens;

  useEffect(() => {
    const timer = setTimeout(() => buscar(texto.trim()), 500);

    return () => clearTimeout(timer);
  }, [texto]);

  async function localizar() {
    const inicial = edicao.current;

    const posicao = await gps.capturar();

    if (inicial !== edicao.current) return;

    if (posicao?.bairro) {
      editar(posicao.bairro);
      definirOrigem('gps');
    } else definirOrigem('falha');
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
      <View className="gap-3 px-4 py-4">
        <CabecalhoTela titulo="Bairro" />
        <Text className="font-sans-semibold text-legenda text-texto">Qual bairro?</Text>
        <View className="flex-row items-center rounded-lg border border-borda bg-cartao px-3">
          <Feather name="search" size={18} color={cores.textoApoio} />
          <TextInput
            accessibilityLabel="Qual bairro?"
            placeholder="Digite o bairro"
            value={texto}
            onChangeText={(valor) => {
              edicao.current++;
              editar(valor);
              definirOrigem('manual');
            }}
            className="min-h-toque flex-1 px-2 font-sans text-corpo text-texto"
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Usar minha localização"
            accessibilityState={{ disabled: gps.buscando, busy: gps.buscando }}
            disabled={gps.buscando}
            onPress={localizar}
            className="min-h-toque min-w-toque items-center justify-center"
          >
            {gps.buscando ? (
              <ActivityIndicator color={cores.verde} />
            ) : (
              <Feather name="crosshair" size={20} color={cores.verde} />
            )}
          </Pressable>
        </View>
        {origem !== 'manual' && (
          <Text
            accessibilityLiveRegion="polite"
            className="font-sans text-legenda text-texto-apoio"
          >
            {origem === 'gps' ? 'Preenchido pela sua localização' : gps.mensagem}
          </Text>
        )}
        <FiltrosStatus opcoes={opcoes} valor={opcao} selecionar={selecionar} />
        {pronto && total !== undefined && (
          <Text className="font-sans text-legenda text-texto">
            <Text className="font-sans-bold">{total}</Text>{' '}
            {total === 1 ? 'ocorrência encontrada' : 'ocorrências encontradas'} em {bairro}
          </Text>
        )}
      </View>
      {!texto.trim() ? (
        <EstadoVazio
          titulo="Digite um bairro"
          mensagem="Digite um bairro ou use sua localização para ver as ocorrências."
        />
      ) : pronto ? (
        <ListaBusca
          consulta={consulta}
          dica="Tente outro bairro ou altere o filtro de status."
          CartaoItem={CartaoOcorrencia}
        />
      ) : (
        <ActivityIndicator color={cores.verde} />
      )}
    </SafeAreaView>
  );
}
