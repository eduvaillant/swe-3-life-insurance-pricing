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

Example:

```json
{
  "role": "admin"
}
```

Response Payload - HTTP STATUS `200`

```json
{
    "data": {
        "userId": <string>,
        "username": <string>,
        "role": <string>
    }
}
```

Example:

```json
{
  "data": {
    "userId": "2396ae3a-9c4c-4c53-9b69-ad6430b473d9",
    "username": "aUsername",
    "role": "admin"
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
    "message": "User already has this role"
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
    "message": "User not found"
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
