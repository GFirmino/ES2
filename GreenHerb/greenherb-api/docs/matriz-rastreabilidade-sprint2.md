# Matriz de Rastreabilidade - Sprint 2 GREENHERB

Esta matriz cobre os testes unitarios do Sprint 2 para importacao do catalogo de ervas aromaticas e criacao/validacao de planos de cultivo.

| ID do Caso de Teste | Requisito / Regra de Negocio | Funcao / Endpoint | Nivel de Teste | Tecnica Aplicada | Classe de Equivalencia / Valor Limite / Condicao | Entrada | Resultado Esperado | Pre-condicoes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TU-HERBS-01 | RF-03, RN-IMPORT-02: linhas validas devem ser importadas | `importHerbsFromCsv` / `POST /herbs/import` | Unitario | Particionamento de equivalencia | CE-CSV-01, CE-ROW-01 | CSV valido com duas linhas validas | `importedRows=2`, `invalidRows=0`, `duplicateRows=0` | Nenhuma |
| TU-HERBS-02 | RN-IMPORT-01: CSV vazio deve ser rejeitado | `importHerbsFromCsv` / `POST /herbs/import` | Unitario | Particionamento de equivalencia | CE-CSV-02 | CSV vazio | Erro controlado, `statusCode=400` | Nenhuma |
| TU-HERBS-03 | RN-IMPORT-01: cabecalho invalido deve ser rejeitado | `importHerbsFromCsv` / `POST /herbs/import` | Unitario | Particionamento de equivalencia | CE-CSV-03 | CSV com cabecalho sem campos esperados | Erro controlado, `statusCode=400` | Nenhuma |
| TU-HERBS-04 | RN-IMPORT-03: linhas invalidas devem ser rejeitadas e reportadas | `importHerbsFromCsv` / `POST /herbs/import` | Unitario | Particionamento de equivalencia | CE-ROW-01, CE-ROW-02 | Uma linha valida e uma linha com `commonName` vazio | `importedRows=1`, `invalidRows=1`, erro indica linha invalida | Nenhuma |
| TU-HERBS-05 | RN-IMPORT-03: campos numericos invalidos devem rejeitar a linha | `importHerbsFromCsv` / `POST /herbs/import` | Unitario | Particionamento de equivalencia | CE-ROW-02 | Temperatura textual, por exemplo `quente` | Linha rejeitada, `invalidRows=1` | Nenhuma |
| TU-HERBS-06 | RN-IMPORT-04: ervas duplicadas nao devem ser importadas | `importHerbsFromCsv` / `POST /herbs/import` | Unitario | Particionamento de equivalencia | CE-ROW-03 | CSV com erva ja existente em `existingHerbs` | `duplicateRows=1`, duplicado nao importado | Lista `existingHerbs` contem a erva |
| TU-HERBS-07 | RN-IMPORT-02: linhas vazias devem ser ignoradas | `importHerbsFromCsv` / `POST /herbs/import` | Unitario | Particionamento de equivalencia | CE-ROW-04, CE-ROW-01 | CSV com linhas vazias entre linhas validas | `ignoredRows=2`, linhas validas importadas | Nenhuma |
| TU-HERBS-08 | RN-IMPORT-03: temperatura deve estar entre 18 e 28 | `importHerbsFromCsv` / `POST /herbs/import` | Unitario | Analise de valores limite | Temperatura: 17, 18, 23, 28, 29 | Cinco linhas com temperatura nos valores limite | Rejeita 17 e 29; aceita 18, 23 e 28 | Nenhuma |
| TU-HERBS-09 | RN-IMPORT-03: humidade deve estar entre 40 e 80 | `importHerbsFromCsv` / `POST /herbs/import` | Unitario | Analise de valores limite | Humidade: 39, 40, 60, 80, 81 | Cinco linhas com humidade nos valores limite | Rejeita 39 e 81; aceita 40, 60 e 80 | Nenhuma |
| TU-HERBS-10 | RN-IMPORT-03: luminosidade deve estar entre 5000 e 25000 | `importHerbsFromCsv` / `POST /herbs/import` | Unitario | Analise de valores limite | Luminosidade: 4999, 5000, 15000, 25000, 25001 | Cinco linhas com luminosidade nos valores limite | Rejeita 4999 e 25001; aceita 5000, 15000 e 25000 | Nenhuma |
| TU-HERBS-11 | RN-IMPORT-03: duracao do ciclo deve estar entre 1 e 365 dias | `importHerbsFromCsv` / `POST /herbs/import` | Unitario | Analise de valores limite | Duracao: 0, 1, 90, 365, 366 | Cinco linhas com duracao nos valores limite | Rejeita 0 e 366; aceita 1, 90 e 365 | Nenhuma |
| TU-PLANS-01 | RN-PLAN-01: tipo REGULAR e valido | `createPlan` / `POST /plans` | Unitario | Particionamento de equivalencia | CE-PLAN-01 | Plano REGULAR valido | Plano criado, `type=REGULAR` | Parametros ambientais validos |
| TU-PLANS-02 | RN-PLAN-01: tipo EMERGENCIA e valido | `createPlan` / `POST /plans` | Unitario | Particionamento de equivalencia | CE-PLAN-02 | Plano EMERGENCIA valido | Plano criado, `type=EMERGENCIA` | Parametros ambientais validos |
| TU-PLANS-03 | RN-PLAN-04: plano PONTUAL exige autorizacao do Responsavel | `createPlan` / `POST /plans` | Unitario | Particionamento de equivalencia | CE-PLAN-03, CE-AUTH-01 | Plano PONTUAL com `hasResponsibleAuthorization=true` e `authorizedByRole=RESPONSAVEL` | Plano criado, `type=PONTUAL` | Parametros ambientais validos |
| TU-PLANS-04 | RN-PLAN-01: tipo de plano deve pertencer aos valores permitidos | `createPlan` / `POST /plans` | Unitario | Particionamento de equivalencia | CE-PLAN-04 | `type=SEMANAL` | Erro controlado, `statusCode=400` | Nenhuma |
| TU-PLANS-05 | RN-PLAN-05: campos obrigatorios devem estar presentes | `createPlan` / `POST /plans` | Unitario | Particionamento de equivalencia | CE-PLAN-05 | Plano sem `type` | Erro controlado, `statusCode=400` | Nenhuma |
| TU-PLANS-06 | RN-PLAN-05: `herbId` e obrigatorio | `createPlan` / `POST /plans` | Unitario | Particionamento de equivalencia | CE-PLAN-06 | Plano sem `herbId` | Erro controlado, `statusCode=400` | Nenhuma |
| TU-PLANS-07 | RN-PLAN-04: plano PONTUAL exige autorizacao explicita | `createPlan` / `POST /plans` | Unitario | Particionamento de equivalencia | CE-AUTH-02 | Plano PONTUAL com `hasResponsibleAuthorization=false` | Erro controlado, `statusCode=403` | Parametros ambientais validos |
| TU-PLANS-08 | RN-PLAN-04: autorizacao deve vir de RESPONSAVEL | `createPlan` / `POST /plans` | Unitario | Particionamento de equivalencia | CE-AUTH-03 | Plano PONTUAL com autorizacao de `TECNICO` | Erro controlado, `statusCode=403` | Parametros ambientais validos |
| TU-PLANS-09 | RN-PLAN-02: temperatura deve estar entre 18 e 28 | `createPlan` / `POST /plans` | Unitario | Analise de valores limite | Temperature: 17, 18, 23, 28, 29 | Planos com temperatura nos valores limite | Rejeita 17 e 29; aceita 18, 23 e 28 | Restantes parametros validos |
| TU-PLANS-10 | RN-PLAN-02: humidade deve estar entre 40 e 80 | `createPlan` / `POST /plans` | Unitario | Analise de valores limite | Humidity: 39, 40, 60, 80, 81 | Planos com humidade nos valores limite | Rejeita 39 e 81; aceita 40, 60 e 80 | Restantes parametros validos |
| TU-PLANS-11 | RN-PLAN-02: luminosidade deve estar entre 5000 e 25000 | `createPlan` / `POST /plans` | Unitario | Analise de valores limite | Luminosity: 4999, 5000, 15000, 25000, 25001 | Planos com luminosidade nos valores limite | Rejeita 4999 e 25001; aceita 5000, 15000 e 25000 | Restantes parametros validos |
| TU-PLANS-12 | RN-PLAN-03: duracao do ciclo deve estar entre 1 e 365 dias | `createPlan` / `POST /plans` | Unitario | Analise de valores limite | CycleDurationDays: 0, 1, 90, 365, 366 | Planos com duracao nos valores limite | Rejeita 0 e 366; aceita 1, 90 e 365 | Restantes parametros validos |
| TU-PLANS-13 | RN-PLAN-02: campos numericos devem ser numeros | `createPlan` / `POST /plans` | Unitario | Particionamento de equivalencia | Campo numerico com tipo invalido | `temperature="vinte"` | Erro controlado, `statusCode=400` | Restantes parametros validos |
| TU-PLANS-14 | RN-PLAN-01: tipos em minusculas sao aceites e normalizados | `createPlan` / `POST /plans` | Unitario | Particionamento de equivalencia | CE-PLAN-01 normalizado | `type=regular` | Plano aceite, `type=REGULAR` | Parametros ambientais validos |
| TU-PLANS-15 | RN-PLAN-04: regra composta do plano PONTUAL | `createPlan` / `POST /plans` | Unitario | Cobertura MC/DC | C1, C2, C3, C4 | REGULAR valido; PONTUAL sem autorizacao; PONTUAL autorizado por RESPONSAVEL; PONTUAL autorizado por TECNICO; PONTUAL com parametros invalidos | Cada condicao atomica influencia isoladamente a decisao | Ver `docs/tabela-mcdc-planos.md` |

