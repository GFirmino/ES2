# Tabela MC/DC - Planos PONTUAIS

## Expressao Logica

Plano valido para execucao se:

```text
(type !== "PONTUAL") ||
(hasResponsibleAuthorization === true &&
 authorizedByRole === "RESPONSAVEL" &&
 parametersValid === true)
```

## Condicoes Atomicas

| Condicao | Descricao |
| --- | --- |
| C1 | `type !== "PONTUAL"` |
| C2 | `hasResponsibleAuthorization === true` |
| C3 | `authorizedByRole === "RESPONSAVEL"` |
| C4 | `parametersValid === true` |

## Tabela MC/DC Reduzida

| Linha | C1 | C2 | C3 | C4 | Decisao | Cenario | Teste implementado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M1 | V | F | V | V | Valido | REGULAR sem autorizacao efetiva e parametros validos | TU-PLANS-15, caso 1 |
| M2 | F | F | V | V | Invalido | PONTUAL sem autorizacao e parametros validos | TU-PLANS-15, caso 2 |
| M3 | F | V | V | V | Valido | PONTUAL com autorizacao do RESPONSAVEL e parametros validos | TU-PLANS-15, caso 3 |
| M4 | F | V | F | V | Invalido | PONTUAL com autorizacao de TECNICO e parametros validos | TU-PLANS-15, caso 4 |
| M5 | F | V | V | F | Invalido | PONTUAL com autorizacao do RESPONSAVEL e parametros invalidos | TU-PLANS-15, caso 5 |

## Demonstracao de Independencia

| Condicao analisada | Par de linhas | Justificacao |
| --- | --- | --- |
| C1 | M1 e M2 | Mantendo C2=F, C3=V e C4=V, alterar de REGULAR para PONTUAL muda a decisao de valido para invalido |
| C2 | M2 e M3 | Mantendo C1=F, C3=V e C4=V, a autorizacao ausente ou presente muda a decisao |
| C3 | M3 e M4 | Mantendo C1=F, C2=V e C4=V, alterar o perfil de RESPONSAVEL para TECNICO muda a decisao |
| C4 | M3 e M5 | Mantendo C1=F, C2=V e C3=V, parametros validos ou invalidos mudam a decisao |
