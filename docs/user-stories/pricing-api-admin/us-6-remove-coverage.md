# Waner-On Life Insurance Pricing

## US-6 - Eu, como Admin, posso remover uma cobertura, para não permitir mais a precificação com esta cobertura.

Para este case, utilize um `soft delete` para remover a cobertura do banco de dados. Lembre-se que os itens deletados não devem poder ser utilizados na precificação.

**DELETE** `/coverage/:coverageId`

Request Payload

```json
No body
```

Response Payload - HTTP STATUS `204`

```json
No content
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
    "message": "coverageId is required"
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

- Internal Server Error - HTTP STATUS `500`

```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Internal Server Error"
  }
}
```
