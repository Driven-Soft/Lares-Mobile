# LARES MOBILE — Etapas de execução para o Codex

> **Este arquivo substitui a seção 12 (“Plano em etapas”) e as estimativas internas de calendário do `LARES_MOBILE_HANDOFF_CODEX.md`.** Siga a ordem e os critérios de aceite. Os prazos oficiais de entrega e apresentação continuam valendo.
> Todas as referências do tipo “§10 Tela 5” apontam para seções do `LARES_MOBILE_HANDOFF_CODEX.md` (que continua sendo a fonte de verdade para contrato da API, telas, identidade visual e regras). Em caso de conflito vale a hierarquia da §0.1 do handoff (PDF > `Lares_Lucas.md` > prints > handoff).

---

## Regras que valem em TODAS as etapas

1. **Uma etapa por vez.** Ao terminar, **pare** e entregue o relatório (modelo no fim deste arquivo). Só comece a próxima quando o Lucas mandar.
2. **Portões obrigatórios antes de cada commit e no fim da etapa:** `npm run typecheck` ✅ e `npm run lint` ✅ (zero erros, zero warnings). Rode `npm run format` antes de commitar.
3. **Git:** commits pequenos e sequenciais, em português, padrão `tipo: descrição` (`feat`, `fix`, `chore`, `refactor`, `docs`, `style`). **Um commit por tela no mínimo.** Sem `--force`, sem `squash`, sem reescrever histórico. Se não puder dar `push`, deixe os commits locais e avise.
4. Não inventar endpoints, campos, telas ou funcionalidades. Dúvida bloqueante → **pergunte**, não adivinhe.
5. Não alterar a API. Problemas da API vão em “Pendências” no relatório.
6. Textos de interface em pt-BR, **literais** como nos prints e na §10 do handoff.
7. Telas **não** chamam Axios: tela → hook → repository → `services/api`.
8. Nunca commitar segredos nem `.env.local`.
9. Dependências só via `npx expo install` e só as listadas na §3 do handoff.

**Modelo/esforço sugerido por etapa** (o Lucas escolhe no seletor do Codex): indicado em cada etapa. Regra geral: **Astra + esforço alto** onde há regra de negócio ou integração delicada; **Sol + esforço médio** nas telas que seguem padrão já criado.

---

## Visão geral (8 etapas)

| # | Etapa | Entrega principal | Modelo sugerido |
| --- | --- | --- | --- |
| 1 | Fundação | Projeto Expo configurado, tema, modelos, utilitários e componentes base | Astra · alto |
| 2 | API, sessão e navegação | Axios, SecureStore, AuthContext, Snackbar, gate de rotas e abas por papel | Astra · alto |
| 3 | Autenticação e conta | Telas Login, Cadastro, Perfil e Sobre o app | Sol · médio |
| 4 | Fluxo do cidadão (registro) | Minhas ocorrências + Nova/Editar ocorrência (com localização) | Sol · médio |
| 5 | Detalhe e acompanhamento da IA | Tela Detalhe completa (3 versões, polling, linha do tempo, exclusão) | Astra · alto |
| 6 | Bairro, Fila e Atualizar status | Telas 6, 7 e 8 (busca do cidadão e fluxo do gestor) | Sol · médio/alto |
| 7 | Robustez e qualidade | Modo mock, casos de falha da IA, acessibilidade, revisão geral | Astra · alto |
| 8 | Documentação e fechamento | README, guia de apresentação, ícone/splash, checklist final | Sol · médio |

---

## Etapa 1 — Fundação

**Objetivo:** deixar o projeto pronto para receber telas, sem nenhuma tela de negócio ainda.

**Antes de codar:** leia o handoff completo, o `Lares_Lucas.md`, o PDF e os prints. Responda em até 8 linhas: o que entendeu, o que vai construir nesta etapa e **dúvidas bloqueantes** (se não houver, diga “nenhuma”).

