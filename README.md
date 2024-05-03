<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

# blog-api-nestjs

## REST_API

The Rest api to the blog api is described below,

## AUTHENTICATION

## <ins>Create User</ins>

### Request

- POST /user

```bash
curl --location 'http://localhost:3000/user' \
--header 'x-api-key: live_sk_65ab9353145cab9557ab93df95e31d62629c343' \
--header 'app-id: 9a2f92ad-3613-4074-9027-3b63de7149d8' \
--header 'Content-Type: application/json' \
--data-raw '{
    "user": {
        "username": "AKintunde Bello",
        "email": "AkinsTheMan@gmail.com",
        "password": "AkinsTheMan@123454"
    }
}'
```

### Response

```json
{
  "user": {
    "username": "AKintunde Bello",
    "email": "AkinsTheMan@gmail.com",
    "id": 14,
    "bio": "",
    "image": "",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiQWtpbnNUaGVNYW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJBS2ludHVuZGUgQmVsbG8iLCJpYXQiOjE3MTQ2OTM4MjEsImV4cCI6MTcxNDY5NDcyMX0.KwBXTmZJLOjArYg09c7ARd-reXkJtKJqzeoH3smlweM"
  }
}
```

## <ins>User Login</ins>

### Request

- POST /user/login

```bash
curl --location 'http://localhost:3000/user/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "user":  {
        "email": "AkinsTheMan@gmail.com",
        "password": "AkinsTheMan@123454"
    }
}'
```

### Response

```json
{
  "user": {
    "id": 14,
    "username": "AKintunde Bello",
    "email": "AkinsTheMan@gmail.com",
    "bio": "",
    "image": "",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiQWtpbnNUaGVNYW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJBS2ludHVuZGUgQmVsbG8iLCJpYXQiOjE3MTQ2OTQxMDMsImV4cCI6MTcxNDY5NTAwM30.UNYYq8FXiSepeHUFHlHat8_PnTdXi8yqxEeLKtXBTPo"
  }
}
```

## USER

### <ins>Update User</ins>

### Request

```
curl --location --request PUT 'http://localhost:3000/user' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiQWtpbnNUaGVNYW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJBS2ludHVuZGUgQmVsbG8iLCJpYXQiOjE3MTQ2OTQxMDMsImV4cCI6MTcxNDY5NTAwM30.UNYYq8FXiSepeHUFHlHat8_PnTdXi8yqxEeLKtXBTPo' \
--data '{
    "user": {
        "bio": "Some bio",
        "image": "https://i.stack.imgur.com/xHWG8jpg"
    }
}'
```

### Response

```json
{
  "user": {
    "id": 14,
    "username": "AKintunde Bello",
    "email": "AkinsTheMan@gmail.com",
    "bio": "Some bio",
    "image": "https://i.stack.imgur.com/xHWG8jpg"
  }
}
```

## <ins>Get User</ins>

### Request

```
curl --location 'http://localhost:3000/user' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsImVtYWlsIjoiQWtpbnNUaGVNYW5AZ21haWwuY29tIiwidXNlcm5hbWUiOiJBS2ludHVuZGUgQmVsbG8iLCJpYXQiOjE3MTQ2OTQxMDMsImV4cCI6MTcxNDY5NTAwM30.UNYYq8FXiSepeHUFHlHat8_PnTdXi8yqxEeLKtXBTPo'
```

### Response

```json
{
  "user": {
    "id": 14,
    "username": "AKintunde Bello",
    "email": "AkinsTheMan@gmail.com",
    "bio": "Some bio",
    "image": "https://i.stack.imgur.com/xHWG8jpg"
  }
}
```

## ARTICLE
### <ins>Create Article</ins>
### Request

```
curl --location 'http://localhost:3000/articles' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJoYXJ3YXJsODdAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkb2t1biIsImlhdCI6MTcxNDY3MTEyNSwiZXhwIjoxNzE0NjcyMDI1fQ.JMbPPRm6XUj1NutlNUAUgghx0711L4GUXTK1Rpv6hkU' \
--data '{
    "article": {
        "title": "This is my first article",
        "description": "This is my description",
        "body": "This is the body",
        "tagList": ["This is it"]
    }
}'
```

### <ins>Get Article By Slug</ins>
### Request

```
curl --location 'http://localhost:3000/articles/this-is-my-first-article--685hbx.w89l7' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJoYXJ3YXJsODdAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkb2t1biIsImlhdCI6MTcxNDY3MTEyNSwiZXhwIjoxNzE0NjcyMDI1fQ.JMbPPRm6XUj1NutlNUAUgghx0711L4GUXTK1Rpv6hkU'
```

### <ins>Get Article By Slug</ins>
### Request

```
curl --location 'http://localhost:3000/articles/this-is-my-first-article--685hbx.w89l7' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJoYXJ3YXJsODdAZ21haWwuY29tIiwidXNlcm5hbWUiOiJkb2t1biIsImlhdCI6MTcxNDY3MTEyNSwiZXhwIjoxNzE0NjcyMDI1fQ.JMbPPRm6XUj1NutlNUAUgghx0711L4GUXTK1Rpv6hkU'
```


