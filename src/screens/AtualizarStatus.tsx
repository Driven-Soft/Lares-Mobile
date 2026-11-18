import { useState } from 'react';
import { ScrollView, Text, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RotasRaiz } from '../routes/types';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { Cartao, EsqueletoCartao } from '../components/Cartao';
import { Etiqueta } from '../components/Etiqueta';
import { Campo } from '../components/Campo';
import { SeletorModal } from '../components/SeletorModal';
import { EstadoErro } from '../components/Estados';
import { Botao } from '../components/Botao';
import { useCategorias } from '../hooks/useCategorias';
import { useAtualizarStatus, useOcorrencia } from '../hooks/useOcorrencias';
import { useSnackbar } from '../context/SnackbarContext';
import { camposDoErro, mensagemDeErro, statusDoErro } from '../services/erroApi';
import { proximoStatus } from '../utils/ocorrencia';
import { STATUS, cores } from '../theme/cores';
import type { Ocorrencia } from '../models';

type Props = NativeStackScreenProps<RotasRaiz, 'AtualizarStatus'>;

export function AtualizarStatus({ route, navigation }: Props) {
  const consulta = useOcorrencia(route.params.id);

  const voltar = () => {
    if (navigation.isFocused()) navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="px-4 py-2">
        <CabecalhoTela titulo="Atualizar status" voltar={voltar} />
      </View>
      {consulta.isError ? (
        <EstadoErro
          mensagem={mensagemDeErro(consulta.error)}
          tentarNovamente={() => void consulta.refetch()}
        />
      ) : consulta.data ? (
        <Formulario
          key={consulta.data.id + '-' + consulta.data.status + '-' + consulta.data.categoria?.id}
          ocorrencia={consulta.data}
          voltar={voltar}
          recarregar={() => consulta.refetch()}
        />
      ) : (
        <EsqueletoCartao />
      )}
    </SafeAreaView>
  );
}

function Formulario({
  ocorrencia,
  voltar,
  recarregar,
}: {
  ocorrencia: Ocorrencia;
  voltar: () => void;
  recarregar: () => Promise<unknown>;
}) {
  const categorias = useCategorias();

  const salvar = useAtualizarStatus();

  const avisar = useSnackbar();

  const [categoriaId, selecionar] = useState(ocorrencia.categoria?.id ?? null);

  const [comentario, editar] = useState('');

  const [validar, definirValidar] = useState(false);

  const [recarregando, definirRecarregando] = useState(false);

  const proximo = proximoStatus(ocorrencia.status);

  const campos = camposDoErro(salvar.error);

  const bloqueado = salvar.isPending || recarregando;

  async function confirmar() {
    if (!proximo || bloqueado) return;

    if (categoriaId === null) {
      definirValidar(true);

      return;
    }

    try {
      await salvar.mutateAsync({
        id: ocorrencia.id,
        dados: {
          status: proximo,
          ...(comentario.trim() ? { comentario: comentario.trim() } : {}),
          ...(categoriaId !== ocorrencia.categoria?.id ? { categoriaId } : {}),
        },
      });
      voltar();
      avisar({
        tipo: 'sucesso',
        mensagem: 'Status atualizado para ' + STATUS[proximo].rotulo + '.',
      });
    } catch (erro) {
      avisar({ tipo: 'erro', mensagem: mensagemDeErro(erro) });

      if (statusDoErro(erro) === 409) {
        definirRecarregando(true);
        try {
          await recarregar();
        } finally {
          definirRecarregando(false);
        }
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="gap-4 p-4">
        <Cartao>
          <Text numberOfLines={2} className="font-sans text-corpo text-texto">
            {ocorrencia.descricao}
          </Text>
          <View className="flex-row flex-wrap items-center justify-between gap-2">
            <Text className="font-sans text-legenda text-texto-apoio">
              <Feather name="map-pin" /> {ocorrencia.bairro}
            </Text>
            <View className="flex-row items-center gap-1">
              <Text className="font-sans text-legenda text-texto-apoio">Status atual</Text>
              <Etiqueta status={ocorrencia.status} />
            </View>
          </View>
        </Cartao>
        {proximo ? (
          <>
            <Text className="font-sans-semibold text-legenda text-texto">Novo status</Text>
            <View
              accessible
              accessibilityRole="radio"
              accessibilityState={{ checked: true }}
              accessibilityLabel={STATUS[proximo].rotulo}
              className="flex-row items-center gap-3 rounded-xl border border-verde bg-cartao p-4"
            >
              <Text style={{ color: cores.verde }}>◉</Text>
              <View className="flex-1 gap-1">
                <Etiqueta status={proximo} />
                <Text className="font-sans text-legenda text-texto-apoio">
                  {proximo === 'EM_ANDAMENTO'
                    ? 'A equipe começou o atendimento.'
                    : 'O problema foi resolvido.'}
                </Text>
              </View>
            </View>
            <Text className="font-sans text-legenda text-texto-apoio">
              <Feather name="info" /> De {STATUS[ocorrencia.status].rotulo}, o próximo passo só pode
              ser {STATUS[proximo].rotulo}.
            </Text>
            {categorias.isError ? (
              <EstadoErro
                mensagem={mensagemDeErro(categorias.error)}
                tentarNovamente={() => void categorias.refetch()}
              />
            ) : categorias.isPending ? (
              <Text>Carregando categorias…</Text>
            ) : (
              <SeletorModal
                titulo="Categoria"
                valor={categoriaId}
                selecionar={selecionar}
                opcoes={categorias.data.map((cat) => ({ valor: cat.id, rotulo: cat.nome }))}
              />
            )}
            {(validar && categoriaId === null) || campos?.categoriaId ? (
              <Text accessibilityLiveRegion="polite" className="font-sans text-legenda text-erro">
                {campos?.categoriaId ?? 'Escolha uma categoria.'}
              </Text>
            ) : ocorrencia.categoria &&
              categoriaId === ocorrencia.categoria.id &&
              ocorrencia.status === 'TRIADA' ? (
              <Text className="font-sans text-legenda text-verde">
                Sugestão da IA. Troque se estiver errada.
              </Text>
            ) : null}
            <Campo
              rotulo="Comentário"
              multiline
              maxLength={255}
              contador
              editable={!bloqueado}
              value={comentario}
              onChangeText={editar}
              erro={campos?.comentario}
              dica="Aparece na linha do tempo para o morador."
              style={{ minHeight: 96, textAlignVertical: 'top' }}
            />
          </>
        ) : (
          <Text className="font-sans text-corpo text-texto">Esta ocorrência já foi resolvida.</Text>
        )}
      </ScrollView>
      <View className="border-t border-borda bg-cartao p-4">
        {proximo ? (
          <Botao
            titulo="Confirmar"
            carregando={bloqueado}
            textoCarregando="Atualizando…"
            desabilitado={!categorias.isSuccess}
            aoPressionar={confirmar}
          />
        ) : (
          <Botao titulo="Voltar ao detalhe" aoPressionar={voltar} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
