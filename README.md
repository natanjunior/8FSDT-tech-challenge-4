# Tech Challenge Fase 4 — Frontend Mobile (React Native)

Frontend mobile do sistema de blogging educacional, consumindo a API da Fase 2.

> **Status do projeto:** Em desenvolvimento — Fase 1 (Fundação + Login) concluída.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Runtime | Expo SDK 56 |
| Linguagem | TypeScript (strict) |
| Estilização | NativeWind v4 (Tailwind v3) |
| Forms | react-hook-form + Zod v4 |
| HTTP | Axios |
| Estado global | Context API (`AuthContext`) |
| Navegação | React Navigation v7 (Native Stack) |
| Armazenamento seguro | expo-secure-store |
| Testes | Jest + @testing-library/react-native |

## Setup

### Pré-requisitos

- Node.js 20+ (recomendado: 20.19.x ou 22.x)
- npm 9+
- Backend da Fase 2 rodando e acessível

### Passos

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env e ajuste EXPO_PUBLIC_API_URL conforme o ambiente:
#   - iOS simulator / web: http://localhost:3030
#   - Android emulator:    http://10.0.2.2:3030
#   - Dispositivo físico:  http://<IP-DO-HOST>:3030

# 3. Subir o backend da Fase 2 (em outro terminal)

# 4. Iniciar o app
npm start
# Pressione 'i' (iOS), 'a' (Android) ou 'w' (web)
```

### Variáveis de ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `EXPO_PUBLIC_API_URL` | URL base da API da Fase 2 | Sim |

## Scripts

```bash
npm start          # Inicia o Metro bundler
npm run android    # Inicia no Android emulator
npm run ios        # Inicia no iOS simulator
npm test           # Roda testes com Jest
npm run test:watch # Watch mode
npm run lint       # ESLint (via expo lint)
```

## Autenticação

A API da Fase 2 utiliza **login passwordless por e-mail**: o usuário informa o e-mail, o backend retorna um JWT se o e-mail estiver cadastrado.

O JWT é armazenado em [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/) e injetado automaticamente como `Authorization: Bearer <token>` por um interceptor do Axios.

```
LoginScreen
   ↓ submit (RHF + Zod)
AuthContext.login(payload)
   ↓
auth.service.login()
   ↓
POST /auth/login → { token, user }
   ↓
SecureStore.setItem (AUTH_TOKEN, AUTH_USER)
   ↓
AuthContext.user atualizado → guard troca AuthStack → AppStack
```

Na inicialização do app, o `AuthContext` faz **hydration**: lê `AUTH_TOKEN` e `AUTH_USER` do SecureStore e, se presentes, restaura a sessão sem exigir novo login.

## Decisões arquiteturais (ADRs)

Algumas escolhas divergem do conteúdo padrão das aulas — registradas aqui para transparência.

| ADR | Decisão | Motivo |
|-----|---------|--------|
| 01 | **Expo SDK 56 (managed workflow)** em vez de React Native CLI | DX mais rápido, OTA via EAS, builds sem Xcode/Android Studio nativos para a maior parte do ciclo. |
| 02 | **NativeWind v4** em vez de `StyleSheet.create` ensinado em aula | Continuidade visual com a Fase 3 (Tailwind) e produtividade. |
| 03 | **react-hook-form + Zod** em vez de inputs controlados manuais | Mesmo pattern adotado na Fase 3; menos re-renders e inferência TS automática. |
| 04 | **Context API (`AuthContext`)** em vez de Redux Toolkit (aula RN Medium 6) | Um único reducer (auth) não justifica boilerplate de Redux. Spec da Fase 4 permite Context. |
| 05 | **expo-secure-store** para o JWT, em vez de AsyncStorage | SecureStore criptografa nativamente (Keychain no iOS, Keystore no Android). |

## Próximas fases

- Fase 2 — Posts: leitura para aluno (lista, busca, detalhe, comentários)
- Fase 3 — Posts: escrita para professor (criar/editar)
- Fase 4 — Posts: administração (lista admin + delete)
- Fase 5 — Usuários: CRUD de professores e alunos

## Equipe

Grupo 28 — turma 8FSDT (FIAP).
