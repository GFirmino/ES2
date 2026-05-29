# GREENHERB API

API REST em Node.js para a plataforma GREENHERB, uma aplicacao de gestao inteligente de estufa de ervas aromaticas. Esta versao inclui o Sprint 1 com Express, Jest, JWT e dados em memoria, o Sprint 2 com testes unitarios de importacao de ervas e planos de cultivo, e o Sprint 3 com testes unitarios dos restantes requisitos de dominio.

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

Endpoints adicionais do Sprint 2:

- `POST /herbs/import`
- `POST /plans` com validacao de planos REGULAR, EMERGENCIA e PONTUAL

Endpoints adicionais usados no Sprint 4:

- `GET /health`
- `PATCH /batches/:id/state`
- `GET /batches/:id/productivity`
- `PATCH /alerts/:id`
- `GET /reports?format=csv`

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

## Sprint 2 — Testes unitários de importação e planos de cultivo

O Sprint 2 acrescenta logica de dominio e testes unitarios para:

- importacao do catalogo de ervas aromaticas a partir de CSV;
- criacao e validacao de planos de cultivo dos tipos REGULAR, EMERGENCIA e PONTUAL.

Os testes continuam a ser unitarios. Nao arrancam o servidor Express, nao usam Supertest e testam diretamente os services responsaveis pela logica de dominio.

Tecnicas aplicadas:

- particionamento de equivalencia para CSV valido, CSV vazio, cabecalho invalido, linhas validas, invalidas, duplicadas e vazias;
- particionamento de equivalencia para tipos de plano validos, tipo invalido, campos obrigatorios e autorizacao do plano PONTUAL;
- analise de valores limite para temperatura, humidade, luminosidade e duracao do ciclo;
- cobertura MC/DC para a regra composta do plano PONTUAL.

Para correr todos os testes:

```bash
npm test
```

Matriz de rastreabilidade do Sprint 2:

```text
docs/matriz-rastreabilidade-sprint2.md
```

Tabela MC/DC dos planos:

```text
docs/tabela-mcdc-planos.md
```

## Sprint 3 - Testes unitarios dos requisitos restantes

O Sprint 3 acrescenta services e testes unitarios para os restantes requisitos de dominio do GREENHERB:

- validacao de medicoes ambientais;
- geracao e classificacao de alertas;
- resolucao e ignorar alertas com justificacao obrigatoria;
- transicoes de estado de lotes;
- registo de perdas, divisao de lotes e calculo de produtividade;
- motor de automacao em modo MANUAL e AUTOMATICO;
- validacao de tarefas operacionais;
- controlo de acesso por perfil de utilizador;
- auditoria de operacoes relevantes;
- exportacao simples de relatorios em CSV.

Os testes do Sprint 3 sao unitarios e isolados. Nao usam Supertest, nao arrancam o servidor Express e chamam diretamente services testaveis.

Tecnicas aplicadas:

- particionamento de equivalencia para entradas validas, invalidas, ausentes e perfis de utilizador;
- analise de valores limite para humidade de medicoes e justificacao de alertas ignorados;
- cobertura de condicoes multiplas nas regras de lotes comprometidos;
- cobertura MC/DC para a decisao composta de alertas;
- cobertura MC/DC para a decisao composta de automacao.

Para correr todos os testes:

```bash
npm test
```

Matriz de rastreabilidade do Sprint 3:

```text
docs/matriz-rastreabilidade-sprint3.md
```

Tabelas MC/DC do Sprint 3:

```text
docs/tabela-mcdc-alertas.md
docs/tabela-mcdc-automacao.md
```

## Sprint 4 - Testes de integracao dos endpoints

O Sprint 4 adiciona testes de integracao para os endpoints REST da API GREENHERB. Os testes foram criados numa colecao Postman e a execucao automatica usa Newman.

Os testes de integracao validam:

- headers `Authorization`, `Content-Type` e `Accept`;
- tokens JWT validos, ausentes e sem permissao;
- JSON payloads validos e invalidos;
- metodos HTTP validos e nao suportados;
- codigos de resposta 2xx e 4xx;
- estrutura das respostas JSON;
- resposta CSV do endpoint de relatorios.

Para correr a API:

```bash
npm start
```

Para correr os testes unitarios:

```bash
npm test
```

Para correr os testes de integracao, deixa a API a correr num terminal e executa noutro:

```bash
npm run test:integration
```

Tambem podes correr todos os testes, com a API ja ativa para a parte de integracao:

```bash
npm run test:all
```

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

Matriz de rastreabilidade do Sprint 4:

```text
docs/matriz-rastreabilidade-sprint4.md
```

Relatorio auxiliar do Sprint 4:

```text
docs/relatorio-sprint4.md
```

## Sprint 5 - Testes White-box da criacao de planos

O Sprint 5 acrescenta testes White-box a funcionalidade interna de criacao e validacao de planos de cultivo.

Os testes incidem diretamente sobre:

```text
src/services/plans.service.js
createPlan(planInput, options)
```

Este sprint documenta e cobre:

- estruturas `if` existentes na validacao de tipo, `herbId`, parametros numericos e autorizacao de plano PONTUAL;
- inexistencia de estruturas `for`, `forEach`, `for...of` e `while` na implementacao atual de planos;
- decisoes internas e condicoes atomicas;
- cobertura de decisoes e caminhos relevantes;
- MC/DC da regra composta de criacao de plano PONTUAL;
- matriz de rastreabilidade especifica do Sprint 5.

Para correr os testes:

```bash
npm test
```

Documentos do Sprint 5:

```text
docs/whitebox-planos-analise.md
docs/estruturas-whitebox-planos.md
docs/tabela-mcdc-planos-sprint5.md
docs/matriz-rastreabilidade-sprint5.md
docs/relatorio-sprint5.md
```

## Sprint 6 - Duplos de teste para gateways externos

O Sprint 6 introduz duplos de teste para dependencias externas da aplicacao.

Foram adicionados:

- `TemperatureGatewayStub`, usado para substituir o gateway de leitura automatica de temperatura;
- `NotificationGatewayMock`, usado para substituir o gateway de envio de notificacoes;
- `collectAutomaticTemperatureMeasurement`, service que recebe gateways por injecao de dependencias e testa o fluxo sem chamar sistemas externos reais.

Os testes verificam:

- leituras automaticas de temperatura dentro e fora dos limites;
- sensor invalido;
- ausencia de leitura;
- geracao de alerta quando a temperatura esta fora dos limites;
- envio e nao envio de notificacoes;
- payload da notificacao enviada;
- colaboracao entre medicao automatica, classificacao de alertas e notificacoes sem HTTP.

Para correr todos os testes:

```bash
npm test
```

Documentos do Sprint 6:

```text
docs/diagrama-classes-sprint6.md
docs/diagrama-classes-sprint6.mmd
docs/matriz-rastreabilidade-sprint6.md
docs/relatorio-sprint6.md
```