**Escopo**
- Conferir o histórico e a branch do remoto Lares-Mobile antes de inicializar o Expo na pasta MobileGS. Se o remoto tiver commits, partir desse histórico.
- Configuração: `package.json` (§3), `babel.config.js`, `metro.config.js`, `global.css`, `tailwind.config.js` (tokens da §8), `nativewind-env.d.ts`, `tsconfig.json` (strict), `.prettierrc`, ESLint, `.gitignore`, `.env.example`, `app.json`, `app.config.js` (hash do commit, §4.3), `eas.json` (§4.4), `index.ts`, `App.tsx` (carrega Inter e segura a splash).
- Estrutura de pastas da §5.
- `theme/cores.ts` (§8.2), `models/*` + `models/index.ts` (§7), `utils/` (datas — **uma** função central de formatação —, `proximoStatus`, `podeEditarOuExcluir`, `haQuantosDias`, `passoDoStatus`, validações de e-mail e senha, iniciais do nome).
- Componentes base em `components/`: `Logo`, `Botao` (primário/secundário/perigo + carregando), `Campo` (rótulo, erro, dica, olho de senha, contador), `Etiqueta` (status/prioridade), `Cartao`, `EsqueletoCartao`, `EstadoVazio`, `EstadoErro`, `CabecalhoTela`, `Chip`, `SeletorModal`.
- `README.md` inicial (esqueleto da §13).

**Aceite**
- `typecheck` e `lint` passam; `npx expo start` abre o app com fonte Inter e uma tela temporária usando `Logo`, `Botao`, `Campo` e `Etiqueta`.
- Nenhuma dependência do Fidelis que não faça sentido no Lares (§3.3).
- Componentes tipados, sem chamada à API e usando os tokens do tema (sem hex solto, exceto em `theme/`).

**Commits sugeridos:** `chore: inicializa projeto Expo com TypeScript` · `chore: configura NativeWind, ESLint e Prettier` · `chore: configura app.config.js com hash do commit e eas.json` · `feat: adiciona tema, modelos e utilitários` · `feat: adiciona componentes base de interface` · `docs: adiciona README inicial`.

---

## Etapa 2 — API, sessão e navegação

**Objetivo:** infraestrutura de rede, autenticação e rotas protegidas funcionando de ponta a ponta (ainda com telas provisórias).

**Escopo**
- `services/api.ts` (Axios, `baseURL` de `EXPO_PUBLIC_API_URL`, timeout ~20 s; **90 s** para login/registro), interceptor de request (Bearer) e de response (**401 → logout automático** com snackbar “Sua sessão expirou. Entre novamente.”, exceto no 401 do próprio login) — §9.1.
- `services/erroApi.ts` (`mensagemDeErro`, `camposDoErro`) — §9.2.
- `services/sessaoStorage.ts` (SecureStore, chave `lares.sessao`).
- `context/AuthContext.tsx` (estados `restaurando | autenticado | nao-autenticado`; `entrar`, `registrar`, `sair`; **logout limpa SecureStore e `queryClient.clear()`**).
- `context/SnackbarContext.tsx` + componente `Snackbar` (sucesso/erro, ação “Tentar de novo”, some em ~4 s, fica acima de botões fixos/aba) — §8.5.
- `config/queryClient.ts` e providers no `App.tsx`.
- `repositories/authRepository.ts` (`login`, `registrar`) e `repositories/usuarioRepository.ts` (`buscarMe`).
- Navegação (`routes/`): `AppNavigation`, `RootStack` (gate: sem sessão → Login/Cadastro; com sessão → `Tabs` + telas empilhadas `Detalhe`, `FormOcorrencia`, `AtualizarStatus`, `Sobre`), `CidadaoTabs` (Minhas ocorrências · Bairro · Perfil), `GestorTabs` (Fila · Perfil), `types.ts`. Abas com ícones e pílula verde-clara na aba ativa (§8.5).
- Telas **provisórias** (apenas título) para todas as rotas, só para validar a navegação. Com sessão de cidadão a aba inicial é “Minhas ocorrências”; de gestor, “Fila”.

