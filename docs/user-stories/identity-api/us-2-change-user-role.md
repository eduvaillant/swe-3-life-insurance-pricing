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

Response Payload - HTTP STATUS 200

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

Error Response - HTTP STATUS 500

```json
{
    "error": {
        "code": <string>,
        "message": <string>
    }
}
```
