import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useOcorrencia } from '../hooks/useOcorrencias';
import { useAuth } from '../context/AuthContext';
import { podeEditarOuExcluir } from '../utils/ocorrencia';
import { Botao } from '../components/Botao';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { EsqueletoCartao } from '../components/Cartao';
import { EstadoErro } from '../components/Estados';
import { Etiqueta } from '../components/Etiqueta';
import { mensagemDeErro } from '../services/erroApi';
import type { RotasRaiz } from '../routes/types';

export function DetalheProvisorio({
  route,
  navigation,
}: NativeStackScreenProps<RotasRaiz, 'Detalhe'>) {
  const { id } = route.params;

  const consulta = useOcorrencia(id);

  const { sessao } = useAuth();

  const ocorrencia = consulta.data;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerClassName="grow gap-4 p-4">
        <CabecalhoTela titulo="Ocorrência" voltar={navigation.goBack} />
        {ocorrencia ? (
          <>
            <Etiqueta status={ocorrencia.status} />
            <Text className="font-sans text-corpo text-texto">{ocorrencia.descricao}</Text>
            <Text className="font-sans text-legenda text-texto-apoio">{ocorrencia.bairro}</Text>
            {sessao && podeEditarOuExcluir(sessao, ocorrencia) && (
              <Botao
                titulo="Editar"
                variante="secundario"
                icone="edit-2"
                aoPressionar={() => navigation.navigate('FormOcorrencia', { id })}
              />
            )}
          </>
        ) : consulta.isError ? (
          <EstadoErro
            mensagem={mensagemDeErro(consulta.error)}
            tentarNovamente={() => void consulta.refetch()}
          />
        ) : (
          <EsqueletoCartao />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