**Aceite**
- Com os usuários de teste da §6.3, é possível entrar via tela provisória/ação temporária e ver as abas corretas por papel; reabrir o app restaura a sessão; sair apaga a sessão e volta ao login.
- Sem sessão, rotas restritas **não existem** na árvore de navegação.
- Um 401 em qualquer chamada autenticada derruba a sessão.
- Nenhuma tela chama Axios diretamente.

**Commits sugeridos:** `feat: adiciona cliente Axios com interceptors e tratamento de erros` · `feat: adiciona contexto de sessão com SecureStore` · `feat: adiciona snackbar global` · `feat: adiciona repositories de autenticação e usuário` · `feat: adiciona navegação com rotas protegidas e abas por papel`.

---

## Etapa 3 — Autenticação e conta (Telas 1, 2, 9 e 10)

**Objetivo:** fluxo completo de acesso e a área de conta.

**Escopo** (detalhes literais na §10)
- **Tela 1 Login:** logo, campos, olho de senha, erro “E-mail ou senha incorretos.”, carregando com cartão **“Acordando o servidor…”**, link para Cadastro, snackbar de “Conta criada! Agora é só entrar.”
- **Tela 2 Cadastro:** validações locais (nome, e-mail, senha ≥ 8, confirmação), erro 409 “Este e-mail já tem conta. Entre ou use outro.”, mapeamento de `campos` do 400, sucesso volta ao Login com snackbar.
- **Tela 9 Perfil:** avatar com iniciais, nome, e-mail (`GET /usuarios/me` via `useUsuarioMe`), selo “Conta de cidadão/gestor”, linha “Sobre o app”, botão “Sair” com `Alert` de confirmação.
- **Tela 10 Sobre o app:** logo, “Versão 1.0.0”, **hash do commit** (de `Constants.expoConfig.extra.commitHash`), texto institucional, pílula “Tema CitizenTech”, cartão “EQUIPE DRIVEN SOFT” com os 5 nomes na ordem da §10.

**Aceite**
- Login e cadastro reais contra `https://laresapi-java.onrender.com` (ou a URL configurada), com loaders, validação e mensagens de erro de todos os casos (credenciais erradas, e-mail duplicado, senha curta, sem rede/timeout).
- Logout funcional pelo Perfil; reabrir o app sem sessão cai no Login.
- “Sobre o app” mostra um hash real (ou `indisponivel` fora de um repositório git).

**Commits sugeridos:** `feat: adiciona tela de login` · `feat: adiciona tela de cadastro` · `feat: adiciona tela de perfil com logout` · `feat: adiciona tela sobre o app com hash do commit`.

---

## Etapa 4 — Fluxo do cidadão: registrar e listar (Telas 3 e 4)

**Objetivo:** o cidadão consegue ver suas ocorrências e criar/editar uma.

**Escopo**
- `repositories/ocorrenciaRepository.ts`: `listarMinhas`, `criar`, `atualizar` (e já deixe `buscarPorId`, `excluir`, `buscar`, `atualizarStatus` tipados se fizer sentido, sem uso ainda).
- Hooks: `useMinhasOcorrencias` (`useInfiniteQuery`, chave com `usuarioId`), `useCriarOcorrencia`, `useAtualizarOcorrencia` (invalidações corretas), `useLocalizacao` (permissão + `getCurrentPositionAsync` + `reverseGeocodeAsync`).
- Componente `CartaoOcorrencia` (status, data, descrição 2 linhas, bairro, “Aguardando a IA” ou categoria + prioridade).
- **Tela 3 Minhas ocorrências:** “Olá, {nome}”, lista paginada, FAB “+ Nova ocorrência”, estados **esqueleto / vazio / erro / “Carregando mais…” / puxar para atualizar** (§10 Tela 3).
- **Tela 4 Nova/Editar:** textarea com contador `n/500`, bairro, botão “Usar minha localização” (mensagens da §10), cartão informativo da IA, botão “Enviar/Salvar” com carregando, validação local + `campos` do servidor. Sucesso da Nova leva ao **Detalhe** (provisório nesta etapa) com snackbar “Ocorrência enviada.”

