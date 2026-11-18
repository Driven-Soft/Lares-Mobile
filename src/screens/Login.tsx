import { useRef, useState } from 'react';
import { Keyboard, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import { Logo } from '../components/Logo';
import { FormularioConta } from '../components/FormularioConta';
import { AcordandoServidor } from '../components/AcordandoServidor';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import type { RotasRaiz } from '../routes/types';
import { mensagemDeErro, statusDoErro } from '../services/erroApi';
import { useAcordarServidor } from '../hooks/useAcordarServidor';
import { emailValido } from '../utils/texto';
import { cores } from '../theme/cores';

export function Login({ navigation }: NativeStackScreenProps<RotasRaiz, 'Login'>) {
  useAcordarServidor();

  const { entrar } = useAuth();

  const avisar = useSnackbar();

  const [email, definirEmail] = useState('');

  const [senha, definirSenha] = useState('');

  const [validar, mostrarValidacao] = useState(false);

  const [recusado, recusar] = useState(false);

  const [enviando, enviar] = useState(false);

  const emCurso = useRef(false);

  const erroEmail = validar && !emailValido(email) ? 'Informe um e-mail válido.' : undefined;

  const erroSenha = validar && !senha ? 'Informe sua senha.' : undefined;

  async function autenticar() {
    if (emCurso.current || !navigation.isFocused()) return;

    mostrarValidacao(true);

    if (!emailValido(email) || !senha) return;

    Keyboard.dismiss();
    emCurso.current = true;
    enviar(true);
    recusar(false);
    try {
      await entrar({ email: email.trim(), senha });
    } catch (erro) {
      if (statusDoErro(erro) === 401) {
        recusar(true);
      } else {
        avisar({ tipo: 'erro', mensagem: mensagemDeErro(erro), tentarNovamente: autenticar });
      }
    } finally {
      emCurso.current = false;
      enviar(false);
    }
  }

  return (
    <FormularioConta
      rodape={
        <Pressable
          disabled={enviando}
          accessibilityRole="link"
          className="min-h-toque items-center justify-center"
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text className="font-sans text-legenda text-texto-apoio">
            Ainda não tem conta? <Text className="font-sans-semibold text-verde">Criar conta</Text>
          </Text>
        </Pressable>
      }
    >
      <View className="items-center gap-2 pb-7 pt-12">
        <Logo mostrarNome={false} />
        <Text className="font-sans-bold text-4xl text-texto">lares</Text>
        <Text className="font-sans text-corpo text-texto-apoio">
          Seu bairro, <Text className="text-verde">cuidado</Text> por todos.
        </Text>
      </View>
      <Campo
        rotulo="E-mail"
        placeholder="seu@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={(v) => {
          definirEmail(v);
          recusar(false);
        }}
        erro={erroEmail}
        invalido={recusado}
        editable={!enviando}
      />
      <Campo
        rotulo="Senha"
        placeholder="Sua senha"
        secureTextEntry
        autoComplete="current-password"
        value={senha}
        onChangeText={(v) => {
          definirSenha(v);
          recusar(false);
        }}
        erro={erroSenha}
        invalido={recusado}
        editable={!enviando}
        onSubmitEditing={autenticar}
      />
      {recusado && (
        <View
          accessibilityLiveRegion="polite"
          className="flex-row gap-2 rounded-xl bg-erro-claro p-3"
        >
          <Feather name="alert-circle" size={17} color={cores.erro} />
          <Text className="flex-1 font-sans text-legenda text-erro">
            <Text className="font-sans-bold">E-mail ou senha incorretos.</Text> Confira os dados e
            tente de novo.
          </Text>
        </View>
      )}
      <Botao
        titulo="Entrar"
        aoPressionar={autenticar}
        carregando={enviando}
        textoCarregando="Entrando…"
      />
      {enviando && <AcordandoServidor />}
    </FormularioConta>
  );
}
