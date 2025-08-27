# API – Integração de Credenciais Moodle (Inscrição + Eventos CDP)

Versão: 1.0 • Última atualização: 27/08/2025

## 1) Visão geral

Esta API cria/atualiza usuários no Moodle, realiza matrícula em cursos e emite eventos de conversão (CDP) para registrar a entrega de credenciais. O payload base segue o contrato `moodleInscInterface` utilizado no serviço (TypeScript).

> Filosofia: requisição idempotente, validação rígida e trilha de auditoria via eventos `rds_exist` (usuário já existente) e `rds_new` (usuário recém-criado).

---

## 2) Autenticação

* **Tipo**: `Bearer Token` (JWT ou API Key)
* **Header**: `Authorization: Bearer <token>`
* **Escopos sugeridos**: `moodle.users.write`, `moodle.enrolments.write`, `events.cdp.write`

**Segurança extra (opcional):**

* `Idempotency-Key` no header para prevenir duplicação em reenvios.
* `X-Signature` HMAC-SHA256 do corpo (webhooks, ver §10).

---

## 3) Endpoints

### 3.1 Criar/Atualizar usuário + Inscrição + Emissão de eventos

`POST /api/v1/moodle/credentials`

**Ações executadas pelo endpoint:**

1. Cria ou atualiza o usuário no Moodle.
2. Matricula o usuário nos cursos informados.
3. Emite **um** evento CDP:

   * `rds_new` se o usuário foi criado nesta chamada; **ou**
   * `rds_exist` se o usuário já existia.

**Headers obrigatórios**: `Authorization`, `Content-Type: application/json`

**Body (JSON)** — contrato `moodleInscInterface`:

```json
{
  "courses": [123, 456],
  "email": "aluno@dominio.com",
  "forcepasswordchange": true,
  "cohort": "",
  "institution": "Minha IES",
  "nome_completo": "Nome Sobrenome",
  "rds_exist": {
    "event_type": "CONVERSION",
    "event_family": "CDP",
    "payload": {
      "cf_institution": "Minha IES",
      "conversion_identifier": "Credenciais Moodle - Existente",
      "email": "aluno@dominio.com",
      "name": "Nome Sobrenome",
      "cf_course_description": "Curso X (2025.2)"
    }
  },
  "rds_new": {
    "event_type": "CONVERSION",
    "event_family": "CDP",
    "payload": {
      "conversion_identifier": "Credenciais Moodle - NovoTeste",
      "email": "aluno@dominio.com",
      "name": "Nome Sobrenome",
      "cf_institution": "Minha IES",
      "cf_course_description": "Curso X (2025.2)"
    }
  },
  "username": "aluno@dominio.com"
}
```

**Respostas**

* `201 Created` (usuário criado, matrículas feitas, evento `rds_new` emitido)
* `200 OK` (usuário já existia, matrículas conferidas/atualizadas, evento `rds_exist` emitido)
* `400 Bad Request` (validação)
* `401 Unauthorized` / `403 Forbidden` (auth)
* `409 Conflict` (violação idempotente/duplicidade)
* `5xx` (erro interno/dep. Moodle/CDP)

**Exemplo 201**

```json
{
  "status": "created",
  "user": {"id": 98765, "email": "aluno@dominio.com"},
  "enrolments": [{"courseid": 123, "status": "enrolled"}, {"courseid": 456, "status": "enrolled"}],
  "event": {"type": "rds_new", "emitted_at": "2025-08-27T13:02:00Z"}
}
```

**Exemplo 200**

```json
{
  "status": "updated",
  "user": {"id": 98765, "email": "aluno@dominio.com"},
  "enrolments": [{"courseid": 123, "status": "already_enrolled"}, {"courseid": 456, "status": "enrolled"}],
  "event": {"type": "rds_exist", "emitted_at": "2025-08-27T13:02:00Z"}
}
```

---

## 4) Esquema de dados (contrato)

### 4.1 `moodleInscInterface`

| Campo                 | Tipo       | Obrigatório | Regras/Observações                                                      |
| --------------------- | ---------- | :---------: | ----------------------------------------------------------------------- |
| `courses`             | `number[]` |      ✔︎     | IDs de cursos no Moodle (mín. 1).                                       |
| `email`               | `string`   |      ✔︎     | E-mail válido e único no Moodle.                                        |
| `forcepasswordchange` | `boolean`  |      ✔︎     | `true` para exigir troca de senha no 1º login.                          |
| `cohort`              | `string`   |      –      | Nome da coorte/grupo (opcional).                                        |
| `institution`         | `string`   |      ✔︎     | IES/organização de vínculo.                                             |
| `nome_completo`       | `string`   |      ✔︎     | Nome completo (será mapeado a `firstname`/`lastname` conforme parsing). |
| `rds_exist`           | `EventCDP` |      ✔︎     | Modelo de evento para usuário já existente.                             |
| `rds_new`             | `EventCDP` |      ✔︎     | Modelo de evento para usuário novo.                                     |
| `username`            | `string`   |      ✔︎     | Recomenda-se usar o e-mail.                                             |

