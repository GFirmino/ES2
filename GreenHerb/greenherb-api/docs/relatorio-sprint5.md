# Relatorio - Sprint 5 GREENHERB

## Objetivo

O Sprint 5 acrescenta testes White-box para a funcionalidade de criacao e validacao de planos de cultivo. O foco e a estrutura interna da funcao, cobrindo decisoes, condicoes atomicas e caminhos relevantes.

## Diferenca entre Sprint 2 e Sprint 5

- Sprint 2: testes unitarios orientados ao comportamento esperado, usando particionamento de equivalencia, valores limite e MC/DC funcional.
- Sprint 5: testes unitarios White-box orientados a estrutura interna de `createPlan`, cobrindo ramos `if`, decisoes compostas e condicoes atomicas.

## Funcao analisada

```text
src/services/plans.service.js
createPlan(planInput, options = {})
```

## Estruturas de controlo identificadas

- `if` em `normalizePlanType`.
- `if` em `validateHerbId`.
- `if` em `validateRequiredNumber`.
- `if` em `validatePontualAuthorization`.
- Nao existe `for`, `forEach` ou `for...of` na implementacao atual.
- Nao existe `while` na implementacao atual.

## Decisoes e condicoes cobertas

- Tipo ausente.
- Tipo invalido.
- Tipo valido e normalizado.
- HerbId ausente.
- Campo numerico ausente.
- Campo numerico com tipo invalido.
- Valor abaixo do minimo.
- Valor acima do maximo.
- Valores exatamente nos limites validos.
- Plano nao PONTUAL sem autorizacao especial.
- Plano PONTUAL sem autorizacao.
- Plano PONTUAL com perfil autorizador errado.
- Plano PONTUAL com autorizacao correta.
- Parametros invalidos mesmo quando a autorizacao PONTUAL esta correta.

## Tabela resumo dos testes WB-PLAN

| Teste | Objetivo | Resultado esperado |
| --- | --- | --- |
| WB-PLAN-01 | Type ausente | Erro 400 |
| WB-PLAN-02 | Type invalido | Erro 400 |
| WB-PLAN-03 | Type REGULAR valido | Plano aceite |
| WB-PLAN-04 | HerbId ausente | Erro 400 |
| WB-PLAN-05 | Campo numerico ausente | Erro 400 |
| WB-PLAN-06 | Campo numerico nao string | Erro 400 |
| WB-PLAN-07 | Valor abaixo do minimo | Erro 400 |
| WB-PLAN-08 | Valor acima do maximo | Erro 400 |
| WB-PLAN-09 | Limites inferiores validos | Plano aceite |
| WB-PLAN-10 | Limites superiores validos | Plano aceite |
| WB-PLAN-11 | EMERGENCIA valido | Plano aceite |
| WB-PLAN-12 | PONTUAL sem autorizacao | Erro 403 |
| WB-PLAN-13 | PONTUAL com perfil errado | Erro 403 |
| WB-PLAN-14 | PONTUAL autorizado corretamente | Plano aceite |
| WB-PLAN-15 | Type em minusculas | Plano aceite e normalizado |
| WB-PLAN-16 | Todos os campos numericos validos | Plano aceite |
| WB-PLAN-17 | PONTUAL autorizado com parametro invalido | Erro 400 |
| WB-PLAN-18 | Complemento MC/DC para PONTUAL sem role | Erro 403 |

## Referencias

- `docs/whitebox-planos-analise.md`
- `docs/estruturas-whitebox-planos.md`
- `docs/tabela-mcdc-planos-sprint5.md`
- `docs/matriz-rastreabilidade-sprint5.md`

## Limitacoes

- A funcao analisada nao contem ciclos `for` ou `while`; essas estruturas foram documentadas como inexistentes.
- Nao foram criadas estruturas artificiais apenas para aumentar a lista de estruturas de controlo.
- Os testes nao arrancam servidor Express, nao usam Supertest e nao usam base de dados real.

## Como executar

```bash
npm test
```