**Aceite**
- Criar uma ocorrência real e vê-la aparecer na lista (status `RECEBIDA`, “Aguardando a IA”); paginação e refresh funcionam. Validar o formulário de edição nesta etapa e o caminho completo Detalhe → Editar → Salvar na Etapa 5.
- Localização preenche bairro, latitude e longitude (e lida com permissão negada).
- Validar a lista vazia com uma conta sem ocorrências e a falha de rede em uma consulta sem dados em cache.

**Commits sugeridos:** `feat: adiciona repository e hooks de ocorrências` · `feat: adiciona tela de minhas ocorrências` · `feat: adiciona formulário de nova ocorrência` · `feat: adiciona edição de ocorrência` · `feat: adiciona uso da localização no formulário`.

---

## Etapa 5 — Detalhe e acompanhamento da IA (Tela 5)

**Objetivo:** a tela mais importante do app, com as 3 versões e o fluxo assíncrono da triagem.

**Escopo** (§9.4, §9.5 e §10 Tela 5)
- Antecipar nesta etapa os dados de teste de triagem parada, textos ausentes e prazo nulo para reproduzir esses casos no Detalhe. Na Etapa 7, repetir os cenários no fluxo completo.
- `useOcorrencia(id)` com **`refetchInterval` em função**: 3 s enquanto `RECEBIDA` e antes do limite de ~3 min contados desde a abertura da tela; para ao mudar de status, ao desmontar e após o limite.
- Componentes: `ProgressoStatus` (“Passo n de 4”, 4 segmentos na cor do status), `AnaliseIA` (estados: analisando com esqueleto / demorando / “Sem triagem” para o gestor / resultado com categoria·prioridade·prazo e “—” quando nulo / caixa de texto que **some** se o campo for nulo), `LinhaDoTempo` (mais recente primeiro; autor “IA” quando `usuarioNome` é nulo; textos padrão quando `comentario` é nulo; “AGORA” opcional).
- **Três versões do rodapé:** dono (Editar/Excluir só em `RECEBIDA`/`TRIADA`), outro cidadão (somente leitura + “Só quem registrou pode editar ou excluir.”), gestor (“Atualizar status”, some em `RESOLVIDA`). Título da caixa de texto: “Mensagem para você” (dono), “Mensagem ao morador” (outro cidadão), “Resumo para a gestão” (gestor).
- **Excluir:** `Alert` com os textos literais → `DELETE` → volta à lista, invalida caches, snackbar “Ocorrência excluída.”
- Estados: esqueleto, erro com “Tentar novamente”, 404 amigável, puxar para atualizar. Snackbars vindos de outras telas aparecem acima do botão fixo.
- **Resolver o item 6.4-1 do handoff (fuso das datas)** testando com uma ocorrência real recém-criada e registrar a decisão no relatório.

**Aceite**
- Validar Detalhe → Editar → Salvar com o dono de uma ocorrência editável e conferir os dados ao retornar.
- Criar uma ocorrência e acompanhar “Analisando…” virar “Triada” sozinho; depois de ~3 min sem triagem, a mensagem “A análise está demorando…” aparece e o polling para.
- `TRIADA` sem `resumoIa`/`mensagemCidadao` mostra categoria, prioridade e prazo **sem** a caixa de texto.
- Editar e Excluir só aparecem para o dono nos status permitidos; o gestor vê o botão de status (que leva à tela provisória até a Etapa 6).
- Datas exibidas no horário correto do Brasil.

**Commits sugeridos:** `feat: adiciona tela de detalhe com progresso e linha do tempo` · `feat: adiciona análise da IA com acompanhamento da triagem` · `feat: adiciona versões do detalhe por papel e dono` · `feat: adiciona exclusão de ocorrência` · `fix: corrige exibição de datas conforme fuso do servidor` (se necessário).

---

## Etapa 6 — Bairro, Fila e Atualizar status (Telas 6, 7 e 8)

