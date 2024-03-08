# Waner-On Life Insurance Pricing

## US-5 - Eu, como Admin, posso alterar uma cobertura, para que a precificação esteja atualizada.

A cobertura deve poder ser atualizada em qualquer campo, exceto o id gerado. E deve respeitar as mesmas regras do cadastro.

Os campos podem ser atualizados todos ou parcialmente, nesse caso, se o endpoint de edição for chamado passando apenas um campo, somente este campo deve ser alterado na cobertura.

Ao editar um item que foi deletado [US-6](./us-6-remove-coverage.md), este deve ser "ativado" novamente, sobrescrevendo o soft delete.

**PATCH** `/coverage/:coverageId`

Request Payload

```json
{
    "name"?: <string>,
    "description"?: <string>,
    "capital"?: <number>,
    "premium"?: <number>
}
```

Example:

```json
{
  "capital": 15000
}
```

Response Payload - HTTP STATUS `200`

```json
{
    "data": {
        "coverageId": <string>,
        "name": <string>,
        "description": <string>,
        "capital": <number>,
        "premium": <number>
    }
}
```

Example:

```json
{
  "data": {
    "coverageId": "d4358c00-9d32-4eb0-a28a-5df07f42622c",
    "name": "Invalidez",
    "description": "A coverage description",
    "capital": 15000,
    "premium": 20
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
    "message": "`capital` should be multiple of 10 and grater than or equal 1000"
  }
}
```

- Unauthorized - HTTP STATUS `401`

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Unauthorized"
  }
}
```

- Forbidden - HTTP STATUS `403`

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Forbidden"
  }
}
```

- Not Found - HTTP STATUS `404`

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Coverage not found"
  }
}
```

- Conflict - HTTP STATUS `409`

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Coverage already exists"
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
