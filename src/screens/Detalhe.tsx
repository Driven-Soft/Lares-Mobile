import { useRef, useState } from 'react';
import { Alert, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AnaliseIA } from '../components/AnaliseIA';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { EsqueletoCartao } from '../components/Cartao';
import { EstadoErro, EstadoVazio } from '../components/Estados';
import { LinhaDoTempo } from '../components/LinhaDoTempo';
import { ProgressoStatus } from '../components/ProgressoStatus';
import { RodapeOcorrencia } from '../components/RodapeOcorrencia';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { useDetalheOcorrencia } from '../hooks/useDetalheOcorrencia';
import { useExcluirOcorrencia } from '../hooks/useOcorrencias';
import type { RotasRaiz } from '../routes/types';
import { mensagemDeErro, statusDoErro } from '../services/erroApi';
import { cores } from '../theme/cores';
import { formatarData } from '../utils/datas';
import { podeEditarOuExcluir } from '../utils/ocorrencia';

type Props = NativeStackScreenProps<RotasRaiz, 'Detalhe'>;

export function Detalhe(props: Props) {
  return <ConteudoDetalhe key={props.route.params.id} {...props} />;
}

function ConteudoDetalhe({ route, navigation }: Props) {
  const { id } = route.params;

  const { sessao } = useAuth();

  const { consulta, demorando } = useDetalheOcorrencia(id, sessao?.papel === 'CIDADAO');

  const exclusao = useExcluirOcorrencia();

  const avisar = useSnackbar();

  const emExclusao = useRef(false);

  const [atualizando, definirAtualizando] = useState(false);

  const ocorrencia = consulta.data;

  const visao =
    sessao?.papel === 'GESTOR'
      ? 'gestor'
      : sessao?.usuarioId === ocorrencia?.usuario.id
        ? 'dono'
        : 'morador';

  async function atualizar() {
    definirAtualizando(true);
    try {
      await consulta.refetch();
    } finally {
      definirAtualizando(false);
    }
  }

  async function excluir() {
    if (emExclusao.current || !navigation.isFocused()) return;

    emExclusao.current = true;
    try {
      await exclusao.mutateAsync(id);

      if (navigation.isFocused()) navigation.goBack();

      avisar({ tipo: 'sucesso', mensagem: 'Ocorrência excluída.' });
    } catch (erro) {
      avisar({ tipo: 'erro', mensagem: mensagemDeErro(erro) });
    } finally {
      emExclusao.current = false;
    }
  }

  function confirmarExclusao() {
    Alert.alert(
      'Excluir ocorrência?',
      'Ela sai da sua lista e a prefeitura deixa de acompanhar. Não dá para desfazer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => void excluir() },
      ],
    );
  }

  const codigo = statusDoErro(consulta.error);

  const falhaTemporaria = consulta.isError && (codigo === undefined || codigo >= 500);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="px-4 pt-2">
        <CabecalhoTela titulo="Ocorrência" voltar={navigation.goBack} />
      </View>
      {codigo === 404 ? (
        <EstadoVazio
          titulo="Esta ocorrência não existe mais."
          mensagem=""
          acao="Voltar"
          aoPressionar={navigation.goBack}
        />
      ) : consulta.isError && (!ocorrencia || !falhaTemporaria) ? (
        <EstadoErro mensagem={mensagemDeErro(consulta.error)} tentarNovamente={atualizar} />
      ) : !ocorrencia ? (
        <View className="gap-4 p-4">
          <EsqueletoCartao />
          <EsqueletoCartao />
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerClassName="gap-5 px-4 pb-6 pt-2"
            refreshControl={
              <RefreshControl
                refreshing={atualizando}
                onRefresh={atualizar}
                tintColor={cores.verde}
                colors={[cores.verde]}
              />
            }
          >
            {falhaTemporaria && (
              <Text accessibilityLiveRegion="polite" className="font-sans text-legenda text-erro">
                {mensagemDeErro(consulta.error)} Puxe para atualizar.
              </Text>
            )}
            <ProgressoStatus status={ocorrencia.status} />
            <Text className="font-sans text-corpo text-texto">{ocorrencia.descricao}</Text>
            <View className="flex-row flex-wrap gap-3">
              <View className="flex-row items-center gap-1">
                <Feather name="map-pin" size={15} color={cores.textoApoio} />
                <Text className="font-sans text-legenda text-texto-apoio">{ocorrencia.bairro}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Feather name="calendar" size={15} color={cores.textoApoio} />
                <Text className="font-sans text-legenda text-texto-apoio">
                  Aberta em {formatarData(ocorrencia.dataAbertura)}
                </Text>
              </View>
            </View>
            <AnaliseIA ocorrencia={ocorrencia} visao={visao} demorando={demorando} />
            <LinhaDoTempo ocorrencia={ocorrencia} />
          </ScrollView>
          <RodapeOcorrencia
            visao={visao}
            status={ocorrencia.status}
            editavel={!!sessao && podeEditarOuExcluir(sessao, ocorrencia)}
            excluindo={exclusao.isPending}
            editar={() => navigation.navigate('FormOcorrencia', { id })}
            excluir={confirmarExclusao}
            atualizar={() => navigation.navigate('AtualizarStatus', { id })}
          />
        </>
      )}
    </SafeAreaView>
  );
}
