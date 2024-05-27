## K8s prerequisites

You will need a `secrets.yml` in the `k8s` folder with the following content:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: document-center-be-secrets
  namespace: document-center
type: Opaque
data: 
  POSTGRES_PASSWORD=REPLACE_ME
  POSTGRES_USER=REPLACE_ME
  POSTGRES_DB=REPLACE_ME
  DATABASE_URL=REPLACE_ME

---
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secrets
  namespace: document-center
type: Opaque
data:
  POSTGRES_DB: REPLACE_ME
  POSTGRES_USER: REPLACE_ME
  POSTGRES_PASSWORD: REPLACE_ME

---
apiVersion: v1
kind: Secret
metadata:
  name: minio-secrets
  namespace: document-center
type: Opaque
data:
  MINIO_ACCESS_KEY: REPLACE_ME
  MINIO_SECRET_KEY: REPLACE_ME
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