## Classes de Equivalencia

### Importacao

| Classe | Descricao |
| --- | --- |
| CE-CSV-01 | CSV valido |
| CE-CSV-02 | CSV vazio |
| CE-CSV-03 | CSV com cabecalho invalido |
| CE-ROW-01 | Linha valida |
| CE-ROW-02 | Linha invalida |
| CE-ROW-03 | Linha duplicada |
| CE-ROW-04 | Linha vazia |

### Planos

| Classe | Descricao |
| --- | --- |
| CE-PLAN-01 | Tipo REGULAR valido |
| CE-PLAN-02 | Tipo EMERGENCIA valido |
| CE-PLAN-03 | Tipo PONTUAL valido com autorizacao |
| CE-PLAN-04 | Tipo invalido |
| CE-PLAN-05 | Type em falta |
| CE-PLAN-06 | HerbId em falta |
| CE-AUTH-01 | Autorizacao do Responsavel presente |
| CE-AUTH-02 | Autorizacao ausente |
| CE-AUTH-03 | Autorizacao presente mas perfil errado |

## Valores Limite

| Parametro | Valores testados |
| --- | --- |
| temperature | 17, 18, 23, 28, 29 |
| humidity | 39, 40, 60, 80, 81 |
| luminosity | 4999, 5000, 15000, 25000, 25001 |
| cycleDurationDays | 0, 1, 90, 365, 366 |
