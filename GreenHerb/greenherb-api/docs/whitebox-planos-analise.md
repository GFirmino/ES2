# Analise White-box - Criacao de Planos

## Ficheiro analisado

```text
src/services/plans.service.js
```

## Funcao analisada

```text
createPlan(planInput, options = {})
```

## Resumo da logica analisada

A funcao `createPlan` recebe os dados do plano e delega a validacao para funcoes auxiliares do mesmo ficheiro:

- `normalizePlanType(type)`: valida obrigatoriedade, tipo string, normaliza para maiusculas e valida a enumeracao do tipo.
- `validatePlanParameters(planInput)`: valida `herbId` e os parametros numericos obrigatorios.
- `validateRequiredNumber(input, field)`: valida existencia, tipo numerico e intervalo de cada parametro ambiental.
- `validatePontualAuthorization(type, options)`: aplica a regra especial do plano `PONTUAL`.

O teste white-box incide sobre `createPlan`, mas cobre os ramos internos das funcoes auxiliares diretamente chamadas por ela.

## Estruturas de controlo identificadas

### IF-PLAN-01 - Type obrigatorio

- Estrutura: `if`
- Funcao: `normalizePlanType`
- Objetivo: rejeitar `type` ausente, nulo ou vazio.
- Decisao: `type === undefined || type === null || type === ""`
- Condicoes atomicas:
  - C1 = `type === undefined`
  - C2 = `type === null`
  - C3 = `type === ""`
- Resultado verdadeiro: erro controlado `400`.
- Resultado falso: continua para validacao do tipo string.
- Testes:
  - Verdadeiro: WB-PLAN-01
  - Falso: WB-PLAN-02, WB-PLAN-03

### IF-PLAN-02 - Type string

- Estrutura: `if`
- Funcao: `normalizePlanType`
- Objetivo: rejeitar `type` com tipo diferente de string.
- Decisao: `typeof type !== "string"`
- Condicoes atomicas:
  - C1 = `typeof type !== "string"`
- Resultado verdadeiro: erro controlado `400`.
- Resultado falso: normaliza `type` com `trim().toUpperCase()`.
- Testes:
  - Verdadeiro: coberto indiretamente por testes anteriores de planos do Sprint 2.
  - Falso: WB-PLAN-02, WB-PLAN-03, WB-PLAN-15

### IF-PLAN-03 - Enumeracao de type

- Estrutura: `if`
- Funcao: `normalizePlanType`
- Objetivo: garantir que o tipo pertence a `REGULAR`, `EMERGENCIA` ou `PONTUAL`.
- Decisao: `!VALID_PLAN_TYPES.includes(normalizedType)`
- Condicoes atomicas:
  - C1 = `normalizedType` nao pertence aos tipos validos.
- Resultado verdadeiro: erro controlado `400`.
- Resultado falso: devolve o tipo normalizado.
- Testes:
  - Verdadeiro: WB-PLAN-02
  - Falso: WB-PLAN-03, WB-PLAN-11, WB-PLAN-14, WB-PLAN-15

### IF-PLAN-04 - herbId obrigatorio

- Estrutura: `if`
- Funcao: `validateHerbId`
- Objetivo: rejeitar plano sem identificador de erva.
- Decisao: `herbId === undefined || herbId === null || herbId === ""`
- Condicoes atomicas:
  - C1 = `herbId === undefined`
  - C2 = `herbId === null`
  - C3 = `herbId === ""`
- Resultado verdadeiro: erro controlado `400`.
- Resultado falso: continua para validacao numerica do `herbId`.
- Testes:
  - Verdadeiro: WB-PLAN-04
  - Falso: WB-PLAN-03, WB-PLAN-16

### IF-PLAN-05 - herbId numerico

- Estrutura: `if`
- Funcao: `validateHerbId`
- Objetivo: rejeitar `herbId` nao numerico.
- Decisao: `typeof herbId !== "number" || !Number.isFinite(herbId)`
- Condicoes atomicas:
  - C1 = `typeof herbId !== "number"`
  - C2 = `!Number.isFinite(herbId)`
- Resultado verdadeiro: erro controlado `400`.
- Resultado falso: devolve `herbId`.
- Testes:
  - Verdadeiro: coberto por testes de planos anteriores.
  - Falso: WB-PLAN-03, WB-PLAN-16

### IF-PLAN-06 - Campo numerico obrigatorio

- Estrutura: `if`
- Funcao: `validateRequiredNumber`
- Objetivo: rejeitar parametro ambiental ausente, nulo ou vazio.
- Decisao: `value === undefined || value === null || value === ""`
- Condicoes atomicas:
  - C1 = `value === undefined`
  - C2 = `value === null`
  - C3 = `value === ""`
