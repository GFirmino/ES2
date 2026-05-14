# Matriz de Rastreabilidade - Autenticacao GREENHERB

Esta matriz cobre os testes unitarios da autenticacao do Sprint 1, usando particionamento de equivalencia para `username` e `password`.

| ID do Caso de Teste | Requisito / Regra de Negocio | Funcao / Endpoint | Nivel de Teste | Tecnica Aplicada | Classe de Equivalencia | Entrada | Resultado Esperado | Pre-condicoes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TU-AUTH-01 | Aceitar credenciais validas de utilizador existente e nao expor password | `auth.controller.login` / `POST /auth/login` | Unitario | Particionamento de equivalencia | CE-U-01 + CE-P-01 | `username="tecnico"`, `password="Tecnico123!"` | Status 200, token presente, user presente, password ausente | Utilizador `tecnico` existe em memoria |
| TU-AUTH-02 | Rejeitar username inexistente | `auth.controller.login` / `POST /auth/login` | Unitario | Particionamento de equivalencia | CE-U-02 + CE-P-01 | `username="naoexiste"`, `password="Tecnico123!"` | Status 401 | Lista de utilizadores em memoria carregada |
| TU-AUTH-03 | Rejeitar password incorreta para username existente | `auth.controller.login` / `POST /auth/login` | Unitario | Particionamento de equivalencia | CE-U-01 + CE-P-02 | `username="tecnico"`, `password="Errada123!"` | Status 401 | Utilizador `tecnico` existe em memoria |
| TU-AUTH-04 | Rejeitar username vazio | `auth.controller.login` / `POST /auth/login` | Unitario | Particionamento de equivalencia | CE-U-03 + CE-P-01 | `username=""`, `password="Tecnico123!"` | Status 400 | Nenhuma |
| TU-AUTH-05 | Rejeitar password vazia | `auth.controller.login` / `POST /auth/login` | Unitario | Particionamento de equivalencia | CE-U-01 + CE-P-03 | `username="tecnico"`, `password=""` | Status 400 | Nenhuma |
| TU-AUTH-06 | Rejeitar username em falta | `auth.controller.login` / `POST /auth/login` | Unitario | Particionamento de equivalencia | CE-U-04 + CE-P-01 | `password="Tecnico123!"` | Status 400 | Nenhuma |
| TU-AUTH-07 | Rejeitar password em falta | `auth.controller.login` / `POST /auth/login` | Unitario | Particionamento de equivalencia | CE-U-01 + CE-P-04 | `username="tecnico"` | Status 400 | Nenhuma |
| TU-AUTH-08 | Rejeitar username e password em falta | `auth.controller.login` / `POST /auth/login` | Unitario | Particionamento de equivalencia | CE-U-04 + CE-P-04 | `{}` | Status 400 | Nenhuma |
| TU-AUTH-09 | Rejeitar username com tipo invalido | `auth.controller.login` / `POST /auth/login` | Unitario | Particionamento de equivalencia | CE-U-05 + CE-P-01 | `username=123`, `password="Tecnico123!"` | Status 400 | Nenhuma |
| TU-AUTH-10 | Rejeitar password com tipo invalido | `auth.controller.login` / `POST /auth/login` | Unitario | Particionamento de equivalencia | CE-U-01 + CE-P-05 | `username="tecnico"`, `password=123` | Status 400 | Nenhuma |
| TU-AUTH-11 | Rejeitar username apenas com espacos | `auth.controller.login` / `POST /auth/login` | Unitario | Particionamento de equivalencia | CE-U-06 + CE-P-01 | `username="   "`, `password="Tecnico123!"` | Status 400 | Nenhuma |
| TU-AUTH-12 | Rejeitar password apenas com espacos | `auth.controller.login` / `POST /auth/login` | Unitario | Particionamento de equivalencia | CE-U-01 + CE-P-06 | `username="tecnico"`, `password="   "` | Status 400 | Nenhuma |

## Classes de Equivalencia

### Username

| Classe | Descricao |
| --- | --- |
| CE-U-01 | Username valido existente |
| CE-U-02 | Username valido inexistente |
| CE-U-03 | Username vazio |
| CE-U-04 | Username em falta |
| CE-U-05 | Username com tipo invalido |
| CE-U-06 | Username apenas com espacos |

### Password

| Classe | Descricao |
| --- | --- |
| CE-P-01 | Password valida correta |
| CE-P-02 | Password valida incorreta |
| CE-P-03 | Password vazia |
| CE-P-04 | Password em falta |
| CE-P-05 | Password com tipo invalido |
| CE-P-06 | Password apenas com espacos |
