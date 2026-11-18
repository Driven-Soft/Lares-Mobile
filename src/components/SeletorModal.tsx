import { useState } from 'react';
import { Modal, ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chip } from './Chip';
import { Botao } from './Botao';

interface Opcao<T> {
  valor: T;
  rotulo: string;
}

export function SeletorModal<T extends string | number>({
  titulo,
  opcoes,
  valor,
  selecionar,
}: {
  titulo: string;
  opcoes: Opcao<T>[];
  valor: T | null;
  selecionar: (valor: T) => void;
}) {
  const [aberto, abrir] = useState(false);

  const atual = opcoes.find((o) => o.valor === valor);

  return (
    <View className="gap-2">
      <Text className="font-sans-semibold text-legenda text-texto">{titulo}</Text>
      <Botao
        titulo={atual?.rotulo ?? 'Selecionar'}
        variante="secundario"
        aoPressionar={() => abrir(true)}
      />
      <Modal visible={aberto} onRequestClose={() => abrir(false)} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <View className="flex-1 gap-3 bg-fundo p-4">
            <Text accessibilityRole="header" className="font-sans-bold text-titulo text-texto">
              {titulo}
            </Text>
            <ScrollView contentContainerClassName="gap-2">
              {opcoes.map((opcao) => (
                <Chip
                  key={opcao.valor}
                  rotulo={opcao.rotulo}
                  selecionado={valor === opcao.valor}
                  aoPressionar={() => {
                    selecionar(opcao.valor);
                    abrir(false);
                  }}
                />
              ))}
            </ScrollView>
            <Botao titulo="Cancelar" variante="secundario" aoPressionar={() => abrir(false)} />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
