# Buyer Lead Intake - Full Starter

This is a full-featured starter for the Buyer Lead Intake assignment:
- Next.js (App Router) + TypeScript
- Prisma + Postgres (migrations)
- Zod validation (shared)
- CSV import/export (server)
- Concurrency guard (updatedAt)
- Simple demo auth stub (cookie-based)
- Unit test example (Vitest)

## Setup
1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install:
```bash
npm install
```
3. Run migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```
4. Seed (optional):
```bash
npm run seed
```
5. Run:
```bash
npm run dev
```

## Notes
- Validation lives in `validators/buyer.ts` (shared client + server).
- Prisma schema is in `prisma/schema.prisma`.
- API routes are in `app/api`.
- Tests: `npm run test`.

