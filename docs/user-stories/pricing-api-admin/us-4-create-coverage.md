# Waner-On Life Insurance Pricing

## US-4 - Eu, como Admin, posso cadastrar um novo tipo de cobertura, para que seja selecionada durante a precificação.

A cobertura é um item dentro do produto de seguro de vida, e para garantir a precificação dinâmica, cada precificação deve receber um conjunto de coberturas, além das informações do segurado (tratado na [US-8](../pricing-api-user/us-8-dynamic-pricing.md))

Para isso será necessário desenvolver um cadastro e manutenção das coberturas.

A cada cobertura deve ter um nome e descrição, além de um id único gerado pelo sistema, e os campos capital e premium.

Para este case e a forma que a cobertura será utilizada na precificação, o valor do capital deve ser um múltiplo de 10 maior ou igual a 1000.

O premio deve ser um valor maior que 0 e menor do que 30% o valor do capital,

O nome deve ser único no cadastro.

Exemplo de coberturas:

```
Invalidez Funcional Permanente Total por Doença

Essa cobertura garante a antecipação do pagamento da indenização relativa à garantia básica de Morte, em caso de invalidez funcional permanente total, consequente de doença.
```

```
Indenização Especial por Morte Acidental

Essa cobertura garante um pagamento adicional, de mesmo valor, da indenização do seguro por Morte. Ou seja, o(s) beneficiário(s) da indenização receberá(ão) o dobro do capital segurado em caso de morte especifica por acidente.
```

**POST** `/coverage`

Request Payload

```json
{
    "name": <string>,
    "description": <string>,
    "capital": <number>,
    "premium": <number>
}
```

Example:

```json
{
  "name": "Invalidez",
  "description": "A coverage description",
  "capital": 10000,
  "premium": 20
}
```

Response Payload - HTTP STATUS `201`

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
    "capital": 10000,
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
