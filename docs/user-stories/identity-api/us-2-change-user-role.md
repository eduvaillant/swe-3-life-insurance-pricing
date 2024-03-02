# Waner-On Life Insurance Pricing

## US-2 - Eu, como Admin, alterar a role de um usuário para `user` ou `admin`

O Admin deve alterar a role de um usuário. As roles permitidas são `user` ou `admin`

**PATCH** `/users/:userId`

Request Payload
```json
{
    "role": <string>
}
```

Response Payload - HTTP STATUS `???`
```json
{
    "data": {
        "userId": <string>,
        "username": <string>,
        "role": <string>
    }
}
```

Error Response - HTTP STATUS `???` (especificar para cada erro tratado)
```json
{
    "error": {
        "code": <string>,
        "message": <string>
    }
}
```
