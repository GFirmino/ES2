# Matriz de Rastreabilidade - Sprint 4 GREENHERB

Esta matriz cobre os testes de integracao executados por Postman/Newman no Sprint 4.

| ID do Caso de Teste | Requisito / Regra de Negocio | Endpoint Exercitado | Metodo HTTP | Headers Relevantes | JSON Payload / Input | Nivel de Teste | Tecnica Aplicada | Resultado Esperado | Pre-condicoes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TI-HEALTH-01 | RN-HTTP: API deve expor health check | `/health` | GET | Nenhum | Nenhum | Integracao | Teste de contrato da API, codigo HTTP | 200, `status=ok` | API ativa |
| TI-AUTH-01 | RF-AUTH: login ADMIN valido | `/auth/login` | POST | `Content-Type: application/json` | username/password ADMIN | Integracao | Payload JSON, resposta 2xx, estrutura JSON | 200, token e user sem password | Utilizador admin existe |
| TI-AUTH-02 | RF-AUTH: login RESPONSAVEL valido | `/auth/login` | POST | `Content-Type: application/json` | username/password RESPONSAVEL | Integracao | Payload JSON, resposta 2xx | 200, token guardado | Utilizador responsavel existe |
| TI-AUTH-03 | RF-AUTH: login TECNICO valido | `/auth/login` | POST | `Content-Type: application/json` | username/password TECNICO | Integracao | Payload JSON, resposta 2xx | 200, token guardado | Utilizador tecnico existe |
| TI-AUTH-04 | RF-AUTH: username inexistente rejeitado | `/auth/login` | POST | `Content-Type: application/json` | username inexistente | Integracao | Particionamento de equivalencia, resposta 4xx | 401 com erro JSON | Nenhuma |
| TI-AUTH-05 | RF-AUTH: password errada rejeitada | `/auth/login` | POST | `Content-Type: application/json` | password errada | Integracao | Particionamento de equivalencia, resposta 4xx | 401 com erro JSON | Username valido |
| TI-AUTH-06 | RF-AUTH: username obrigatorio | `/auth/login` | POST | `Content-Type: application/json` | payload sem username | Integracao | Validacao de payload JSON | 400 com erro JSON | Nenhuma |
| TI-AUTH-07 | RF-AUTH: payload sem JSON valido rejeitado | `/auth/login` | POST | `Content-Type: text/plain` | texto simples | Integracao | Validacao de headers, payload invalido | 400 com erro JSON | Nenhuma |
| TI-AUTH-08 | RF-AUTH: refresh de token valido | `/auth/refresh` | POST | `Content-Type: application/json` | token ADMIN | Integracao | JWT, resposta 2xx | 200, token presente | `adminToken` obtido |
| TI-AUTH-09 | RF-AUTH: refresh sem token rejeitado | `/auth/refresh` | POST | `Content-Type: application/json` | `{}` | Integracao | Validacao de payload, resposta 4xx | 401 com erro JSON | Nenhuma |
| TI-USERS-01 | RF-USERS, RN-ACCESS: apenas ADMIN cria utilizadores | `/users` | POST | Authorization ADMIN, JSON | username/password/role validos | Integracao | JWT, perfil, payload JSON, resposta 2xx | 201, id guardado, password ausente | `adminToken` |
| TI-USERS-02 | RN-ACCESS: token obrigatorio | `/users` | POST | JSON sem Authorization | user valido | Integracao | Validacao de headers/JWT | 401 | Nenhuma |
| TI-USERS-03 | RN-ACCESS: TECNICO nao cria utilizadores | `/users` | POST | Authorization TECNICO, JSON | user valido | Integracao | JWT, autorizacao por perfil | 403 | `tecnicoToken` |
| TI-USERS-04 | RF-USERS: role invalida rejeitada | `/users` | POST | Authorization ADMIN, JSON | role=GESTOR | Integracao | Particionamento de equivalencia, payload invalido | 400 | `adminToken` |
| TI-USERS-05 | RF-USERS: ADMIN lista utilizadores | `/users` | GET | Authorization ADMIN | Nenhum | Integracao | JWT, contrato da API | 200, `data` array | `adminToken` |
| TI-USERS-06 | RF-USERS: obter utilizador criado | `/users/:id` | GET | Authorization ADMIN | id criado | Integracao | Path param, estrutura de resposta | 200, id corresponde | `createdUserId` |
| TI-USERS-07 | RF-USERS: atualizar utilizador | `/users/:id` | PUT | Authorization ADMIN, JSON | username/role validos | Integracao | JWT, payload JSON, resposta 2xx | 200, password ausente | `createdUserId` |
| TI-USERS-08 | RF-USERS: apagar utilizador | `/users/:id` | DELETE | Authorization ADMIN | id criado | Integracao | Metodo HTTP, codigo 204 | 204 | `createdUserId` |
| TI-HERBS-01 | RF-HERBS: criar erva valida | `/herbs` | POST | Authorization ADMIN, JSON | erva com limites validos | Integracao | Payload JSON, resposta 2xx | 201, id guardado | `adminToken` |
| TI-HERBS-02 | RN-ACCESS: criar erva exige token | `/herbs` | POST | JSON sem Authorization | erva simples | Integracao | Validacao de JWT/header | 401 | Nenhuma |
| TI-HERBS-03 | RF-HERBS: commonName obrigatorio | `/herbs` | POST | Authorization ADMIN, JSON | commonName vazio | Integracao | Payload invalido | 400 | `adminToken` |
| TI-HERBS-04 | RF-HERBS: listar catalogo | `/herbs` | GET | Nenhum | Nenhum | Integracao | Contrato da API | 200, `data` array | Nenhuma |
| TI-HERBS-05 | RF-HERBS: obter erva criada | `/herbs/:id` | GET | Nenhum | id criado | Integracao | Path param, estrutura de resposta | 200, id corresponde | `createdHerbId` |
| TI-HERBS-06 | RF-HERBS: importar catalogo CSV valido | `/herbs/import` | POST | Authorization ADMIN, JSON | `csvContent` valido | Integracao | Payload JSON, CSV valido, resposta 2xx | 201, `importedRows >= 1` | `adminToken` |
| TI-HERBS-07 | RF-HERBS: CSV vazio rejeitado | `/herbs/import` | POST | Authorization ADMIN, JSON | `csvContent=""` | Integracao | Particionamento de equivalencia | 400 | `adminToken` |
| TI-HERBS-08 | RF-HERBS: cabecalho CSV invalido rejeitado | `/herbs/import` | POST | Authorization ADMIN, JSON | cabecalho invalido | Integracao | Payload invalido, resposta 4xx | 400 | `adminToken` |
| TI-PLANS-01 | RF-PLANS: criar plano REGULAR valido | `/plans` | POST | Authorization RESPONSAVEL, JSON | plano regular valido | Integracao | JWT, payload JSON, resposta 2xx | 201, id guardado | `responsavelToken`, `createdHerbId` |
| TI-PLANS-02 | RF-PLANS: tipo invalido rejeitado | `/plans` | POST | Authorization RESPONSAVEL, JSON | type=SEMANAL | Integracao | Particionamento de equivalencia | 400 | `responsavelToken` |
| TI-PLANS-03 | RF-PLANS: temperatura abaixo do limite rejeitada | `/plans` | POST | Authorization RESPONSAVEL, JSON | temperature=17 | Integracao | Analise de valores limite | 400 | `responsavelToken` |
| TI-PLANS-04 | RF-PLANS: temperatura no limite inferior aceite | `/plans` | POST | Authorization RESPONSAVEL, JSON | temperature=18 | Integracao | Analise de valores limite | 201 | `responsavelToken` |
| TI-PLANS-05 | RN-PLAN-PONTUAL: PONTUAL sem autorizacao rejeitado | `/plans` | POST | Authorization RESPONSAVEL, JSON | type=PONTUAL sem autorizacao | Integracao | Regra de negocio, resposta 4xx | 403 | `responsavelToken` |
| TI-PLANS-06 | RN-PLAN-PONTUAL: PONTUAL autorizado aceite | `/plans` | POST | Authorization RESPONSAVEL, JSON | PONTUAL com autorizacao RESPONSAVEL | Integracao | Payload JSON, resposta 2xx | 201, type PONTUAL | `responsavelToken` |
| TI-PLANS-07 | RF-PLANS: listar planos | `/plans` | GET | Nenhum | Nenhum | Integracao | Contrato da API | 200, `data` array | Nenhuma |
| TI-PLANS-08 | RF-PLANS: obter plano criado | `/plans/:id` | GET | Nenhum | id criado | Integracao | Path param, estrutura de resposta | 200, id corresponde | `createdPlanId` |
| TI-BATCH-01 | RF-BATCHES: criar lote valido | `/batches` | POST | Authorization RESPONSAVEL, JSON | herbId, planId, state, expectedUnits | Integracao | JWT, payload JSON | 201, id guardado | `createdHerbId`, `createdPlanId` |
| TI-BATCH-02 | RF-BATCHES: planId invalido rejeitado | `/batches` | POST | Authorization RESPONSAVEL, JSON | planId inexistente | Integracao | Payload invalido, resposta 4xx | 400 | `responsavelToken` |
| TI-BATCH-03 | RF-BATCHES: obter lote criado | `/batches/:id` | GET | Nenhum | id criado | Integracao | Path param | 200 | `createdBatchId` |
| TI-BATCH-04 | RF-BATCHES: CONCLUIDO exige actualEndDate | `/batches/:id/state` | PATCH | Authorization RESPONSAVEL, JSON | state=CONCLUIDO sem data | Integracao | Regra de negocio, payload JSON | 400 | Lote ATIVO |
| TI-BATCH-05 | RF-BATCHES: COMPROMETIDO com perdas aceite | `/batches/:id/state` | PATCH | Authorization RESPONSAVEL, JSON | state=COMPROMETIDO, lostUnits>0 | Integracao | Cobertura de condicao composta | 200, state COMPROMETIDO | Lote ATIVO |
| TI-BATCH-06 | RF-BATCHES: produtividade calculada | `/batches/:id/state` | PATCH | Authorization RESPONSAVEL, JSON | CONCLUIDO com colheita/perdas/divisoes | Integracao | Payload JSON, estrutura de resposta | 200, produtividade=95 | Lote criado |
| TI-TASKS-01 | RF-TASKS: criar tarefa valida | `/tasks` | POST | Authorization TECNICO, JSON | tarefa REGA valida | Integracao | JWT, payload JSON | 201, id guardado | `createdBatchId` |
| TI-TASKS-02 | RF-TASKS: tipo invalido rejeitado | `/tasks` | POST | Authorization TECNICO, JSON | type=LIMPEZA | Integracao | Particionamento de equivalencia | 400 | `tecnicoToken` |
| TI-TASKS-03 | RN-ACCESS: criar tarefa exige token | `/tasks` | POST | JSON sem Authorization | tarefa valida | Integracao | Validacao de JWT/header | 401 | Nenhuma |
| TI-TASKS-04 | RF-TASKS: listar tarefas | `/tasks` | GET | Nenhum | Nenhum | Integracao | Contrato da API | 200 | Nenhuma |
| TI-TASKS-05 | RF-TASKS: atualizar tarefa | `/tasks/:id` | PUT | Authorization TECNICO, JSON | status=CONCLUIDA | Integracao | Payload JSON, resposta 2xx | 200, status atualizado | `createdTaskId` |
| TI-MEAS-01 | RF-MEASUREMENTS: registar medicao valida | `/measurements` | POST | Authorization TECNICO, JSON | medicao dentro dos limites | Integracao | Payload JSON, resposta 2xx | 201, id guardado, sem alerta critico | `createdBatchId` |
| TI-MEAS-02 | RN-ALERTS: medicao fora dos limites gera alerta | `/measurements` | POST | Authorization TECNICO, JSON | humidity=39 | Integracao | Payload JSON, regra de alertas | 201, alerta gerado | `createdBatchId` |
| TI-MEAS-03 | RF-MEASUREMENTS: sensorOK deve ser booleano | `/measurements` | POST | Authorization TECNICO, JSON | sensorOK string | Integracao | Payload invalido | 400 | `tecnicoToken` |
| TI-ALERTS-01 | RN-ALERTS: listar alertas | `/alerts` | GET | Authorization RESPONSAVEL | Nenhum | Integracao | JWT, contrato da API | 200, `data` array | `responsavelToken` |
| TI-ALERTS-02 | RN-ALERT-DECISION: ignorar exige justificacao | `/alerts/:id` | PATCH | Authorization RESPONSAVEL, JSON | decision=IGNORADO sem justificacao | Integracao | Payload invalido, resposta 4xx | 422 | `createdAlertId` |
| TI-ALERTS-03 | RN-ALERT-DECISION: ignorar com justificacao valida | `/alerts/:id` | PATCH | Authorization RESPONSAVEL, JSON | decision=IGNORADO com justificacao | Integracao | Payload JSON, resposta 2xx | 200, status IGNORADO | `createdAlertId` |
| TI-ALERTS-04 | RN-ALERT-DECISION: decisao invalida rejeitada | `/alerts/:id` | PATCH | Authorization RESPONSAVEL, JSON | decision=ADIADO | Integracao | Particionamento de equivalencia | 400 | `createdAlertId` |
| TI-AUTO-01 | RF-AUTOMATION: MANUAL sugere acao | `/automation` | POST | Authorization RESPONSAVEL, JSON | mode=MANUAL e condicoes true | Integracao | Payload JSON, contrato da API | 201, `SUGGEST_ACTION` | `responsavelToken` |
| TI-AUTO-02 | RF-AUTOMATION: AUTOMATICO executa acao | `/automation` | POST | Authorization RESPONSAVEL, JSON | mode=AUTOMATICO e condicoes true | Integracao | Payload JSON, resposta 2xx | 201, `EXECUTE_ACTION` | `responsavelToken` |
| TI-AUTO-03 | RF-AUTOMATION: regra inativa nao aciona | `/automation` | POST | Authorization RESPONSAVEL, JSON | ruleActive=false | Integracao | Particionamento de equivalencia | 201, `NO_ACTION` | `responsavelToken` |
| TI-AUTO-04 | RF-AUTOMATION: modo invalido rejeitado | `/automation` | POST | Authorization RESPONSAVEL, JSON | mode=AUTO | Integracao | Payload invalido | 400 | `responsavelToken` |
| TI-REPORTS-01 | RF-REPORTS: exportar CSV | `/reports?format=csv` | GET | Authorization ADMIN, `Accept:text/csv` | format=csv | Integracao | Validacao de headers, resposta CSV | 200, Content-Type CSV, cabecalho | `adminToken` |
| TI-REPORTS-02 | RF-REPORTS: formato invalido rejeitado | `/reports?format=json` | GET | Authorization ADMIN | format=json | Integracao | Particionamento de equivalencia | 400 | `adminToken` |
| TI-REPORTS-03 | RN-ACCESS: reports exige token | `/reports?format=csv` | GET | `Accept:text/csv`, sem Authorization | format=csv | Integracao | Validacao de JWT/header | 401 | Nenhuma |
| TI-AUDIT-01 | RF-AUDIT: ADMIN consulta auditoria | `/audit` | GET | Authorization ADMIN | Nenhum | Integracao | JWT, estrutura de resposta | 200, logs com userId/action/timestamp | `adminToken` |
| TI-AUDIT-02 | RF-AUDIT: audit exige token | `/audit` | GET | Sem Authorization | Nenhum | Integracao | Validacao de JWT/header | 401 | Nenhuma |
| TI-AUDIT-03 | RN-ACCESS: TECNICO nao consulta auditoria | `/audit` | GET | Authorization TECNICO | Nenhum | Integracao | Autorizacao por perfil | 403 | `tecnicoToken` |
| TI-AUDIT-04 | RF-AUDIT: escrita gera log | `/audit` | GET | Authorization ADMIN | Nenhum | Integracao | Auditoria de operacoes | 200, log contem CREATE_* | Operacoes de escrita executadas |
| TI-METHOD-01 | RN-HTTP: metodo nao suportado tratado consistentemente | `/auth/login` | DELETE | Nenhum | Nenhum | Integracao | Validacao de metodo HTTP | 404 com erro JSON | API ativa |
| TI-METHOD-02 | RN-HTTP: PATCH sem id nao suportado | `/herbs` | PATCH | Nenhum | Nenhum | Integracao | Validacao de metodo HTTP | 404 com erro JSON | API ativa |
| TI-METHOD-03 | RN-HTTP: endpoint inexistente tratado | `/unknown-resource` | POST | Nenhum | Nenhum | Integracao | Validacao de endpoint inexistente | 404 com erro JSON | API ativa |
