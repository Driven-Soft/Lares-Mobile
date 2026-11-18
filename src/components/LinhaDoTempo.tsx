import { Text, View } from 'react-native';
import type { HistoricoStatus, Ocorrencia } from '../models';
import { PRIORIDADE, STATUS, cores } from '../theme/cores';
import { dataDaApi, formatarData } from '../utils/datas';

function textoDoEvento(evento: HistoricoStatus, ocorrencia: Ocorrencia) {
  if (evento.comentario?.trim()) return evento.comentario;

  if (evento.statusNovo === 'RECEBIDA') return 'Ocorrência registrada pelo app.';

  // O histórico não informa a categoria anterior a uma correção do gestor.
  if (
    evento.statusNovo === 'TRIADA' &&
    evento.usuarioNome === null &&
    ocorrencia.status !== 'TRIADA'
  )
    return 'Ocorrência classificada pela IA.';

  if (
    evento.statusNovo === 'TRIADA' &&
    evento.usuarioNome === null &&
    ocorrencia.categoria &&
    ocorrencia.prioridade
  )
    return `Classificada como ${ocorrencia.categoria.nome}, prioridade ${PRIORIDADE[ocorrencia.prioridade].rotulo}.`;

  return null;
}

export function LinhaDoTempo({ ocorrencia }: { ocorrencia: Ocorrencia }) {
  const eventos = [...(ocorrencia.historico ?? [])].sort(
    (a, b) => dataDaApi(b.dataAlteracao).getTime() - dataDaApi(a.dataAlteracao).getTime(),
  );

  return (
    <View className="gap-3">
      <Text accessibilityRole="header" className="font-sans-semibold text-secao text-texto">
        Linha do tempo
      </Text>
      <View>
        {eventos.map((evento, i) => {
          const status = STATUS[evento.statusNovo];

          const texto = textoDoEvento(evento, ocorrencia);

          return (
            <View
              key={`${evento.dataAlteracao}-${evento.statusNovo}-${i}`}
              className="flex-row gap-3"
            >
              <View className="w-3 items-center pt-1.5">
                <View className="h-3 w-3 rounded-full" style={{ backgroundColor: status.texto }} />
                {i < eventos.length - 1 && (
                  <View className="w-0.5 flex-1" style={{ backgroundColor: cores.borda }} />
                )}
              </View>
              <View className="flex-1 gap-1 pb-4">
                <Text className="font-sans-bold text-texto">{status.rotulo}</Text>
                <Text className="font-sans text-legenda text-texto-apoio">
                  {formatarData(evento.dataAlteracao, true)} · {evento.usuarioNome ?? 'IA'}
                </Text>
                {texto && <Text className="font-sans text-legenda text-texto">{texto}</Text>}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