**Objetivo:** completar o ciclo: cidadão busca no bairro; gestor prioriza e muda o status.

**Escopo**
- `ocorrenciaRepository.buscar` (`bairro`, `status`, `sort`, `page`, `size`) e `atualizarStatus`; `categoriaRepository.listar` + `useCategorias`.
- **Tela 6 Bairro:** busca com debounce (~500 ms) e botão de localização, chips Todas/Recebida/Triada/Em andamento/Resolvida, contagem “N ocorrências encontradas em {bairro}”, estado “digite um bairro” quando vazio, lista paginada com os mesmos estados; abre o Detalhe (somente leitura se não for dono).
- **Tela 7 Fila:** chips Triadas (padrão)/Recebidas/Em andamento/Resolvidas com **`sort=prioridade`**, contagem com singular/plural, filtro de bairro (pílula + `Modal`), cartão da fila (prioridade + categoria, “há N dias”, bairro, “Prazo: N dias”, **“Sem triagem”** quando não há categoria).
- **Tela 8 Atualizar status:** resumo da ocorrência, **radio único** com o próximo status permitido (`RECEBIDA`/`TRIADA` → Em andamento; `EM_ANDAMENTO` → Resolvida) e dica de transição, seletor de categoria (sugestão da IA; **obrigatório** se não houver categoria), comentário até 255 com contador, botão “Confirmar”. Envia `categoriaId` **somente** se o gestor trocou ou se não havia categoria. Sucesso: invalida detalhe e fila, volta ao Detalhe com snackbar “Status atualizado para {Rótulo}.”; 409 → mensagem + recarregar.

**Aceite**
- Com o usuário gestor de teste: a fila vem ordenada ALTA → MÉDIA → BAIXA; mudar o status de uma ocorrência a faz sair da aba “Triadas” e aparecer em “Em andamento”, e o cidadão dono vê o novo item na linha do tempo.
- Transições inválidas **não** são oferecidas pela interface.
- Bairro mostra ocorrências de outros cidadãos em somente leitura.

**Commits sugeridos:** `feat: adiciona tela de ocorrências do bairro` · `feat: adiciona fila do gestor ordenada por prioridade` · `feat: adiciona tela de atualizar status` · `feat: adiciona seletor de categorias`.

---

## Etapa 7 — Robustez e qualidade

**Objetivo:** garantir que o app aguenta falhas reais e atende aos critérios de qualidade do PDF.

**Escopo**
- **Modo mock** opcional (`EXPO_PUBLIC_USE_MOCK=true`): escolher a implementação real ou `repositories/mock/*` (mesma assinatura dos repositories). Cenários: ocorrência nasce `RECEBIDA` e vira `TRIADA` ~5 s depois; **uma que nunca sai de `RECEBIDA`**; **uma `TRIADA` sem `resumoIa` e `mensagemCidadao`**; uma com `prazoEstimadoDias` nulo; uma erro de rede simulado. O mock **não** pode ficar ligado por padrão nem vazar para o build de produção.
- Percorrer e **corrigir** os casos da §9.4 (demora, IA fora do ar, Spring AI fora do ar, prazo nulo, correção do gestor) em todas as telas afetadas (Minhas, Detalhe, Fila, Atualizar status).
- **Acessibilidade e guidelines (§11):** `accessibilityRole/Label/State`, alvos ≥ 44 dp, contraste, `accessibilityLiveRegion` em erros e snackbars, `KeyboardAvoidingView` em formulários, áreas seguras, botão voltar do sistema, telas pequenas (360×640) sem corte.
- **Auditoria de arquitetura (§5):** nenhuma tela chamando Axios; sem hex solto; sem `any`; sem código morto; sem `console.log`; dependências realmente usadas; `memo`/`useCallback` nos itens de lista onde faz sentido.
- Revisar tratamento de todos os códigos de erro (400/401/403/404/409/rede/5xx) em todos os fluxos.

