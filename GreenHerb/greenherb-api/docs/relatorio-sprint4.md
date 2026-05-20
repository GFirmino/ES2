# Relatorio Auxiliar - Sprint 4 GREENHERB

## Objetivo

O Sprint 4 acrescenta testes de integracao aos endpoints REST da API GREENHERB. Ao contrario dos Sprints 1, 2 e 3, que focam testes unitarios, este sprint exercita a API via HTTP, validando headers, tokens JWT, payloads JSON, metodos HTTP, codigos de resposta e estrutura das respostas.

## Ferramentas

- Postman collection em JSON.
- Ambiente Postman local.
- Newman para execucao automatica.
- Relatorio Newman em JSON.

## Como correr

Terminal 1:

```bash
npm start
```

Terminal 2:

```bash
npm run test:integration
```

Os testes unitarios continuam disponiveis com:

```bash
npm test
```

## Endpoints cobertos

- `/health`
- `/auth/login`
- `/auth/refresh`
- `/users`
- `/herbs`
- `/herbs/import`
- `/plans`
- `/batches`
- `/batches/:id/state`
- `/tasks`
- `/measurements`
- `/alerts`
- `/automation`
- `/reports`
- `/audit`
- endpoints/metodos inexistentes ou nao suportados

## Tipos de input testados

- Headers `Authorization`, `Content-Type` e `Accept`.
- Tokens JWT validos, ausentes e sem permissao.
- JSON payload valido.
- JSON payload invalido.
- CSV dentro de payload JSON.
- Metodos HTTP validos e nao suportados.
- Respostas 2xx.
- Respostas 4xx.
- Resposta CSV.

## Localizacao

Colecao Postman:

```text
postman/greenherb-sprint4.postman_collection.json
```

Ambiente Postman:

```text
postman/local.postman_environment.json
```

Relatorio Newman:

```text
reports/newman-sprint4-report.json
```

Matriz de rastreabilidade:

```text
docs/matriz-rastreabilidade-sprint4.md
```

## Resultado de execucao

A execucao Newman validada no Sprint 4 terminou com:

```text
66 requests
109 assertions
0 failures
```

## Limitacoes conhecidas

- A persistencia continua em memoria.
- O upload real multipart de CSV/Excel nao foi implementado; a importacao usa `csvContent` no body ou texto CSV.
- A exportacao implementada e CSV; Excel real nao foi introduzido para evitar dependencias e complexidade fora do sprint.
- Para os testes de integracao, a API deve estar a correr em `http://localhost:3000`.