### 4.2 `EventCDP`

| Campo          | Tipo           | Obrigatório | Observações         |
| -------------- | -------------- | :---------: | ------------------- |
| `event_type`   | `"CONVERSION"` |      ✔︎     | Literal.            |
| `event_family` | `"CDP"`        |      ✔︎     | Literal.            |
| `payload`      | `EventPayload` |      ✔︎     | Conteúdo do evento. |

### 4.3 `EventPayload`

| Campo                   | Tipo     | Obrigatório | Observações                                              |
| ----------------------- | -------- | :---------: | -------------------------------------------------------- |
| `conversion_identifier` | `string` |      ✔︎     | Chave do evento (ex.: "Credenciais Moodle - NovoTeste"). |
| `email`                 | `string` |      ✔︎     | Mesmo e-mail do usuário.                                 |
| `name`                  | `string` |      ✔︎     | Nome para identificação amigável.                        |
| `cf_institution`        | `string` |      ✔︎     | Instituição do caso de uso.                              |
| `cf_course_description` | `string` |      ✔︎     | Descrição humana do(s) curso(s).                         |

---

## 5) Regras de negócio

1. **Upsert de usuário**: se e-mail já existe no Moodle → apenas atualiza metadados mínimos, **não** sobrescreve senha.
2. **Matrículas**: idempotentes por `userId+courseId`.
3. **Eventos CDP**: emitir **somente um** por chamada, coerente com o resultado do upsert (`rds_new` vs `rds_exist`).
4. **Username**: usar `email` como padrão reduz colisão.
5. **`forcepasswordchange`**: definido no Moodle; se `true`, usuário deve trocar senha no primeiro login.

---

## 6) Validações

* `email` obrigatório e válido (RFC 5322 simplificado).
* `courses` não vazio; todos numéricos positivos.
* `institution`, `nome_completo`, `username` não vazios.
* `rds_*` presentes e completos; `event_type` = `CONVERSION` e `event_family` = `CDP`.
* Tamanho máx. de campos textuais: 255 caracteres (sugestão).

**Erros comuns**

* `400-VALIDATION-EMAIL`: e-mail inválido.
* `400-VALIDATION-COURSES_EMPTY`: lista de cursos vazia.
* `409-DUPLICATE-USERNAME`: colisão de `username`.
* `502-MOODLE-UPSTREAM`: falha na API Moodle.
* `502-CDP-UPSTREAM`: falha ao emitir evento.

---

## 7) Exemplos de uso

### 7.1 cURL

```bash
curl -X POST https://api.exemplo.com/api/v1/moodle/credentials \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 7400a4a8-9f0e-43a1-8b8f-4d8b0c9b7b6e" \
  -d '{
    "courses": [101, 202],
    "email": "aluno@dominio.com",
    "forcepasswordchange": true,
    "cohort": "",
    "institution": "IES Alpha",
    "nome_completo": "Maria da Silva",
    "rds_exist": {"event_type": "CONVERSION", "event_family": "CDP", "payload": {"cf_institution": "IES Alpha", "conversion_identifier": "Credenciais Moodle - Existente", "email": "aluno@dominio.com", "name": "Maria da Silva", "cf_course_description": "Engenharia de Dados (2025.2)"}},
    "rds_new": {"event_type": "CONVERSION", "event_family": "CDP", "payload": {"conversion_identifier": "Credenciais Moodle - NovoTeste", "email": "aluno@dominio.com", "name": "Maria da Silva", "cf_institution": "IES Alpha", "cf_course_description": "Engenharia de Dados (2025.2)"}},
    "username": "aluno@dominio.com"
  }'
```

### 7.2 TypeScript (fetch)

```ts
async function enrolMoodle(body: MoodleInscInterface) {
  const res = await fetch("/api/v1/moodle/credentials", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

---

## 8) Mapeamento para Moodle (referência)

| Nosso campo           | Moodle (user)                                      |
| --------------------- | -------------------------------------------------- |
| `email`               | `email`                                            |
| `username`            | `username`                                         |
| `nome_completo`       | `firstname` + `lastname` (split por último espaço) |
| `institution`         | `institution`                                      |
| `forcepasswordchange` | `preferences.forcepasswordchange`                  |
| `courses[]`           | Inscrição via `enrol_manual_enrol_users`           |

> Observação: o split de `nome_completo` pode ser customizado para nomes compostos (ex.: manter tudo em `lastname` após o primeiro espaço).

---

## 9) Idempotência e retraço

* Utilize `Idempotency-Key` por tentativa de criação; o servidor guarda hash do corpo por 24h.
* Reenvios com o mesmo corpo retornam a mesma resposta (`201` ou `200`).

---

## 10) Webhooks de confirmação (opcional)

`POST https://seu-sistema.com/webhooks/moodle-credentials`

