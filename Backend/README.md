# Backend API Documentation

## Endpoints

### POST `/users/register`

**Description:** Registers a new user account. Validates the input data, hashes the password, creates the user in the database, generates a JWT auth token, and sets it as an HTTP-only cookie.

---

### Request

**Method:** `POST`

**URL:** `/users/register`

**Content-Type:** `application/json`

#### Request Body

| Field                | Type   | Required | Validation                                      |
| -------------------- | ------ | -------- | ------------------------------------------------ |
| `fullName.firstName` | String | Yes      | Minimum 3 characters                             |
| `fullName.lastName`  | String | No       | Minimum 3 characters (if provided)               |
| `email`              | String | Yes      | Must be a valid email, minimum 5 characters, unique |
| `password`           | String | Yes      | Minimum 6 characters                             |

#### Example Request Body

```json
{
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

---

### Responses

#### ✅ `201 Created` — User registered successfully

The response includes the newly created user object and sets a JWT token as an HTTP-only cookie.

```json
{
  "message": "User created successfully",
  "newUser": {
    "_id": "64f...",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

> **Note:** The `password` field is excluded from the response (`select: false` in the schema).

#### ❌ `400 Bad Request` — Validation errors

Returned when one or more fields fail validation (e.g. missing first name, invalid email, short password).

```json
{
  "errors": [
    {
      "msg": "First name must be at least 3 characters long",
      "param": "fullName.firstName",
      "location": "body"
    }
  ]
}
```

#### ❌ `400 Bad Request` — User already exists

Returned when a user with the provided email is already registered.

```json
{
  "message": "User already exists"
}
```

---

### Notes

- On successful registration, a JWT cookie named `token` is set with the following options:
  - `httpOnly: true`
  - `secure: true`
  - `sameSite: "strict"`
  - `maxAge: 15 hours`
- The password is hashed using **bcrypt** (11 salt rounds) before being stored.
- The JWT token expires in **1 day**.

---

### POST `/users/login`

**Description:** Authenticates an existing user. Validates the input, checks the email exists in the database, compares the password using bcrypt, generates a JWT auth token, and sets it as an HTTP-only cookie.

---

### Request

**Method:** `POST`

**URL:** `/users/login`

**Content-Type:** `application/json`

#### Request Body

| Field      | Type   | Required | Validation                         |
| ---------- | ------ | -------- | ---------------------------------- |
| `email`    | String | Yes      | Must be a valid email              |
| `password` | String | Yes      | Minimum 6 characters               |

#### Example Request Body

```json
{
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

---

### Responses

#### ✅ `200 OK` — User logged in successfully

The response includes the user object and sets a JWT token as an HTTP-only cookie.

```json
{
  "message": "User logged in successfully",
  "user": {
    "_id": "64f...",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

#### ❌ `400 Bad Request` — Validation errors

Returned when email or password fail validation.

```json
{
  "errors": [
    {
      "msg": "Invalid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

#### ❌ `400 Bad Request` — Missing fields

Returned when email or password are not provided in the request body.

```json
{
  "message": "All Fields are required"
}
```

#### ❌ `401 Unauthorized` — Invalid credentials

Returned when the email does not exist or the password is incorrect.

```json
{
  "status": 401,
  "message": "Invalid Credentials"
}
```

---

### Notes

- On successful login, a JWT cookie named `token` is set with the following options:
  - `httpOnly: true`
  - `secure: true`
  - `sameSite: "strict"`
  - `maxAge: 15 hours`
- The JWT token expires in **1 day**.
- The `password` field is explicitly selected for comparison but is not returned in the response.
