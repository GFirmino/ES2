# Tabela MC/DC - Criacao de Plano PONTUAL - Sprint 5

## Expressao logica documentada

```text
planCanBeCreated =
parametersValid &&
(
  type !== "PONTUAL" ||
  (
    hasResponsibleAuthorization === true &&
    authorizedByRole === "RESPONSAVEL"
  )
)
```

Na implementacao real, `parametersValid` e avaliado antes da autorizacao PONTUAL. Se algum parametro falhar, `createPlan` lanca erro `400` e a validacao de autorizacao nao e usada para aceitar o plano.

## Condicoes atomicas

| Condicao | Descricao |
| --- | --- |
| C1 | `parametersValid` |
| C2 | `type !== "PONTUAL"` |
| C3 | `hasResponsibleAuthorization === true` |
| C4 | `authorizedByRole === "RESPONSAVEL"` |

## Tabela MC/DC

| ID | C1 | C2 | C3 | C4 | Resultado logico | Resultado esperado na implementacao | Teste Jest associado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| MCDC-PLAN-01 | V | V | F | F | V | REGULAR valido aceite sem autorizacao especial | WB-PLAN-03 |
| MCDC-PLAN-02 | F | V | F | F | F | REGULAR com parametro invalido rejeitado com `400` | WB-PLAN-07 |
| MCDC-PLAN-03 | V | F | V | V | V | PONTUAL valido autorizado por RESPONSAVEL | WB-PLAN-14 |
| MCDC-PLAN-04 | V | F | F | V | F | PONTUAL sem autorizacao explicita rejeitado com `403` | WB-PLAN-12 |
| MCDC-PLAN-05 | V | F | V | F | F | PONTUAL autorizado por perfil errado rejeitado com `403` | WB-PLAN-13 |
| MCDC-PLAN-06 | V | F | F | F | F | PONTUAL sem autorizacao e sem perfil rejeitado com `403` | WB-PLAN-18 |
| MCDC-PLAN-07 | F | F | V | V | F | PONTUAL com autorizacao correta mas parametro invalido rejeitado com `400` | WB-PLAN-17 |

## Demonstracao de independencia

| Condicao analisada | Pares usados | Justificacao |
| --- | --- | --- |
| C1 - `parametersValid` | MCDC-PLAN-01 e MCDC-PLAN-02 | Mantendo C2=V, C3=F e C4=F, alterar parametros validos para invalidos muda o resultado de aceite para rejeitado |
| C2 - `type !== "PONTUAL"` | MCDC-PLAN-01 e MCDC-PLAN-06 | Mantendo C1=V, C3=F e C4=F, alterar REGULAR para PONTUAL muda o resultado de aceite para rejeitado |
| C3 - `hasResponsibleAuthorization === true` | MCDC-PLAN-03 e MCDC-PLAN-04 | Mantendo C1=V, C2=F e C4=V, alterar autorizacao presente para ausente muda o resultado de aceite para rejeitado |
| C4 - `authorizedByRole === "RESPONSAVEL"` | MCDC-PLAN-03 e MCDC-PLAN-05 | Mantendo C1=V, C2=F e C3=V, alterar perfil RESPONSAVEL para TECNICO muda o resultado de aceite para rejeitado |

## Observacao

WB-PLAN-17 reforca que a autorizacao correta de um plano PONTUAL nao substitui a validade dos parametros ambientais. Isto cobre o curto-circuito funcional em que a validacao de parametros falha antes de o plano poder ser aceite.
