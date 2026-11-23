# dev-server: local seeded Vendure

A plain Vendure 3.x server for developing the mobile app. **Destructive flows** (delete, cancel,
refund, state transitions) are developed and tested here, never on a production server.

It uses:
- Vendure's standard sample data: ~54 products with images, 9 collections, countries, zones,
  tax rates, 2 shipping methods, and 1 payment method that authorizes without settling.
- Sample **custom fields** of every type (`src/config.ts`), so dynamic custom-field support can be tested.
- Bearer-token auth (`tokenMethod: ['bearer', 'cookie']`), which the app requires.

## Setup

```bash
cd dev-server
npm install
cp .env.example .env && chmod 600 .env   # fill in your Postgres database + a superadmin password
npm run populate                          # once, against an empty database
npm start                                 # server + worker on http://127.0.0.1:3300
npm run seed:orders                       # (server running) places 12 sample orders via the Shop API
```

Point the app at `http://<your-machine-ip>:3300/admin-api`. Set `APP_HOST=0.0.0.0` in `.env` if a
phone on your LAN needs to reach it, and update `assetUrlPrefix` accordingly.

To reset everything, drop and recreate the database schema, then run `populate` again.
`synchronize: true` keeps the schema in step with the Vendure version, so there are no migrations to manage (dev only).
