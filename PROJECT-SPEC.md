# PROJECT-SPEC — vendure-app-starter (VM lane record)

Approved spec: lane-local `TASK.md` (Rahul, 2026-11-23; not committed). This file records what
the lane claims on the shared VM so the next session can see it.

| Item | Value |
|---|---|
| Lane files | `~/projects/vendure-app-starter/`, `~/.config/vendure-app-starter/` |
| tmux | `vendure` (only if a long-running process is needed) |
| Ports | 3300–3399 on 127.0.0.1. Claimed: **3300** = Metro/`expo start` (dev only, optional) |
| Postgres | none so far (optional scratch Vendure would use db/role `vendure_starter`) |
| Redis | none |
| Repo | https://github.com/Ryrahul/Vendure-admin-app-starter (token in `~/.config/vendure-app-starter/github-token`) |
| Relay | gigs profile only; live id of the VM session is logged in AGENT-LOG.md |
| Default server | `https://sastodeal-admin.hyperce.io/admin-api` (Rahul's live Vendure; read freely, reversible mutations only) |
| Firebase | project `vendure-admin-starter-hyperce`, Android package `io.hyperce.vendureadmin` |

## What gets built
Expo (SDK 58, Expo Router) mobile counterpart of the Vendure admin dashboard:
login (server URL + credentials), dashboard metrics, products (list/search/detail/edit),
orders (list/detail), Vendure design tokens (light + dark), typed GraphQL via graphql-codegen.

## Deliverables
Repo with README + architecture notes, PR from `feat/*` (not self-merged), release APK built
locally (`dist/`, never EAS cloud), distributed via Firebase App Distribution to the testers group.
