# Checklist de entrega — Mobile Application Development

Conferência de fechamento da Driven Soft para a Global Solution 2026/2. Os itens técnicos combinam inspeção do repositório, verificações executadas e testes funcionais das etapas anteriores validados por Lucas. A publicação e a conferência do APK exigem a versão final instalada.

## Requisitos de avaliação

| Requisito | Situação | Evidência ou ação para concluir |
| --- | --- | --- |
| 1. Telas e navegação (10) | ✅ Implementado | Nove telas além de Sobre, pilha protegida, abas por papel e ações de voltar. Os fluxos de cidadão e gestor foram validados. [Rotas](../src/routes) · [Telas](../src/screens) |
| 2. CRUD via API (30) | ✅ Implementado | Criação, listagem, detalhe, edição e exclusão chegam à API Java por Axios. O Oracle mantém os registros. A UI mostra carregamento, confirmação, snackbar e nova tentativa. A camada de erros cobre validação 400, sessão 401, permissão 403, ausência 404, conflito 409, rede e servidor. O mock fica restrito ao desenvolvimento. [Repository real](../src/repositories/ocorrenciaRepository.ts) · [Erros](../src/services/erroApi.ts) |
| 3. Autenticação (20) | ✅ Implementado | Cadastro e login reais com campos validados, indicação de envio e timeout. SecureStore restaura a sessão. Sair limpa sessão e cache. O interceptor trata 401 de uma sessão autenticada e a pilha retorna ao login. [Autenticação](../src/context/AuthContext.tsx) · [Cliente HTTP](../src/services/api.ts) |
| 4. Identidade e usabilidade (5) | ✅ Implementado no projeto | Inter, cores do Lares, ícones, estados acessíveis, áreas seguras e formulários com teclado. Ícone, primeiro plano adaptativo e splash personalizados em PNG de 1024 × 1024, referenciados na configuração Expo. Conferir a aparência do launcher e da abertura no APK distribuído. [Imagens](../assets/images) · [Configuração](../app.json) |
| 5. Arquitetura (20) | ✅ Conferido | Camadas por responsabilidade, TypeScript estrito e comandos de lint, tipos e formatação aprovados. As dependências têm uso direto, de configuração ou de suporte nativo. Por exemplo, a pilha usa Screens e a integração de estilos usa Reanimated e Worklets. [Configuração TypeScript](../tsconfig.json) · [Justificativas no README](../README.md#bibliotecas-e-ferramentas) |
| 6. Vídeo (10) | ⏳ Lucas e equipe | Publicar no YouTube, público ou não listado, com até cinco minutos. Substituir o marcador no README e incluir o mesmo link no arquivo de entrega. [Roteiro](GUIA_DE_APRESENTACAO.md#roteiro-do-vídeo-de-até-cinco-minutos) |
| 7. Distribuição e rastreabilidade (5) | ⏳ Lucas | A tela Sobre já lê o hash injetado na configuração. Gerar o APK no commit final, publicar no Firebase, convidar o professor e verificar a correspondência do hash no app instalado. [Configuração do hash](../app.config.js) · [Perfil EAS](../eas.json) · [Sobre](../src/screens/Sobre.tsx) |

## Conferências da seção 15 para evitar descontos

| Item | Situação |
| --- | --- |
| Histórico Git sequencial e legível | ✅ A sequência vai da fundação ao cliente HTTP, autenticação, telas, triagem, atendimento do gestor, robustez e documentação. Pode ser inspecionada com `git log --reverse --oneline develop`. |
| README presente | ✅ Inclui responsáveis, execução, contas de teste, arquitetura, bibliotecas, limitações e distribuição. |
| Professor com acesso ao GitHub | ⏳ Lucas deve obter o e-mail correto, convidá-lo como leitor ou colaborador e conferir o acesso ao repositório. |
| Arquivo de identificação íntegro | ⏳ Preparar e reabrir o `.txt` para conferir grupo, cinco nomes e RMs, URL do vídeo e URL do repositório. Registrar o e-mail usado no convite. |
| Entrega dentro do prazo e no portal | ⏳ Enviar uma entrega por matéria pelo Portal do Aluno até **19/11/2026 às 23h55** e guardar o comprovante. |
| Tema CitizenTech | ✅ O cidadão acompanha um problema urbano e a prefeitura prioriza o atendimento. A tela Sobre e o README identificam o tema. |
| Escopo das aulas | ✅ App React Native/Expo com navegação, consumo REST, CRUD, autenticação, componentes e estilos próprios. |
| Quantidade de telas | ✅ Nove telas elegíveis, mais Sobre. A tabela do README identifica os papéis e ações de cada tela. |
| Estilização e imagens | ✅ Tema e tipografia aplicados às telas. As três imagens usam a mesma casa branca do componente Logo. |
| Link do vídeo | ⏳ Verificar a reprodução por outra conta e abrir os links do README e do `.txt` antes de entregar. |
| APK publicado corresponde ao código | ⏳ Comparar os sete caracteres em **Perfil → Sobre o app** com o início do hash de `git rev-parse HEAD` no commit publicado. |

## Ordem das ações finais de Lucas

1. Confirmar com Henrique que a API no Render e as contas de demonstração estarão disponíveis para correção até **30/11**. Obter o e-mail do professor e conceder acesso ao GitHub.
2. Gravar e publicar o vídeo, trocar o marcador do README pelo link definitivo e commitar a alteração. Finalizar a integração em `main`, fazer o push da versão de entrega e anotar o hash.
3. A partir desse commit, gerar o APK com `npx eas-cli build -p android --profile apk`. No Firebase App Distribution, publicar o arquivo no aplicativo Android `br.com.fiap.drivensoft.lares` e adicionar o professor como tester.
4. Instalar pelo convite e testar em **dados móveis**. Conferir ícone, splash, login dos dois papéis, registro, fila, comentário no histórico, tratamento da demora da IA e hash da versão. Os cenários determinísticos de falha também podem ser ensaiados no mock local.
5. Preparar o `.txt`, revisar os links e enviar pelo portal. Para a apresentação de **23 a 27/11**, cada integrante deve conseguir explicar pelo menos um fluxo do toque ao banco e indicar onde faria uma mudança de requisito. [Guia de apresentação](GUIA_DE_APRESENTACAO.md)
