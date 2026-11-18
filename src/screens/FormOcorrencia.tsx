import { useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Campo } from '../components/Campo';
import { Botao } from '../components/Botao';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { Cartao, EsqueletoCartao } from '../components/Cartao';
import { EstadoErro } from '../components/Estados';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { useCriarOcorrencia, useAtualizarOcorrencia, useOcorrencia } from '../hooks/useOcorrencias';
import { useLocalizacao } from '../hooks/useLocalizacao';
import { camposDoErro, mensagemDeErro, statusDoErro } from '../services/erroApi';
import { podeEditarOuExcluir } from '../utils/ocorrencia';
import type { Ocorrencia, OcorrenciaRequest } from '../models';
import type { RotasRaiz } from '../routes/types';
import { cores } from '../theme/cores';

type Props = NativeStackScreenProps<RotasRaiz, 'FormOcorrencia'>;

export function FormOcorrencia({ route, navigation }: Props) {
  const id = route.params?.id;

  const consulta = useOcorrencia(id);

  const { sessao } = useAuth();

  if (id !== undefined && !consulta.data) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <CabecalhoTela titulo="Editar ocorrência" voltar={navigation.goBack} />
        {consulta.isError ? (
          <EstadoErro
            mensagem={mensagemDeErro(consulta.error)}
            tentarNovamente={() => void consulta.refetch()}
          />
        ) : (
          <EsqueletoCartao />
        )}
      </SafeAreaView>
    );
  }

  if (consulta.data && (!sessao || !podeEditarOuExcluir(sessao, consulta.data)))
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <CabecalhoTela titulo="Editar ocorrência" voltar={navigation.goBack} />
        <Text className="p-4 font-sans text-texto">Esta ocorrência não pode mais ser editada.</Text>
      </SafeAreaView>
    );

  return <Formulario key={id ?? 'nova'} navigation={navigation} ocorrencia={consulta.data} />;
}

function Formulario({
  navigation,
  ocorrencia,
}: {
  navigation: Props['navigation'];
  ocorrencia?: Ocorrencia;
}) {
  const [dados, definirDados] = useState<OcorrenciaRequest>({
    descricao: ocorrencia?.descricao ?? '',
    bairro: ocorrencia?.bairro ?? '',
    latitude: ocorrencia?.latitude ?? null,
    longitude: ocorrencia?.longitude ?? null,
  });

  const [erros, definirErros] = useState<Record<string, string>>({});

  const criar = useCriarOcorrencia();

  const atualizar = useAtualizarOcorrencia();

  const localizacao = useLocalizacao();

  const avisar = useSnackbar();

  const ocupado = useRef(false);

  const enviando = criar.isPending || atualizar.isPending;

  const bloqueado = enviando || localizacao.buscando;

  function alterar(campo: 'descricao' | 'bairro', valor: string) {
    definirDados((anterior) => ({ ...anterior, [campo]: valor }));
    definirErros((anterior) => ({ ...anterior, [campo]: '' }));
  }

  async function localizar() {
    const posicao = await localizacao.capturar();

    if (!posicao || !navigation.isFocused()) return;

    definirDados((anterior) => ({
      ...anterior,
      latitude: posicao.latitude,
      longitude: posicao.longitude,
      bairro: posicao.bairro ?? anterior.bairro,
    }));

    if (posicao.bairro) definirErros((anterior) => ({ ...anterior, bairro: '' }));
  }

  async function salvar() {
    if (ocupado.current || bloqueado || !navigation.isFocused()) return;

    const envio = { ...dados, descricao: dados.descricao.trim(), bairro: dados.bairro.trim() };

    const problemas: Record<string, string> = {};

    if (!envio.descricao) problemas.descricao = 'Descreva o problema.';

    if (!envio.bairro) problemas.bairro = 'Informe o bairro.';

    definirErros(problemas);

    if (Object.keys(problemas).length) return;

    ocupado.current = true;
    Keyboard.dismiss();
    try {
      if (ocorrencia) {
        await atualizar.mutateAsync({ id: ocorrencia.id, dados: envio });

        if (!navigation.isFocused()) return;

        navigation.goBack();
        avisar({ tipo: 'sucesso', mensagem: 'Ocorrência atualizada.' });
      } else {
        const nova = await criar.mutateAsync(envio);

        if (!navigation.isFocused()) return;

        navigation.replace('Detalhe', { id: nova.id });
        avisar({ tipo: 'sucesso', mensagem: 'Ocorrência enviada.' });
      }
    } catch (erro) {
      if (!navigation.isFocused()) return;

      const campos = camposDoErro(erro);

      if (statusDoErro(erro) === 409 && ocorrencia) {
        navigation.goBack();
        avisar({ tipo: 'erro', mensagem: mensagemDeErro(erro) });
      } else if (campos && (campos.descricao || campos.bairro)) definirErros(campos);
      else avisar({ tipo: 'erro', mensagem: mensagemDeErro(erro), tentarNovamente: salvar });
    } finally {
      ocupado.current = false;
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="gap-5 p-5">
          <CabecalhoTela
            titulo={ocorrencia ? 'Editar ocorrência' : 'Nova ocorrência'}
            voltar={navigation.goBack}
            fechar={!ocorrencia}
          />
          <Campo
            rotulo="Descreva o problema"
            multiline
            numberOfLines={5}
            style={{ minHeight: 148, textAlignVertical: 'top', paddingTop: 12 }}
            maxLength={500}
            contador
            dica="Conte o que é e onde fica."
            value={dados.descricao}
            erro={erros.descricao}
            editable={!bloqueado}
            onChangeText={(v) => alterar('descricao', v)}
          />
          <Campo
            rotulo="Bairro"
            maxLength={80}
            value={dados.bairro}
            editable={!bloqueado}
            erro={erros.bairro}
            onChangeText={(v) => alterar('bairro', v)}
          />
          <View className="items-start gap-2">
            <Botao
              titulo="Usar minha localização"
              variante="secundario"
              icone="crosshair"
              aoPressionar={localizar}
              carregando={localizacao.buscando}
              desabilitado={enviando}
            />
            {!!localizacao.mensagem && (
              <Text accessibilityLiveRegion="polite" className="font-sans text-legenda text-verde">
                {localizacao.mensagem}
              </Text>
            )}
          </View>
          <Cartao>
            <View className="flex-row items-start gap-3">
              <Ionicons name="sparkles-outline" size={20} color={cores.verde} />
              <Text className="flex-1 font-sans text-corpo text-texto">
                A <Text className="font-sans-semibold">categoria e a prioridade</Text> são definidas
                pela IA logo depois do envio.
              </Text>
            </View>
          </Cartao>
        </ScrollView>
        <View className="border-t border-borda bg-cartao p-4">
          <Botao
            titulo={ocorrencia ? 'Salvar' : 'Enviar'}
            textoCarregando={ocorrencia ? 'Salvando…' : 'Enviando…'}
            carregando={enviando}
            desabilitado={localizacao.buscando}
            aoPressionar={salvar}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
