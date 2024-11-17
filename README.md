# Backend-Admin API

Det här projektet är en administrativ API-tjänst byggd med Node.js, Express, Sequelize och MySQL. Applikationen använder JSON Web Tokens (JWT) för autentisering och erbjuder rollbaserad åtkomstkontroll (RBAC).

---

## Funktioner

- Skapa och hantera användare.
- Skapa och hantera användargrupper.
- CRUD-operationer för användare, poster och kategorier via API.
- Rollbaserad åtkomstkontroll (RBAC) för administratörer och användare.
- Användarautentisering med JWT.
- Docker för databasinställningar med MySQL.

---

## Installation och användning

### 1. Klona repot

Börja med att klona projektet:

```bash
git clone https://github.com/your-username/backend-admin.git
cd backend-admin
```

---

### 2. Installera beroenden

Installera nödvändiga Node.js-paket:

```bash
npm install
```

---

### 3. Skapa en .env-fil

Skapa en `.env`-fil i projektets rotmapp och lägg till följande miljövariabler:

```plaintext
API_DOCS=true
ACCESS_TOKEN_SECRET=din_hemliga_access_token
REFRESH_TOKEN_SECRET=din_hemliga_refresh_token
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=backend_db
DB_HOST=db
DB_PORT=3306
PORT=3000
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

> **Viktigt:** Byt ut `ACCESS_TOKEN_SECRET` och `REFRESH_TOKEN_SECRET` mot egna hemligheter och håll dessa privata.

---

### 4. Kör applikationen med Docker

Använd Docker Compose för att starta applikationen och databasen:

```bash
docker-compose up --build
```

Detta bygger och kör både backend-applikationen och MySQL-databasen i separata Docker-containrar.

---

### 5. Åtkomst till applikationen

När applikationen körs är den tillgänglig via följande URL:er:

- **Login:** `http://localhost:3000/api/auth/login`
- **Användarhantering:** `http://localhost:3000/api/admin/users`

---

## API-endpoints

### Auth Endpoints

- **POST /api/auth/login**  
  Loggar in användaren och returnerar access och refresh tokens.
- **POST /api/auth/logout**  
  Loggar ut användaren genom att rensa JWT-cookies.

---

### Admin Endpoints

- **GET /api/admin/users**  
  Hämtar alla användare från databasen.
- **POST /api/admin/users**  
  Skapar en ny användare.
- **GET /api/admin/users/:id**  
  Hämtar användarinformation baserat på användarens ID.
- **PUT /api/admin/users/:id**  
  Uppdaterar användardata för en specifik användare baserat på ID.
- **DELETE /api/admin/users/:id**  
  Tar bort en användare baserat på ID.

---

### Group Endpoints

- **POST /api/admin/groups**  
  Skapar en ny grupp.
- **GET /api/admin/groups**  
  Hämtar alla grupper.
- **DELETE /api/admin/groups/:name**  
  Tar bort en grupp baserat på gruppnamnet.

---

### Post Endpoints

- **POST /api/posts**  
  Skapar ett nytt inlägg i en specificerad kategori.
- **GET /api/posts**  
  Hämtar alla inlägg.
- **DELETE /api/posts/:postId**  
  Tar bort ett inlägg baserat på ID (Admins kan ta bort alla inlägg, användare endast sina egna).

---

### Category Endpoints

- **POST /api/categories**  
  Skapar en ny kategori.
- **GET /api/categories**  
  Hämtar alla kategorier.
- **DELETE /api/categories/:name**  
  Tar bort en kategori baserat på dess namn (endast admin).

---

## Docker

Applikationen använder Docker för att köra backend-servern och MySQL-databasen.

### Docker Compose

Användbara Docker Compose-kommandon:

- **Bygg och starta containrar:**

  ```bash
  docker-compose up --build
  ```

- **Stoppa containrar:**

  ```bash
  docker-compose down
  ```

- **Se loggar för containrar:**

  ```bash
  docker-compose logs
  ```

### MySQL-databas

För att ansluta till databasen via terminalen (MySQL CLI):

```bash
docker exec -it backend-admin-db mysql -u admin -p
```

Ange lösenordet `admin` när du blir ombedd.

---

## Användning av Insomnia

1. **Logga in och hämta tokens**  
   - **Endpoint:** `POST /api/auth/login`
   - **Body:**
     ```json
     {
       "username": "admin",
       "password": "password123"
     }
     ```
   - **Response:**  
     Tokens returneras som cookies.

2. **Använd Authorization-headern för skyddade endpoints**  
   - Lägg till följande header:
     ```
     Authorization: Bearer <access_token>
     ```

3. **Testa skyddade endpoints som att skapa ett inlägg:**
   - **Endpoint:** `POST /api/posts`
   - **Body:**
     ```json
     {
       "content": "Det här är ett inlägg.",
       "category": "Allmänt"
     }
     ```

---

## Mappstruktur

```plaintext
Backend-Admin
├── src
│   ├── controllers
│   ├── domain
│   ├── routes
│   ├── config.js
│   └── app.js
├── docker-compose.yml
└── .env
```

---
