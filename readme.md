# express-abstractor (Prototype)

> 📈 A conceptual Express.js wrapper for tracking per-middleware and per-handler performance in real-world apps.

## Overview

This experimental project introduces a lightweight abstraction over Express.js to track execution time and metadata at the middleware and route handler level.

It is **not a production-ready abstraction** — it's designed to support ideas discussed in the [Express.js Performance Working Group](https://github.com/expressjs/perf-wg), including:

- Real-world performance instrumentation (not just Hello World)
- Middleware and handler-level latency measurement
- Observability-focused naming and metadata support
- Compatibility with logging, flamegraphs, or profiling tools

## Motivation

Many Express.js benchmarks rely on isolated, artificial routes that don't reflect how middleware chains behave under load or in real-world deployments. This repo explores how **named middleware + execution timing** can provide visibility into:

- Where latency originates
- How each middleware contributes to the request lifecycle
- Which route handlers are slowest

This idea aligns with modern **production observability** needs and backend profiling practices.

## Features

- ✅ Wraps all middleware and handlers with `process.hrtime`-based timing
- ✅ Supports **named middleware** for tagging logs and graphs
- ✅ Logs duration of each piece of logic with structured metadata
- ✅ Easy to hook into for flamegraph tooling or log ingestion
- ⚠️ Minimal Express.js abstraction — just enough to test the idea

## Example

```ts
import expressAbstractor, { log } from './lib/express';
const app = expressAbstractor();
const port = 3000;

app.use((_req, _res, next) => {
  log(`Anonymous middleware`);
  next();
});

app.use('auth', (_req, _res, next) => {
  log(`Named middleware: auth`);
  next();
});

app.get('/', (_req, res) => {
  log(`Handler log`, { route: '/' });
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
```

## Goals

- Inspire discussion and experimentation within the Express.js Performance WG
- Serve as a starting point for tooling that makes middleware performance visible
- Eventually support profiling formats (e.g., Chrome DevTools, Flamegraphs, etc.)
- Highlight the macro and micro latency contributors in Express apps

## Contribution
This is part of the [Express.js Performance Working Group](https://github.com/expressjs/perf-wg).

All contributions, discussions, and suggestions are welcome. If you're testing out performance tools or flamegraph integrations with this, please open an issue.