**Aceite**
- Lista de verificação manual descrita no relatório (cada caso da §9.4 testado e como).
- `typecheck` e `lint` zerados; `npm run format` sem diferenças.
- Fluxo completo sem crash: cadastro → login → nova ocorrência → triagem → bairro → logout → gestor → fila → atualizar status → cidadão vê a atualização.

**Commits sugeridos:** `feat: adiciona modo mock para testar falhas da IA` · `fix: trata casos de falha da triagem nas telas` · `style: melhora acessibilidade e responsividade` · `refactor: revisa camadas e remove código não utilizado`.

---

## Etapa 8 — Documentação e fechamento

**Objetivo:** deixar o repositório pronto para entrega e para a apresentação.

**Escopo**
- **Identidade/imagens (requisito 4):** `icon.png` (1024×1024), `adaptive-icon.png`, `splash-icon.png` conforme o logo da §8.1, referenciados no `app.json`. Se não for possível gerar as imagens aqui, deixe um `TODO` claro para o Lucas fornecê-las (e **não** use o ícone padrão do Expo no build final).
- **`README.md` final** (§13): links (vídeo como `A_PREENCHER_PELO_LUCAS`), integrantes, problema/solução, telas, arquitetura, **justificativa de cada biblioteca**, estrutura de pastas, como executar (API local × Render, `10.0.2.2`/IP), variáveis de ambiente, usuários de teste, como o hash é gerado, build/publicação (EAS → Firebase), limitações conhecidas.
- **`docs/GUIA_DE_APRESENTACAO.md`** (pt-BR): diagrama das camadas; fluxos “do toque ao banco” de login, criação de ocorrência e atualização de status; mapa “onde fica cada coisa”; justificativa das decisões técnicas (React Query, Axios + interceptors, SecureStore, NativeWind, estrutura de pastas, polling da triagem); e **“onde mexer”** para mudanças de requisito prováveis (novo status, novo campo, nova aba, trocar URL da API, novo filtro, trocar provedor de autenticação).
- **Checklist final (§15):** conferir item por item e reportar o que está ✅ e o que depende do Lucas.
- Conferir `package.json` (nada sobrando), `.env.example`, `.gitignore`, `eas.json`, `app.config.js`.
- Listar para o Lucas as tarefas dele (§14 do handoff): e-mail do professor, push, APK pelo EAS **depois do último commit**, Firebase com o professor como tester, teste com dados móveis, vídeo ≤ 5 min no YouTube, `.txt` e Portal do Aluno.

**Aceite**
- README completo (nenhuma seção vazia além do link do vídeo); guia de apresentação escrito; checklist da §15 conferido com evidências.
- `typecheck`, `lint` e `format` limpos; histórico de commits sequencial e legível (`git log --oneline` revisado e descrito no relatório).

**Commits sugeridos:** `feat: adiciona ícone, splash e imagens do Lares` · `docs: finaliza README` · `docs: adiciona guia de apresentação` · `chore: revisão final de lint e formatação`.

---

## Modelo de relatório ao fim de cada etapa

```
ETAPA N — <nome> — CONCLUÍDA
Feito: <3–6 itens curtos>
Como testar: <passos objetivos, usuário/senha de teste, o que esperar>
Portões: typecheck ✅/❌ · lint ✅/❌ · format ✅/❌
Commits: <lista do git log --oneline da etapa>
Decisões tomadas: <o que decidiu quando o documento deixou em aberto>
Pendências / dúvidas: <API, dados faltantes, itens que dependem do Lucas>
Próxima etapa: <nome> — aguardando liberação
```

## Prompt para iniciar cada etapa (o Lucas cola no Codex)

> Execute **apenas a Etapa N** do arquivo `ETAPAS_CODEX.md`, seguindo o `LARES_MOBILE_HANDOFF_CODEX.md`, o `Lares_Lucas.md`, o `mobile-gs.pdf` e os prints. Respeite as regras gerais, rode `typecheck` e `lint`, faça os commits sugeridos e **pare** com o relatório no modelo do arquivo. Não avance para a próxima etapa.

