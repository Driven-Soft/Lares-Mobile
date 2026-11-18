import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import type { Ocorrencia } from '../models';
import { cores } from '../theme/cores';
import { Cartao } from './Cartao';
import { Etiqueta } from './Etiqueta';

export type VisaoDetalhe = 'dono' | 'morador' | 'gestor';

const titulos = {
  dono: 'Mensagem para você',
  morador: 'Mensagem ao morador',
  gestor: 'Resumo para a gestão',
};

export function AnaliseIA({
  ocorrencia,
  visao,
  demorando,
}: {
  ocorrencia: Ocorrencia;
  visao: VisaoDetalhe;
  demorando: boolean;
}) {
  const recebida = ocorrencia.status === 'RECEBIDA';

  const mensagem = (visao === 'gestor' ? ocorrencia.resumoIa : ocorrencia.mensagemCidadao)?.trim();

  const analisando = recebida && visao !== 'gestor' && !demorando;

  return (
    <Cartao>
      <View className="flex-row items-center gap-3">
        <View className="rounded-lg bg-verde-claro p-2">
          <Ionicons name="sparkles" size={18} color={cores.verde} />
        </View>
        <View className="flex-1">
          <Text className="font-sans-semibold text-corpo text-texto">Análise da IA</Text>
          {analisando && (
            <Text accessibilityLiveRegion="polite" className="font-sans text-legenda text-verde">
              Analisando…
            </Text>
          )}
        </View>
      </View>
      {recebida ? (
        <>
          {analisando && (
            <View className="gap-2">
              <View className="h-2 rounded-full bg-borda" />
              <View className="h-2 w-3/4 rounded-full bg-borda" />
            </View>
          )}
          <Text
            accessibilityLiveRegion="polite"
            className="font-sans text-legenda text-texto-apoio"
          >
            {visao === 'gestor'
              ? 'Sem triagem'
              : demorando
                ? 'A análise está demorando. Seu relato já chegou à prefeitura.'
                : 'A IA está lendo seu relato para definir categoria, prioridade e prazo.'}
          </Text>
        </>
      ) : (
        <>
          <View className="flex-row gap-2">
            <View className="flex-1 gap-1">
              <Text className="font-sans text-legenda text-texto-apoio">Categoria</Text>
              <Text className="font-sans-semibold text-texto">
                {ocorrencia.categoria?.nome ?? '—'}
              </Text>
            </View>
            <View className="flex-1 gap-1">
              <Text className="font-sans text-legenda text-texto-apoio">Prioridade</Text>
              {ocorrencia.prioridade ? (
                <Etiqueta prioridade={ocorrencia.prioridade} />
              ) : (
                <Text>—</Text>
              )}
            </View>
            <View className="flex-1 gap-1">
              <Text className="font-sans text-legenda text-texto-apoio">Prazo estimado</Text>
              <Text className="font-sans-semibold text-texto">
                {ocorrencia.prazoEstimadoDias == null
                  ? '—'
                  : `${ocorrencia.prazoEstimadoDias} ${ocorrencia.prazoEstimadoDias === 1 ? 'dia' : 'dias'}`}
              </Text>
            </View>
          </View>
          {!!mensagem && (
            <View className="gap-1 rounded-xl bg-fundo p-3">
              <Text className="font-sans text-legenda text-texto-apoio">{titulos[visao]}</Text>
              <Text className="font-sans text-corpo text-texto">{mensagem}</Text>
            </View>
          )}
        </>
      )}
    </Cartao>
  );
}
