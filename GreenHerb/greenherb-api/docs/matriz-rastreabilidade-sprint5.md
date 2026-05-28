# Matriz de Rastreabilidade - Sprint 5 GREENHERB

| ID do Caso de Teste | Requisito / Regra de Negocio | Funcionalidade | Ficheiro / Funcao Testada | Nivel de Teste | Tecnica Aplicada | Estrutura de Controlo Coberta | Decisao / Condicao Coberta | Condicoes Atomicas | Caminho Coberto | Input | Resultado Esperado | Pre-condicoes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| WB-PLAN-01 | RN-PLAN-01 | Criacao de planos | `src/services/plans.service.js` / `createPlan` | Unidade / White-box | Cobertura de decisao | IF-PLAN-01 | type obrigatorio | type ausente=true | Erro por type ausente | Plano sem `type` | 400 | Nenhuma |
| WB-PLAN-02 | RN-PLAN-01 | Criacao de planos | `plans.service.js` / `createPlan` | Unidade / White-box | Cobertura de decisao | IF-PLAN-03 | type pertence a enumeracao | type invalido=true | Erro por tipo invalido | `type=SEMANAL` | 400 | Nenhuma |
| WB-PLAN-03 | RN-PLAN-01 | Criacao de planos | `plans.service.js` / `createPlan` | Unidade / White-box | Cobertura de caminho | IF-PLAN-01, IF-PLAN-03, IF-PLAN-09 | type valido e nao PONTUAL | type ausente=false; type invalido=false; type!=PONTUAL=true | Plano REGULAR aceite | REGULAR valido | Plano aceite, `type=REGULAR` | Nenhuma |
| WB-PLAN-04 | RN-PLAN-02 | Criacao de planos | `plans.service.js` / `createPlan` | Unidade / White-box | Cobertura de decisao | IF-PLAN-04 | herbId obrigatorio | herbId ausente=true | Erro por herbId ausente | Plano sem `herbId` | 400 | Nenhuma |
| WB-PLAN-05 | RN-PLAN-03 | Criacao de planos | `plans.service.js` / `createPlan` | Unidade / White-box | Cobertura de decisao | IF-PLAN-06 | campo numerico obrigatorio | temperature ausente=true | Erro por campo numerico ausente | Plano sem `temperature` | 400 | Nenhuma |
| WB-PLAN-06 | RN-PLAN-03 | Criacao de planos | `plans.service.js` / `createPlan` | Unidade / White-box | Cobertura de condicao | IF-PLAN-07 | campo numerico deve ser number | typeof temperature!="number" | Erro por tipo invalido | `temperature="vinte"` | 400 | Nenhuma |
| WB-PLAN-07 | RN-PLAN-04 | Criacao de planos | `plans.service.js` / `createPlan` | Unidade / White-box | Analise de valores limite, MC/DC | IF-PLAN-08 | value < min | temperature < 18=true | Erro abaixo do minimo | `temperature=17` | 400 | Nenhuma |
| WB-PLAN-08 | RN-PLAN-04 | Criacao de planos | `plans.service.js` / `createPlan` | Unidade / White-box | Analise de valores limite | IF-PLAN-08 | value > max | temperature > 28=true | Erro acima do maximo | `temperature=29` | 400 | Nenhuma |
| WB-PLAN-09 | RN-PLAN-04, RN-PLAN-05, RN-PLAN-06, RN-PLAN-07 | Criacao de planos | `plans.service.js` / `createPlan` | Unidade / White-box | Analise de valores limite | IF-PLAN-08 | limites inferiores validos | value<min=false; value>max=false | Plano aceite nos limites inferiores | temperature=18, humidity=40, luminosity=5000, cycle=1 | Plano aceite | Nenhuma |
| WB-PLAN-10 | RN-PLAN-04, RN-PLAN-05, RN-PLAN-06, RN-PLAN-07 | Criacao de planos | `plans.service.js` / `createPlan` | Unidade / White-box | Analise de valores limite | IF-PLAN-08 | limites superiores validos | value<min=false; value>max=false | Plano aceite nos limites superiores | temperature=28, humidity=80, luminosity=25000, cycle=365 | Plano aceite | Nenhuma |
| WB-PLAN-11 | RN-PLAN-01, RN-PLAN-08 | Criacao de planos | `plans.service.js` / `createPlan` | Unidade / White-box | Cobertura de caminho | IF-PLAN-09 | type != PONTUAL | type!=PONTUAL=true | EMERGENCIA sem autorizacao especial | EMERGENCIA valido | Plano aceite | Nenhuma |
| WB-PLAN-12 | RN-PLAN-08 | Criacao de planos | `plans.service.js` / `createPlan` | Unidade / White-box, MC/DC | IF-PLAN-09, IF-PLAN-10 | PONTUAL sem autorizacao | type!=PONTUAL=false; hasAuth=false; role RESPONSAVEL=true | Erro por autorizacao ausente | PONTUAL com `hasResponsibleAuthorization=false` | 403 | Parametros validos |
| WB-PLAN-13 | RN-PLAN-08 | Criacao de planos | `plans.service.js` / `createPlan` | Unidade / White-box, MC/DC | IF-PLAN-11 | PONTUAL com perfil errado | hasAuth=true; role RESPONSAVEL=false | Erro por perfil errado | PONTUAL autorizado por TECNICO | 403 | Parametros validos |
| WB-PLAN-14 | RN-PLAN-08 | Criacao de planos | `plans.service.js` / `createPlan` | Unidade / White-box, MC/DC | IF-PLAN-09, IF-PLAN-10, IF-PLAN-11 | PONTUAL corretamente autorizado | type!=PONTUAL=false; hasAuth=true; role RESPONSAVEL=true | Plano PONTUAL aceite | PONTUAL autorizado por RESPONSAVEL | Plano aceite | Parametros validos |
| WB-PLAN-15 | RN-PLAN-09 | Criacao de planos | `plans.service.js` / `createPlan` | Unidade / White-box | Cobertura de caminho | IF-PLAN-03 | normalizacao antes da enumeracao | type invalido=false apos uppercase | Plano aceite apos normalizacao | `type=regular` | `type=REGULAR` | Nenhuma |
| WB-PLAN-16 | RN-PLAN-03 | Criacao de planos | `plans.service.js` / `createPlan` | Unidade / White-box | Cobertura de caminhos relevantes | IF-PLAN-06, IF-PLAN-07, IF-PLAN-08 | todos os campos numericos avaliados | obrigatorio=false; tipo invalido=false; fora intervalo=false | Todos os parametros aceites | Plano REGULAR valido completo | Plano aceite com 4 campos numericos | Nenhuma |
| WB-PLAN-17 | RN-PLAN-10 | Criacao de planos | `plans.service.js` / `createPlan` | Unidade / White-box, MC/DC | IF-PLAN-08 antes de IF-PLAN-10/11 | parametros invalidos apesar de autorizacao correta | parametersValid=false; hasAuth=true; role RESPONSAVEL=true | Erro por parametro invalido | PONTUAL com temperature=17 e autorizacao correta | 400 | Nenhuma |
| WB-PLAN-18 | RN-PLAN-08 | Criacao de planos | `plans.service.js` / `createPlan` | Unidade / White-box, MC/DC | IF-PLAN-09, IF-PLAN-10 | complemento para independencia de C2 | parametersValid=true; type!=PONTUAL=false; hasAuth=false; role RESPONSAVEL=false | Erro por PONTUAL sem autorizacao | PONTUAL sem autorizacao e sem role | 403 | Parametros validos |

## Mapeamento MC/DC

| Caso MC/DC | Teste Jest | Condicao demonstrada |
| --- | --- | --- |
| MCDC-PLAN-01 | WB-PLAN-03 | Resultado verdadeiro com parametros validos e tipo nao PONTUAL |
| MCDC-PLAN-02 | WB-PLAN-07 | Influencia independente de `parametersValid` |
| MCDC-PLAN-03 | WB-PLAN-14 | Resultado verdadeiro para PONTUAL autorizado corretamente |
| MCDC-PLAN-04 | WB-PLAN-12 | Influencia independente de `hasResponsibleAuthorization` |
| MCDC-PLAN-05 | WB-PLAN-13 | Influencia independente de `authorizedByRole` |
| MCDC-PLAN-06 | WB-PLAN-18 | Complemento para influencia independente de `type !== "PONTUAL"` |
| MCDC-PLAN-07 | WB-PLAN-17 | Parametros invalidos prevalecem sobre autorizacao correta |
