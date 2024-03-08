# Waner-On Life Insurance Pricing

## US-3 - Eu, como User, posso efetuar um login com a senha fornecida pelo Admin, para gerar um JWT token e consumir a api de precificação.

O usuário deve poder efetuar o login no sistema fornecendo o usuário e senha, e deve receber de volta um token JWT assinado que será utilizado para o consumo das APIs.

O token deve ser gerando no formato de JWT assinado, utilizando uma chave assimétrica.

Lembre-se de fazer o tratamento correto dos erros, como por exemplo (mas não somente):

- payload inválido
- senha incorreta

Para manter a privacidade e segurança, a falha na autenticação (dado um payload correto) deve apenas informar que a combinação `username` e `password` está incorreta.

**POST** `/auth`

Request Payload

```json
{
    "username": <string>,
    "password": <string>
}
```

Response Payload - HTTP STATUS `200`

```json
{
    "data": {
        "user": {
            "userId": <string>,
            "username": <string>,
            "role": <string>
        },
        "token": <string>
    }
}
```

Example:

```json
{
  "data": {
    "user": {
      "userId": "2396ae3a-9c4c-4c53-9b69-ad6430b473d9",
      "username": "aUsername",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  }
}
```

Error Response - Payload

```json
{
    "error": {
        "code": <string>,
        "message": <string>
    }
}
```

Examples:

- Bad Request - HTTP STATUS `400`

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "username is required"
  }
}
```

- Unauthorized - HTTP STATUS `401`

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "`username` or `password` are invalid"
  }
}
```

- Internal Server Error - HTTP STATUS `500`

```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Internal Server Error"
  }
}
```
