# Waner-On Life Insurance Pricing

## US-5 - Eu, como Admin, posso remover uma cobertura, para não permitir mais a precificação com esta cobertura.

Para este case, utilize um `soft delete` para remover a cobertura do banco de dados. Lembre-se que os itens deletados não devem poder ser utilizados na precificação.

**DELETE** `/coverage/:coverageId`

Request Payload

```json
???
```

Response Payload - HTTP STATUS 204

```json
No content
```

Error Response - HTTP STATUS 400

```json
{
    "error": {
        "code": <string>,
        "message": <string>
    }
}
```

Error Response - HTTP STATUS 401

```json
{
    "error": {
        "code": <string>,
        "message": <string>
    }
}
```

Error Response - HTTP STATUS 403

```json
{
    "error": {
        "code": <string>,
        "message": <string>
    }
}
```

Error Response - HTTP STATUS 404

```json
{
    "error": {
        "code": <string>,
        "message": <string>
    }
}
```

Error Response - HTTP STATUS 500

```json
{
    "error": {
        "code": <string>,
        "message": <string>
    }
}
```
