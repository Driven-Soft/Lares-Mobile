import { Pressable, Text, ActivityIndicator } from 'react-native';
import { cores } from '../theme/cores';

interface Props {
  titulo: string;
  aoPressionar: () => void;
  variante?: 'primario' | 'secundario' | 'perigo';
  carregando?: boolean;
  textoCarregando?: string;
  desabilitado?: boolean;
}

export function Botao({
  titulo,
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
      accessibilityState={{ disabled: bloqueado, busy: carregando }}
      disabled={bloqueado}
      onPress={aoPressionar}
      className="min-h-12 flex-row items-center justify-center gap-2 rounded-xl border px-4 py-2"
      style={{
        backgroundColor: primario ? cores.verde : cores.cartao,
        borderColor: primario ? cores.verde : cor,
        opacity: bloqueado ? 0.7 : 1,
      }}
    >
      {carregando && <ActivityIndicator color={cor} />}
      <Text className="text-center font-sans-bold text-corpo" style={{ color: cor }}>
        {carregando ? (textoCarregando ?? titulo) : titulo}
      </Text>
    </Pressable>
  );
}
