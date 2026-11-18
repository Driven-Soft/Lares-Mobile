import { useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { View, Text, TextInput, Pressable, type TextInputProps } from 'react-native';
import { cores } from '../theme/cores';

interface Props extends TextInputProps {
  rotulo: string;
  erro?: string;
  invalido?: boolean;
  dica?: string;
  contador?: boolean;
}

export function Campo({
  rotulo,
  erro,
  dica,
  invalido,
  contador,
  secureTextEntry,
  editable = true,
  value,
  maxLength,
  onBlur,
  onFocus,
  ...props
}: Props) {
  const [visivel, mostrar] = useState(false);

  const [focado, focar] = useState(false);

  return (
    <View className="gap-1">
      <Text className="font-sans-semibold text-legenda text-texto">{rotulo}</Text>
      <View
        className="flex-row items-center rounded-lg border px-3"
        style={{
          backgroundColor: editable ? cores.cartao : cores.fundo,
          borderColor: erro || invalido ? cores.erro : focado ? cores.verde : cores.borda,
        }}
      >
        <TextInput
          {...props}
          value={value}
          maxLength={maxLength}
          editable={editable}
          accessibilityLabel={rotulo}
          accessibilityHint={erro ?? dica}
          secureTextEntry={secureTextEntry && !visivel}
          onFocus={(e) => {
            focar(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            focar(false);
            onBlur?.(e);
          }}
          placeholderTextColor={cores.textoApoio}
          className="min-h-toque flex-1 font-sans text-corpo text-texto"
        />
        {secureTextEntry && (
          <Pressable
            disabled={!editable}
            accessibilityRole="button"
            accessibilityLabel={visivel ? 'Ocultar senha' : 'Mostrar senha'}
            onPress={() => mostrar(!visivel)}
            className="min-h-toque min-w-toque items-center justify-center"
          >
            <Feather name={visivel ? 'eye-off' : 'eye'} size={20} color={cores.textoApoio} />
          </Pressable>
        )}
      </View>
      {erro ? (
        <Text accessibilityLiveRegion="polite" className="font-sans text-legenda text-erro">
          <Feather name="alert-circle" /> {erro}
        </Text>
      ) : (
        dica && <Text className="font-sans text-legenda text-texto-apoio">{dica}</Text>
      )}
      {contador && (
        <Text className="text-right font-sans text-legenda text-texto-apoio">
          {value?.length ?? 0}/{maxLength}
        </Text>
      )}
    </View>
  );
}
