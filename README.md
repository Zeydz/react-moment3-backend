React Moment3 — Backend

Detta är backend-delen för ett blogg-frontenden (Moment 3) byggt med Fastify och Prisma. API:t hanterar användarautentisering (registrering, inloggning, utloggning) och CRUD-operatoner för inlägg.

Endpoints
- POST /auth/register — Registrera en ny användare (body: { username, password })
- POST /auth/login — Logga in och sätta en httpOnly-cookie med JWT (body: { username, password })
- POST /auth/logout — Rensa auth-cookie på servern
- GET /posts — Hämta alla inlägg
- GET /posts/:id — Hämta ett enskilt inlägg
- POST /posts — Skapa ett nytt inlägg (skyddad route)
- PUT /posts/:id — Uppdatera ett inlägg (skyddad route)
- DELETE /posts/:id — Radera ett inlägg (skyddad route)

Skyddade routes använder JWT-verifiering via en `authenticate`-decorator.

Använda tekniker och verktyg
- Node.js med Fastify — snabb webbramverk för API
- Prisma — ORM för databasåtkomst (schema i `prisma/schema.prisma`)
- PostgreSQL (ansluts via `DATABASE_URL`)
- JWT (`@fastify/jwt`) — sessions/auth via cookie
- Cookies (`@fastify/cookie`) — httpOnly-cookie för token
- bcrypt — lösenordshashning
- CORS (`@fastify/cors`) — konfigurerad för att tillåta frontend från localhost samt credentialed requests

Miljövariabler som behövs
- DATABASE_URL — Prisma databasanslutning
- JWT_SECRET — hemlighet för JWT
- JWT_EXPIRES_IN — token-levetid (t.ex. "1h")

Köra lokalt
1. Installera beroenden: `npm install`
2. Generera Prisma client: `npx prisma generate`
3. Kör utvecklingsservern: `npm run dev`
