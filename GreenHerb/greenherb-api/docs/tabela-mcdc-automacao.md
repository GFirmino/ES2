# Tabela MC/DC - Automacao

## Expressao Logica

Uma acao deve ser executada automaticamente quando:

```text
shouldExecute =
mode === "AUTOMATICO" && ruleActive && measurementRecent && breachDetected
```

## Condicoes Atomicas

| Condicao | Descricao |
| --- | --- |
| C1 | `mode === "AUTOMATICO"` |
| C2 | `ruleActive` |
| C3 | `measurementRecent` |
| C4 | `breachDetected` |

## Tabela MC/DC Reduzida

| Linha | C1 | C2 | C3 | C4 | Decisao | Cenario | Teste implementado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M1 | F | V | V | V | Nao executa automaticamente | MANUAL com regra ativa, medicao recente e violacao | TU-AUTO-01 |
| M2 | V | V | V | V | Executa automaticamente | AUTOMATICO com regra ativa, medicao recente e violacao | TU-AUTO-02 |
| M3 | V | F | V | V | Nao executa | AUTOMATICO com regra inativa | TU-AUTO-03 |
| M4 | V | V | F | V | Nao executa | AUTOMATICO com medicao nao recente | TU-AUTO-04 |
| M5 | V | V | V | F | Nao executa | AUTOMATICO sem violacao | TU-AUTO-05 |

## Demonstracao de Independencia

| Condicao analisada | Par de linhas | Justificacao |
| --- | --- | --- |
| C1 | M1 e M2 | Mantendo C2=V, C3=V e C4=V, alterar MANUAL para AUTOMATICO muda a decisao de nao executar automaticamente para executar |
| C2 | M2 e M3 | Mantendo C1=V, C3=V e C4=V, a regra ativa ou inativa muda a decisao |
| C3 | M2 e M4 | Mantendo C1=V, C2=V e C4=V, a medicao recente ou nao recente muda a decisao |
| C4 | M2 e M5 | Mantendo C1=V, C2=V e C3=V, a existencia de violacao muda a decisao |

O teste TU-AUTO-01 tambem confirma a regra funcional do modo MANUAL: quando as condicoes operacionais estao reunidas, a acao e sugerida, mas nao executada automaticamente.