**Eventos enviados**

* `moodle.credentials.created`
* `moodle.credentials.updated`

**Assinatura HMAC**

* Header `X-Signature: t=<timestamp>,v1=<hex>`
* `v1 = HMAC_SHA256(secret, <timestamp> + "." + <raw-body>)`

**Exemplo de webhook**

```json
{
  "event": "moodle.credentials.created",
  "occurred_at": "2025-08-27T13:02:00Z",
  "user": {"id": 98765, "email": "aluno@dominio.com"},
  "courses": [101, 202]
}
```

---

## 11) Códigos de erro e mensagens

| Código                     | HTTP | Mensagem                            |
| -------------------------- | ---: | ----------------------------------- |
| `VALIDATION-EMAIL`         |  400 | E-mail inválido.                    |
| `VALIDATION-COURSES_EMPTY` |  400 | Lista de cursos não pode ser vazia. |
| `DUPLICATE-USERNAME`       |  409 | Username já em uso.                 |
| `MOODLE-UPSTREAM`          |  502 | Falha ao conectar no Moodle.        |
| `CDP-UPSTREAM`             |  502 | Falha ao emitir evento CDP.         |
| `UNKNOWN`                  |  500 | Erro interno.                       |

---

## 12) Esquema JSON (validado no backend)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://api.exemplo.com/schemas/moodleInscInterface.json",
  "type": "object",
  "required": ["courses", "email", "forcepasswordchange", "institution", "nome_completo", "rds_exist", "rds_new", "username"],
  "properties": {
    "courses": {"type": "array", "minItems": 1, "items": {"type": "integer", "minimum": 1}},
    "email": {"type": "string", "format": "email", "maxLength": 255},
    "forcepasswordchange": {"type": "boolean"},
    "cohort": {"type": "string"},
    "institution": {"type": "string", "minLength": 1, "maxLength": 255},
    "nome_completo": {"type": "string", "minLength": 1, "maxLength": 255},
    "rds_exist": {"$ref": "#/definitions/EventCDP"},
    "rds_new": {"$ref": "#/definitions/EventCDP"},
    "username": {"type": "string", "minLength": 1, "maxLength": 255}
  },
  "definitions": {
    "EventCDP": {
      "type": "object",
      "required": ["event_type", "event_family", "payload"],
      "properties": {
        "event_type": {"const": "CONVERSION"},
        "event_family": {"const": "CDP"},
        "payload": {"$ref": "#/definitions/EventPayload"}
      }
    },
    "EventPayload": {
      "type": "object",
      "required": ["conversion_identifier", "email", "name", "cf_institution", "cf_course_description"],
      "properties": {
        "conversion_identifier": {"type": "string", "minLength": 1},
        "email": {"type": "string", "format": "email"},
        "name": {"type": "string", "minLength": 1},
        "cf_institution": {"type": "string", "minLength": 1},
        "cf_course_description": {"type": "string", "minLength": 1}
      }
    }
  }
}
```

---

## 13) SLA & limites

* **Taxa**: 60 req/min por token.
* **Timeout**: 15 s.
* **Retry**: exponencial (base 2) para erros `5xx` (máx. 3 tentativas), **não** reexecute sem `Idempotency-Key`.

---

## 14) Checklist de implantação

* [ ] Token com escopos corretos.
* [ ] Mapeamento de `nome_completo` → `firstname/lastname` revisado.
* [ ] Cursos válidos e existentes no Moodle.
* [ ] Webhook configurado e verificado (assinatura HMAC).
* [ ] Observabilidade: logs com `Idempotency-Key`, `email` (hash ou mascarado), resultado do evento.

---

## 15) Roadmap (próximas melhorias)

* Suporte a campos customizados do Moodle (profile fields).
* Template de e-mail transacional com link de primeiro acesso.
* Batch de inscrições (CSV/NDJSON) com transação parcial.

---

## 16) Anexos

* Exemplo de resposta `400`:

```json
{
  "error": {
    "code": "VALIDATION-COURSES_EMPTY",
    "message": "A lista de cursos deve conter ao menos um ID.",
    "details": {"field": "courses"}
  }
}
```
