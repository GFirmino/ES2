# Tabela MC/DC - Alertas

## Expressao Logica

Um alerta operacional e necessario quando:

```text
alertRequired =
(temperatureOutOfRange || humidityOutOfRange || luminosityOutOfRange) && sensorOK
```

## Condicoes Atomicas

| Condicao | Descricao |
| --- | --- |
| C1 | `temperatureOutOfRange` |
| C2 | `humidityOutOfRange` |
| C3 | `luminosityOutOfRange` |
| C4 | `sensorOK` |

## Tabela MC/DC Reduzida

| Linha | C1 | C2 | C3 | C4 | Decisao | Cenario | Teste implementado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A1 | F | F | F | V | Sem alerta | Medicao dentro dos limites com sensor valido | TU-ALERT-01 |
| A2 | V | F | F | V | Alerta | Temperatura fora do limite com sensor valido | TU-ALERT-03 |
| A3 | F | V | F | V | Alerta | Humidade fora do limite com sensor valido | TU-ALERT-04 |
| A4 | F | F | V | V | Alerta | Luminosidade fora do limite com sensor valido | TU-ALERT-05 |
| A5 | V | F | F | F | Sem alerta | Temperatura fora do limite com sensor invalido | TU-ALERT-02 |

## Demonstracao de Independencia

| Condicao analisada | Par de linhas | Justificacao |
| --- | --- | --- |
| C1 | A1 e A2 | Mantendo C2=F, C3=F e C4=V, alterar C1 muda a decisao de sem alerta para alerta |
| C2 | A1 e A3 | Mantendo C1=F, C3=F e C4=V, alterar C2 muda a decisao de sem alerta para alerta |
| C3 | A1 e A4 | Mantendo C1=F, C2=F e C4=V, alterar C3 muda a decisao de sem alerta para alerta |
| C4 | A2 e A5 | Mantendo C1=V, C2=F e C3=F, alterar C4 muda a decisao de alerta para sem alerta |

Os testes TU-ALERT-06 e TU-ALERT-07 complementam esta tabela ao verificar a classificacao AVISO e CRITICO para duas e tres violacoes simultaneas.
