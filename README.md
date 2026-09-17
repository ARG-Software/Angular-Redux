# Angular 5 to Angular 19 Migration

This repository is the runnable companion to ARG Software's account of migrating a production-shaped Angular 5 and NgRx application to Angular 19.

The repository history preserves both ends of the migration:

- [`master`](https://github.com/ARG-Software/Angular-Redux/tree/master) contains the reviewed Angular 19 result.
- The original Angular 5 application remains available at commit [`2841a1d`](https://github.com/ARG-Software/Angular-Redux/tree/2841a1db3ff666ffb0b6f3a4c938a5426673e512).

## Support Status

Angular 19 is no longer supported upstream. This branch is a historical migration reference, not a currently supported production starter. Before deploying a derivative application, migrate it to a supported Angular release and complete a fresh dependency and security review.

## What It Demonstrates

- NgRx action creators, reducers, selectors, and effects
- NgRx Signal Store examples alongside the existing global store
- Angular 19 template and module compatibility changes
- HTTP-backed effects against a local JSON Server fixture API
- Jasmine and Karma tests for reducers, effects, service interactions, and pagination
- A fixture API contract smoke test
- AOT production builds and CI verification

## Requirements

- Node.js 20.19+, 22.13+, or a newer supported release
- Google Chrome or Chromium for the Karma test suite

## Install

```bash
npm ci
```

## Run Locally

Start the fixture API:

```bash
npm run mock:server
```

In another terminal, start Angular:

```bash
npm start
```

Open `http://localhost:4200/`. The local API listens on `http://localhost:3000/`.

The fixture routes are deterministic demonstrations. Update requests are acknowledged but are not persisted, and process-detail fixtures do not implement server-side filtering or pagination.

## Verify

```bash
npm run verify
```

This creates an AOT production build, runs the browser test suite once in headless Chrome, and probes the local fixture API's core contracts. For watch-mode tests during development, use `npm test`.

## Related Article

Read [From Angular 5 to Angular 19: A Migration Story](https://arg.software/blog/angular-5-to-19-migration/).
