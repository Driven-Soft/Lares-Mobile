import { useRef, useState } from 'react';
import { Keyboard, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAcordarServidor } from '../hooks/useAcordarServidor';
import { AcordandoServidor } from '../components/AcordandoServidor';
import { FormularioConta } from '../components/FormularioConta';
import { Botao } from '../components/Botao';
import { Campo } from '../components/Campo';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import type { RotasRaiz } from '../routes/types';
import { mensagemDeErro, camposDoErro, statusDoErro, tempoEsgotado } from '../services/erroApi';
import { emailValido, senhaValida } from '../utils/texto';
import { cores } from '../theme/cores';

export function Cadastro({ navigation }: NativeStackScreenProps<RotasRaiz, 'Cadastro'>) {
  const { registrar } = useAuth();

  const avisar = useSnackbar();

  const [dados, definirDados] = useState({ nome: '', email: '', senha: '', confirmacao: '' });

  const [erros, definirErros] = useState<Record<string, string>>({});

  const [enviando, enviar] = useState(false);

  const emCurso = useRef(false);

  const [semConfirmacao, definirSemConfirmacao] = useState(false);

  useAcordarServidor();

  function alterar(campo: keyof typeof dados, valor: string) {
    definirSemConfirmacao(false);
    definirDados((anterior) => ({ ...anterior, [campo]: valor }));
    definirErros((anterior) => ({ ...anterior, [campo]: '' }));
  }

  async function cadastrar() {
    if (emCurso.current || !navigation.isFocused()) return;

    const { senha, confirmacao } = dados;

    const nome = dados.nome.trim();

    const email = dados.email.trim();

    const problemas: Record<string, string> = {};

    if (!nome) problemas.nome = 'Informe seu nome.';

    if (!emailValido(email)) problemas.email = 'Informe um e-mail válido.';

    if (!senhaValida(senha)) problemas.senha = 'A senha precisa ter pelo menos 8 caracteres.';

    if (senha.length > 72) problemas.senha = 'A senha pode ter no máximo 72 caracteres.';

    if (!confirmacao || senha !== confirmacao) problemas.confirmacao = 'As senhas não são iguais.';

    definirErros(problemas);

    if (Object.keys(problemas).length) return;

    Keyboard.dismiss();
    emCurso.current = true;
    definirSemConfirmacao(false);
    enviar(true);
    try {
      await registrar({ nome, email, senha });

      if (navigation.isFocused()) {
        navigation.goBack();
        avisar({ tipo: 'sucesso', mensagem: 'Conta criada! Agora é só entrar.' });
      }
    } catch (erro) {
      if (!navigation.isFocused()) return;

      const campos = camposDoErro(erro);

      if (tempoEsgotado(erro)) definirSemConfirmacao(true);
      else if (statusDoErro(erro) === 409)
        definirErros({ email: 'Este e-mail já tem conta. Entre ou use outro.' });
      else if (statusDoErro(erro) === 400 && campos && Object.keys(campos).some((c) => c in dados))
        definirErros(campos);
      else avisar({ tipo: 'erro', mensagem: mensagemDeErro(erro), tentarNovamente: cadastrar });
    } finally {
      emCurso.current = false;
      enviar(false);
    }
  }

  return (
    <FormularioConta
      rodape={
        <View className="items-center">
          <Pressable
            accessibilityRole="link"
            disabled={enviando}
            className="min-h-12 justify-center"
            onPress={navigation.goBack}
          >
            <Text className="font-sans-semibold text-verde">Já tenho conta</Text>
          </Pressable>
          <Text className="text-center font-sans text-legenda text-texto-apoio">
            Contas de gestor são criadas pela prefeitura.
          </Text>
        </View>
      }
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        disabled={enviando}
        onPress={navigation.goBack}
        className="min-h-12 min-w-12 justify-center self-start"
      >
        <Feather name="arrow-left" size={22} color={cores.texto} />
      </Pressable>
      <View className="gap-1">
        <Text accessibilityRole="header" className="font-sans-bold text-titulo text-texto">
          Criar conta
        </Text>
        <Text className="font-sans text-corpo text-texto-apoio">
          Para registrar e acompanhar os problemas do seu bairro.
        </Text>
      </View>
      <Campo
        rotulo="Nome"
        placeholder="Seu nome completo"
        autoComplete="name"
        maxLength={100}
        editable={!enviando}
        value={dados.nome}
        erro={erros.nome}
        onChangeText={(v) => alterar('nome', v)}
      />
      <Campo
        rotulo="E-mail"
        placeholder="seu@email.com"
        autoComplete="email"
        autoCapitalize="none"
        keyboardType="email-address"
        maxLength={150}
        editable={!enviando}
        value={dados.email}
        erro={erros.email}
        onChangeText={(v) => alterar('email', v)}
      />
      <Campo
        rotulo="Senha"
        placeholder="Crie uma senha"
        autoComplete="new-password"
        secureTextEntry
        editable={!enviando}
        value={dados.senha}
        erro={erros.senha}
        dica="Pelo menos 8 caracteres."
        onChangeText={(v) => alterar('senha', v)}
      />
      <Campo
        rotulo="Confirmar senha"
        placeholder="Repita a senha"
        secureTextEntry
        editable={!enviando}
        value={dados.confirmacao}
        erro={erros.confirmacao}
        onChangeText={(v) => alterar('confirmacao', v)}
        onSubmitEditing={cadastrar}
      />
      {semConfirmacao && (
        <View accessibilityLiveRegion="polite" className="gap-2 rounded-xl bg-erro-claro p-3">
          <Text className="font-sans text-corpo text-texto">
            Não recebemos a confirmação do cadastro. A conta pode ter sido criada. Tente entrar com
            o mesmo e-mail e senha.
          </Text>
          <Botao titulo="Ir para o login" variante="secundario" aoPressionar={navigation.goBack} />
        </View>
      )}
      {enviando && <AcordandoServidor />}
      <Botao
        titulo="Criar conta"
        aoPressionar={cadastrar}
        carregando={enviando}
        textoCarregando="Criando conta…"
      />
    </FormularioConta>
  );
}