- Resultado verdadeiro: erro controlado `400`.
- Resultado falso: continua para validacao do tipo numerico.
- Testes:
  - Verdadeiro: WB-PLAN-05
  - Falso: WB-PLAN-03, WB-PLAN-16

### IF-PLAN-07 - Campo numerico com tipo valido

- Estrutura: `if`
- Funcao: `validateRequiredNumber`
- Objetivo: rejeitar parametros ambientais com tipo invalido ou valor nao finito.
- Decisao: `typeof value !== "number" || !Number.isFinite(value)`
- Condicoes atomicas:
  - C1 = `typeof value !== "number"`
  - C2 = `!Number.isFinite(value)`
- Resultado verdadeiro: erro controlado `400`.
- Resultado falso: continua para validacao de intervalo.
- Testes:
  - Verdadeiro: WB-PLAN-06
  - Falso: WB-PLAN-03, WB-PLAN-16

### IF-PLAN-08 - Intervalo dos campos numericos

- Estrutura: `if`
- Funcao: `validateRequiredNumber`
- Objetivo: rejeitar valores abaixo do minimo ou acima do maximo permitido.
- Decisao: `value < limits.min || value > limits.max`
- Condicoes atomicas:
  - C1 = `value < limits.min`
  - C2 = `value > limits.max`
- Resultado verdadeiro: erro controlado `400`.
- Resultado falso: devolve o valor.
- Testes:
  - Verdadeiro por minimo: WB-PLAN-07
  - Verdadeiro por maximo: WB-PLAN-08
  - Falso no limite inferior: WB-PLAN-09
  - Falso no limite superior: WB-PLAN-10
  - Falso em valores internos: WB-PLAN-16

### IF-PLAN-09 - Curto-circuito para planos nao PONTUAL

- Estrutura: `if`
- Funcao: `validatePontualAuthorization`
- Objetivo: permitir que `REGULAR` e `EMERGENCIA` avancem sem autorizacao especial.
- Decisao: `type !== "PONTUAL"`
- Condicoes atomicas:
  - C1 = `type !== "PONTUAL"`
- Resultado verdadeiro: retorna sem validar autorizacao.
- Resultado falso: continua para validacao da autorizacao PONTUAL.
- Testes:
  - Verdadeiro: WB-PLAN-03, WB-PLAN-11
  - Falso: WB-PLAN-12, WB-PLAN-13, WB-PLAN-14

### IF-PLAN-10 - Autorizacao explicita do Responsavel

- Estrutura: `if`
- Funcao: `validatePontualAuthorization`
- Objetivo: rejeitar plano `PONTUAL` sem autorizacao explicita.
- Decisao: `options.hasResponsibleAuthorization !== true`
- Condicoes atomicas:
  - C1 = `hasResponsibleAuthorization !== true`
- Resultado verdadeiro: erro controlado `403`.
- Resultado falso: continua para validacao do perfil autorizador.
- Testes:
  - Verdadeiro: WB-PLAN-12, WB-PLAN-18
  - Falso: WB-PLAN-13, WB-PLAN-14

### IF-PLAN-11 - Perfil autorizador do plano PONTUAL

- Estrutura: `if`
- Funcao: `validatePontualAuthorization`
- Objetivo: rejeitar plano `PONTUAL` cuja autorizacao nao vem de `RESPONSAVEL`.
- Decisao: `options.authorizedByRole !== "RESPONSAVEL"`
- Condicoes atomicas:
  - C1 = `authorizedByRole !== "RESPONSAVEL"`
- Resultado verdadeiro: erro controlado `403`.
- Resultado falso: plano PONTUAL autorizado corretamente.
- Testes:
  - Verdadeiro: WB-PLAN-13
  - Falso: WB-PLAN-14

## Estruturas for / forEach / for...of

Nao foi identificada estrutura `for`, `forEach` ou `for...of` na funcionalidade atual de criacao de planos. A validacao dos quatro parametros numericos e feita por chamadas sequenciais a `validateRequiredNumber`.

Por esse motivo, WB-PLAN-16 cobre a avaliacao completa dos quatro campos numericos existentes, mas nao ha ciclo real a cobrir. Nao foi criada uma estrutura artificial para nao introduzir complexidade sem valor funcional.

## Estruturas while

Nao foi identificada estrutura `while` na funcionalidade de criacao de planos. Por esse motivo, nao existem testes associados a `while`. Nao foi criada uma estrutura artificial.
