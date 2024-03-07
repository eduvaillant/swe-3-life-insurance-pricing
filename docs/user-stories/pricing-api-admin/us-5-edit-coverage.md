# Waner-On Life Insurance Pricing

## US-5 - Eu, como Admin, posso alterar uma cobertura, para que a precificação esteja atualizada.

A cobertura deve poder ser atualizada em qualquer campo, exceto o id gerado. E deve respeitar as mesmas regras do cadastro.

Os campos podem ser atualizados todos ou parcialmente, nesse caso, se o endpoint de edição for chamado passando apenas um campo, somente este campo deve ser alterado na cobertura.

Ao editar um item que foi deletado [US-6](./us-6-remove-coverage.md), este deve ser "ativado" novamente, sobrescrevendo o soft delete.

**PATCH** `/coverage/:coverageId`

Request Payload

```json
???
```

Response Payload - HTTP STATUS 200

```json
{
    "data": {
        "coverageId": <string>,
        "name": <string>,
        "description": <string>,
        "capital": <string>,
        "premium": <string>
    }
}
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

Error Response - HTTP STATUS 409

```json
{
    "error": {
        "code": <string>,
        "message": <string>
    }
}
```

Error Response - HTTP STATUS 422

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
