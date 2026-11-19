import type { ComponentProps } from 'react';
import { Feather } from '@expo/vector-icons';
import { Pressable, Text, ActivityIndicator } from 'react-native';
import { cores } from '../theme/cores';

interface Props {
  titulo: string;
  icone?: ComponentProps<typeof Feather>['name'];
  aoPressionar: () => void;
  variante?: 'primario' | 'secundario' | 'perigo';
  carregando?: boolean;
  textoCarregando?: string;
  desabilitado?: boolean;
}

export function Botao({
  titulo,
  icone,
  aoPressionar,
  variante = 'primario',
  carregando = false,
  textoCarregando,
  desabilitado = false,
}: Props) {
  const primario = variante === 'primario';

  const cor = primario ? cores.cartao : variante === 'perigo' ? cores.erro : cores.verde;

  const bloqueado = desabilitado || carregando;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={carregando ? (textoCarregando ?? titulo) : titulo}
      accessibilityState={{ disabled: bloqueado, busy: carregando }}
      disabled={bloqueado}
      onPress={aoPressionar}
      android_ripple={{ color: primario ? cores.verdeClaro : cores.borda }}
      style={{
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: primario ? cores.verde : cores.cartao,
        borderColor: primario ? cores.verde : cor,
        opacity: bloqueado ? 0.8 : 1,
        overflow: 'hidden',
      }}
    >
      {carregando ? (
        <ActivityIndicator color={cor} />
      ) : (
        icone && <Feather name={icone} size={18} color={cor} />
      )}
      <Text className="shrink text-center font-sans-bold text-corpo" style={{ color: cor }}>
        {carregando ? (textoCarregando ?? titulo) : titulo}
      </Text>
    </Pressable>
  );
}
