# GREENHERB API

API REST em Node.js para a plataforma GREENHERB, uma aplicacao de gestao inteligente de estufa de ervas aromaticas. Esta versao implementa o Sprint 1 com Express, Jest, JWT e dados em memoria.

## Requisitos

- Node.js
- npm

## Instalacao

```bash
npm install
```

## Arrancar a API

```bash
npm start
```

Por omissao, a API fica disponivel em:

```text
http://localhost:3000
```

Pode alterar a porta com a variavel de ambiente `PORT`.

## Executar testes

```bash
npm test
```

Os testes do Sprint 1 sao unitarios e focados na autenticacao. Testam diretamente o controller `auth.controller.login`, com mocks simples de `req` e `res`, sem iniciar o servidor Express e sem usar Supertest.

## Endpoints implementados

### Autenticacao

- `POST /auth/login`
- `POST /auth/refresh`

### Recursos com CRUD basico

Cada recurso abaixo inclui:

- `GET /`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

Recursos:

- `/users`
- `/herbs`
- `/plans`
- `/batches`
- `/tasks`
- `/measurements`
- `/alerts`
- `/automation`
- `/reports`
- `/audit`

## Autenticacao

O login recebe `username` e `password`.

Regras implementadas:

- ambos os campos sao obrigatorios;
- ambos devem ser strings;
- strings vazias ou apenas com espacos sao rejeitadas;
- username inexistente ou password incorreta devolvem `401`;
- credenciais validas devolvem `200`, dados minimos do utilizador e token JWT;
- a password nunca e devolvida na resposta.

Utilizadores iniciais em memoria:

| Username | Password | Role |
| --- | --- | --- |
| `tecnico` | `Tecnico123!` | `TECNICO` |
| `responsavel` | `Responsavel123!` | `RESPONSAVEL` |
| `admin` | `Admin123!` | `ADMIN` |

Exemplo de login:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"tecnico\",\"password\":\"Tecnico123!\"}"
```

O refresh aceita o token no corpo:

```json
{
  "token": "TOKEN_JWT"
}
```

ou no header:

```text
Authorization: Bearer TOKEN_JWT
```

## Dados em memoria

Nao existe base de dados real neste Sprint. Todos os dados estao em estruturas em memoria e sao reiniciados quando a API e reiniciada.

## Documentacao de testes

A matriz de rastreabilidade da autenticacao esta em:

```text
docs/matriz-rastreabilidade-auth.md
```
