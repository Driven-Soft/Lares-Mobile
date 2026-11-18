import { Feather } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { cores } from '../theme/cores';
import { Botao } from './Botao';

interface Props {
  titulo: string;
  mensagem: string;
  acao?: string;
  aoPressionar?: () => void;
}

function Estado({
  titulo,
  mensagem,
  acao,
  aoPressionar,
  erro = false,
}: Props & { erro?: boolean }) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-6">
      <View className={erro ? 'rounded-full bg-erro-claro p-5' : 'rounded-full bg-verde-claro p-5'}>
        <Feather
          name={erro ? 'wifi-off' : 'home'}
          size={36}
          color={erro ? cores.erro : cores.verde}
        />
      </View>
      <Text
        accessibilityRole="header"
        className="text-center font-sans-semibold text-secao text-texto"
      >
        {titulo}
      </Text>
      {!!mensagem && (
        <Text
          accessibilityLiveRegion={erro ? 'polite' : 'none'}
          className="text-center font-sans text-corpo text-texto-apoio"
        >
          {mensagem}
        </Text>
      )}
      {acao && aoPressionar && (
        <Botao
          titulo={acao}
          variante={erro ? 'secundario' : 'primario'}
          aoPressionar={aoPressionar}
        />
      )}
    </View>
  );
}

export function EstadoVazio(props: Props) {
  return <Estado {...props} />;
}

export function EstadoErro({
  mensagem,
  tentarNovamente,
}: {
  mensagem: string;
  tentarNovamente: () => void;
}) {
  return (
    <Estado
      erro
      titulo="Não foi possível carregar"
      mensagem={mensagem}
      acao="Tentar novamente"
      aoPressionar={tentarNovamente}
    />
  );
}
