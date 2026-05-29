# Relatorio do Sprint 6

## Objetivo

O Sprint 6 introduz duplos de teste para gateways externos da plataforma GREENHERB. O foco e testar a medicao automatica de temperatura e o envio de notificacoes sem depender de sensores reais nem de um servico real de notificacoes.

## Duplos de teste

Um duplo de teste substitui uma dependencia real durante os testes. Neste sprint foram usados dois tipos:

- Stub: fornece respostas previsiveis para controlar o cenario testado.
- Mock: regista interacoes para confirmar que a aplicacao chamou uma dependencia da forma esperada.

## Escolha dos duplos

`TemperatureGatewayStub` foi usado porque o valor da temperatura deve ser controlado nos testes. Assim conseguimos testar temperaturas dentro dos limites, abaixo, acima, sensor invalido e ausencia de leitura.

`NotificationGatewayMock` foi usado porque nao queremos enviar notificacoes reais. O objetivo e verificar se a aplicacao tentou enviar a notificacao correta, com destinatario, tipo, mensagem e payload.

## Injecao de dependencias

O service `collectAutomaticTemperatureMeasurement(input, dependencies)` recebe as dependencias por parametro:

- `temperatureGateway`
- `notificationGateway`
- `measurementRepository`, opcional

Nos testes, essas dependencias sao substituidas por `TemperatureGatewayStub` e `NotificationGatewayMock`. Isto torna os testes deterministas e evita chamadas externas.

## Funcionalidade implementada

O service de medicao automatica:

1. valida `sensorId`, `batchId` e limites do plano;
2. obtem a leitura atraves de `temperatureGateway.getCurrentTemperature(sensorId)`;
3. cria uma medicao normalizada;
4. ignora alerta operacional quando `sensorOK=false`;
5. usa `classifyAlert` para detetar temperatura fora dos limites;
6. envia notificacao quando existe alerta de temperatura;
7. devolve medicao, alerta e indicador `notificationSent`.

## Testes criados

| ID | Ficheiro | Objetivo |
| --- | --- | --- |
| TD-TEMP-01 a TD-TEMP-05 | `tests/temperatureGateway.stub.test.js` | Validar o comportamento do stub de temperatura. |
| TD-NOTIF-01 a TD-NOTIF-04 | `tests/notificationGateway.mock.test.js` | Validar o registo de chamadas do mock de notificacoes. |
| TD-AUTOTEMP-01 a TD-AUTOTEMP-09 | `tests/automaticTemperatureMeasurement.service.test.js` | Validar a funcionalidade de medicao automatica com stub e mock. |
| TD-FLOW-01 a TD-FLOW-02 | `tests/temperatureNotification.flow.test.js` | Validar o fluxo entre medicao automatica, classificacao de alerta e notificacao sem HTTP. |

## Cenarios principais

- Temperatura dentro dos limites: cria medicao, nao gera alerta e nao envia notificacao.
- Temperatura acima dos limites: cria alerta e envia notificacao.
- Temperatura abaixo dos limites: cria alerta e envia notificacao.
- Sensor invalido: cria resultado controlado, mas nao gera alerta operacional nem notificacao.
- Ausencia de leitura: devolve erro controlado.
- Limites 18 e 28: aceites sem alerta.

## Referencias

- Diagrama de classes: `docs/diagrama-classes-sprint6.md`
- Diagrama Mermaid: `docs/diagrama-classes-sprint6.mmd`
- Matriz de rastreabilidade: `docs/matriz-rastreabilidade-sprint6.md`

## Limitacoes

- Nao existe gateway externo real de sensores neste projeto; foi criada uma implementacao em memoria apenas para ambiente local.
- Nao existe envio real de notificacoes; a implementacao em memoria e o mock apenas guardam chamadas.
- O Sprint 6 nao cria testes HTTP, Postman, Newman ou Supertest.

## Como executar os testes

```bash
npm test
```
