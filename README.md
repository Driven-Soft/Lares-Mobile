# Lares

Seu bairro, cuidado por todos.

Aplicativo Android de zeladoria colaborativa da Driven Soft para a Global Solution CitizenTech da FIAP. Moradores relatam problemas urbanos e acompanham o atendimento pela prefeitura, contribuindo para os ODS 10 e 11.

## Execução

Instale as dependências com `npm ci`, copie `.env.example` para `.env.local` e execute `npm start`. Abra o projeto em um dispositivo com Expo Go compatível ou em um emulador Android. A Etapa 1 apresenta uma tela de teste da identidade visual e dos componentes de formulário.

Use `npm run format`, `npm run typecheck` e `npm run lint` antes de fazer commit. As features e correções partem de `develop` nas branches `feat/*` e `fix/*`. A branch `main` recebe as versões de entrega.

## Telas e papéis previstos

Para testar a triagem e as falhas sem acessar a API, defina `EXPO_PUBLIC_USE_MOCK=true` em `.env.local`, reinicie o Expo e recarregue o app. Entre com `cidadao@lares.test` ou `gestor@lares.test`, ambos com a senha fictícia `LaresTeste7`. Contas, sessão e ocorrências do mock ficam na memória até recarregar o aplicativo. Remova a variável e reinicie o Expo para voltar à API.

No mock, uma nova ocorrência recebe triagem após cerca de cinco segundos. A conta de cidadão já tem quatro casos identificados pela descrição no bairro Centro: recebida permanentemente, triada sem textos, prazo ausente e erro de conexão na primeira abertura do detalhe. No último caso, toque em **Tentar novamente** para recuperar.

Login, Cadastro, Minhas ocorrências, Nova/Editar ocorrência, Detalhe, Bairro, Fila, Atualizar status, Perfil e Sobre o app. Cidadãos registram ocorrências e gestores atualizam o atendimento. O detalhe apresenta a linha do tempo aos dois papéis.

## Arquitetura e tecnologias

O fluxo previsto é tela → hook → repository → API Java. A API coordena a triagem e devolve os resultados ao aplicativo.

- `src/components`, `src/theme` e `assets/images` concentram os componentes, tokens visuais e imagens. NativeWind aplica os estilos e as fontes Inter e os ícones Feather compõem a identidade.
- `src/models` descreve o contrato da API em TypeScript e `src/utils` reúne validações e regras de apresentação.
- `src/routes`, `src/screens`, `src/hooks`, `src/repositories`, `src/context`, `src/services` e `src/config` recebem a navegação, as telas e a integração nas próximas etapas.
- React Native e Expo executam o app. ESLint, Prettier e TypeScript verificam o código.

## Ambiente e publicação

`EXPO_PUBLIC_API_URL` configura a URL da API. Para uma API local, use `http://10.0.2.2:8080` no emulador Android ou o IP da máquina no aparelho físico. A autenticação e o uso das contas de teste entram nas etapas seguintes.

O perfil EAS `apk` gera o pacote Android para distribuição no Firebase App Distribution. O arquivo `app.config.js` lê o hash de sete caracteres do commit do build EAS ou do Git local. A publicação e o convite de testers fazem parte do fechamento.

## Links da entrega

- [Repositório](https://github.com/Driven-Soft/Lares-Mobile)
- [API Java](https://laresapi-java.onrender.com)
- Vídeo no YouTube — A_PREENCHER_PELO_LUCAS
- Firebase App Distribution — distribuição prevista no fechamento.

## Equipe Driven Soft

| Integrante | RM |
| --- | --- |
| Felipe Bezerra Beatrici | 564723 |
| Henrique Cunha Torres | 565119 |
| Lucas da Silva Lima | 562118 |
| Max Hayashi Batista | 563717 |
| Yasmin Nathalin Miranda dos Santos | 561365 |
