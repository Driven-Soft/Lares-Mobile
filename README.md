# Lares

App Android de zeladoria colaborativa da Driven Soft para a disciplina Mobile Application Development da Global Solution CitizenTech FIAP 2026/2.

## Links da entrega

| Recurso | Acesso |
| --- | --- |
| Código-fonte | [Driven-Soft/Lares-Mobile](https://github.com/Driven-Soft/Lares-Mobile)
| Vídeo no YouTube | `O preenchimento altera o hash do commit` |
| API Java | [Código-fonte](https://github.com/Driven-Soft/LaresApi-Java) · [Estado do serviço](https://laresapi-java.onrender.com/actuator/health) |


## Problema e solução

O cidadão registra um problema no bairro, a API faz a triagem por IA e o gestor atualiza o andamento do atendimento. O morador acompanha a resposta pelo app. O projeto apoia a manutenção dos espaços urbanos (ODS 11) e o acesso de moradores de diferentes bairros ao atendimento público (ODS 10).

## Telas e perfis

| Tela | Perfil | Função |
| --- | --- | --- |
| Login | Ambos | Entrar com e-mail e senha. |
| Criar conta | Cidadão | Cadastrar um morador. |
| Minhas ocorrências | Cidadão | Consultar os próprios relatos e iniciar um registro. |
| Nova/Editar ocorrência | Cidadão | Informar a descrição e o bairro do problema. |
| Detalhe | Ambos | Ver a análise e o histórico da ocorrência. |
| Bairro | Cidadão | Buscar ocorrências por bairro e status. |
| Fila | Gestor | Consultar ocorrências por prioridade. |
| Atualizar status | Gestor | Alterar o andamento e comentar para o morador. |
| Perfil | Ambos | Consultar os dados da conta e sair. |
| Sobre | Ambos | Conferir versão, equipe e commit do app. |

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| React Native + Expo 58 | Aplicativo Android. |
| TypeScript | Tipagem das telas e dos dados da API. |
| React Navigation | Navegação em pilha e abas por perfil. |
| TanStack React Query | Cache, paginação e acompanhamento da triagem. |
| Axios | Requisições HTTP autenticadas. |
| SecureStore | Armazenamento protegido da sessão. |
| NativeWind + Tailwind | Estilos dos componentes. |
| Inter | Fonte da interface. |

Tela → Hook → Repository → Axios → API Java.

## Estrutura de src/

```text
components/    Componentes de interface compartilhados
config/        Configuração do aplicativo e do cache
context/       Sessão do usuário e avisos globais
hooks/         Consultas, ações e localização
models/        Tipos dos dados e contratos da API
repositories/  Operações de acesso aos dados
routes/        Pilha e abas por perfil
screens/       Telas do aplicativo
services/      Cliente HTTP, erros e armazenamento da sessão
theme/         Cores e rótulos da interface
utils/         Regras de status, datas e validações
```

## Como executar

Pré-requisitos: Node.js 22.13+, npm e Expo Go compatível com o SDK 58. Na raiz do projeto, execute os comandos para o seu sistema.

**PowerShell**
```powershell
npm install
Copy-Item .env.example .env.local
npx expo start
```

**macOS/Linux**
```sh
npm install
cp .env.example .env.local
npx expo start
```

O arquivo `.env.local` usa `EXPO_PUBLIC_API_URL=https://laresapi-java.onrender.com`. A API no Render pode demorar a acordar no primeiro acesso.

## Contas de demonstração da API

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Cidadão | `cidadao.teste@example.com` | `CidadaoDemo2026!` |
| Gestor | `gestor.teste@example.com` | `GestorDemo2026!` |

## Equipe Driven Soft

| Integrante | RM |
| --- | --- |
| Felipe Bezerra Beatrici | 564723 |
| Henrique Cunha Torres | 565119 |
| Lucas da Silva Lima | 562118 |
| Max Hayashi Batista | 563717 |
| Yasmin Nathalin Miranda dos Santos | 561365 |
