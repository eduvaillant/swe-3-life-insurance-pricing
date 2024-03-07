# Waner-On Life Insurance Pricing

## US-1 - Eu, como Admin, posso cadastrar novos usuários `admin`, fornecendo o email e senha

O Admin deve poder cadastrar novos usuários no sistema, esses usuários por padrão terão a role `user`.

O sistema deve gerar um id único para o usuário.

Não deve ser permitido o cadastro de `username` já existentes, também não se deve permitir uma `username` ou `password` vazios, ou seja, strings vazias ou contendo somente espaços.

O sistema deve garantir uma senha forte, que nesse caso devem seguir as seguintes regras:

- Conter no mínimo 8 caracteres
- Conter no máximo 64 caracteres
- Conter letras maiúsculas e minúsculas
- Conter números
- Conter pelo menos um dos seguintes símbolos @#!$%, outros símbolos não devem ser permitidos

_Dica: utilize Regex para validar a senha_

**POST** `/users`

Request Payload

```json
{
    "username": <string>,
    "password": <string>
}
```

Response Payload - HTTP STATUS 201

```json
{
    "data": {
        "userId": <string>,
        "username": <string>,
        "role": <string>
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

Error Response - HTTP STATUS 409

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
