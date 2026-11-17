import { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Campo } from '../components/Campo';
import { Botao } from '../components/Botao';
import { CabecalhoTela } from '../components/CabecalhoTela';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { mensagemDeErro } from '../services/erroApi';
import type { RotasRaiz } from '../routes/types';
import { emailValido } from '../utils/texto';

const titulos: Record<string, string> = {
  Detalhe: 'Ocorrência',
  FormOcorrencia: 'Nova ocorrência',
  AtualizarStatus: 'Atualizar status',
  Sobre: 'Sobre o app',
  Cadastro: 'Criar conta',
};

export function TelaProvisoria({ route }: { route: { name: string } }) {
  return (
    <SafeAreaView className="flex-1 bg-fundo p-4">
      <CabecalhoTela titulo={titulos[route.name] ?? route.name} />
    </SafeAreaView>
  );
}

export function LoginProvisorio({ navigation }: NativeStackScreenProps<RotasRaiz, 'Login'>) {
  const { entrar } = useAuth();

  const avisar = useSnackbar();

  const [email, definirEmail] = useState('');

  const [senha, definirSenha] = useState('');

  const [enviando, enviar] = useState(false);

  async function testarLogin() {
    enviar(true);
    try {
      await entrar({ email: email.trim(), senha });
    } catch (erro) {
      avisar({ tipo: 'erro', mensagem: mensagemDeErro(erro) });
    } finally {
      enviar(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-fundo">
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerClassName="gap-3 p-4">
        <CabecalhoTela titulo="Login" />
        <Campo
          rotulo="E-mail"
          value={email}
          onChangeText={definirEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!enviando}
        />
        <Campo
          rotulo="Senha"
          value={senha}
          onChangeText={definirSenha}
          secureTextEntry
          editable={!enviando}
        />
        <Botao
          titulo="Entrar"
          carregando={enviando}
          textoCarregando="Entrando…"
          desabilitado={!emailValido(email) || !senha}
          aoPressionar={testarLogin}
        />
        <Botao
          titulo="Criar conta"
          variante="secundario"
          desabilitado={enviando}
          aoPressionar={() => navigation.navigate('Cadastro')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export function PerfilProvisorio() {
  const { sair } = useAuth();

  const avisar = useSnackbar();

  function confirmar() {
    Alert.alert(
      'Sair da conta?',
      'Para voltar, você vai precisar entrar de novo com e-mail e senha.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            void sair().catch(() =>
              avisar({
                tipo: 'erro',
                mensagem: 'Não foi possível sair da conta. Tente novamente.',
              }),
            );
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView className="flex-1 gap-4 bg-fundo p-4">
      <CabecalhoTela titulo="Perfil" />
      <Botao titulo="Sair" variante="perigo" aoPressionar={confirmar} />
    </SafeAreaView>
  );
}
