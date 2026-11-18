import { Feather } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import type { StatusOcorrencia } from '../models';
import { cores } from '../theme/cores';
import type { VisaoDetalhe } from './AnaliseIA';
import { Botao } from './Botao';

interface Props {
  visao: VisaoDetalhe;
  status: StatusOcorrencia;
  editavel: boolean;
  excluindo: boolean;
  editar: () => void;
  excluir: () => void;
  atualizar: () => void;
}

export function RodapeOcorrencia({
  visao,
  status,
  editavel,
  excluindo,
  editar,
  excluir,
  atualizar,
}: Props) {
  if ((visao === 'dono' && !editavel) || (visao === 'gestor' && status === 'RESOLVIDA'))
    return null;

  return (
    <View className="border-t border-borda bg-cartao p-4">
      {visao === 'gestor' ? (
        <Botao titulo="Atualizar status" icone="arrow-right" aoPressionar={atualizar} />
      ) : visao === 'morador' ? (
        <View className="flex-row items-center gap-2">
          <Feather name="info" size={16} color={cores.textoApoio} />
          <Text className="flex-1 font-sans text-legenda text-texto-apoio">
            Só quem registrou pode editar ou excluir.
          </Text>
        </View>
      ) : (
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Botao
              titulo="Editar"
              icone="edit-2"
              variante="secundario"
              desabilitado={excluindo}
              aoPressionar={editar}
            />
          </View>
          <View className="flex-1">
            <Botao
              titulo="Excluir"
              icone="trash-2"
              variante="perigo"
              carregando={excluindo}
              textoCarregando="Excluindo…"
              aoPressionar={excluir}
            />
          </View>
        </View>
      )}
    </View>
  );
}
