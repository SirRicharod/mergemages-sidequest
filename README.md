<div id="toc">
<h1>Merge Mages - SideQuest</h1>
</div>
<img src="mergemageslogo.png" alt="merge mages logo style="width: 300px">

## What is SideQuest?
**SideQuest** is a **collaboration hub** built *by students, for students*, with the intention to bridge the gap between different disciplines. Whether a graphic design student wants their artwork turned into a 3D model, a programmer looking for a new logo for their site, or a game developer in need of music for their game. **SideQuest** makes it easy to find help from classmates with the right skills.

Students can **post project requests**, called “*sidequests”*, and others can join in to *contribute*, *learn*, and *build* something together. It’s a fun, flexible way to *connect*, *share talent*, and ***turn creative ideas into real projects***.

---

## Installation

  

### Prerequisites

-  **Node.js**  & **npm**
-  **PHP**
-  **Composer**
-  **MySQL**  database
-  **Git**

  

### Clone the Repository

```bash
git clone https://github.com/SirRicharod/mergemages-sidequest
cd mergemages-sidequest
```

  

### Frontend Setup (Angular)

```bash
cd angular-frontend
npm install
npm start
```

The Angular frontend will run on `http://localhost:4200`

  

### Backend Setup (Laravel)

```bash
cd laravel-backend/backend
composer install
cp .env.example  .env
php artisan  key:generate
```
Configure your database in the `.env` file:
```env
DB_CONNECTION=mysql
DB_HOST=hosting_address
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```
Run migrations and start the server:
```bash
php  artisan  migrate
php  artisan  serve
```
The Laravel backend will run on `http://localhost:8000`

### Running Both Services

For development, open two terminal windows:

- Terminal 1: `cd angular-frontend && npm start`

- Terminal 2: `cd laravel-backend/backend && php artisan serve`
---

### Techstack
#### Core Stack
<p>
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular">
  <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
</p>

#### Frontend & Styling
<p>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap">
  <img src="https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white" alt="RxJS">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
</p>

#### Backend & Logic
<p>
  <img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP">
  <img src="https://img.shields.io/badge/Sanctum-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Sanctum">
  <img src="https://img.shields.io/badge/Composer-885630?style=for-the-badge&logo=composer&logoColor=white" alt="Composer">
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm">
</p>

---

### Conventions

#### Naming Conventions
- **Variables & Functions**: `camelCase`
- **Classes & Components**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Files**: `kebab-case`
- **Database Tables**: `snake_case`
- **API Endpoints**: `kebab-case` (e.g., `/api/user-profiles`)

---

### Git Workflow

#### Branch Naming
- `feature/feature-name` - New features
- `bugfix/issue-description` - Bug fixes
- `hotfix/critical-fix` - Production hotfixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

#### Commit Messages
Follow the Conventional Commits specification:
- `feat: add user authentication`
- `fix: resolve login redirect issue`
- `docs: update API documentation`
- `style: format code according to style guide`
- `refactor: restructure user service`
- `test: add unit tests for auth module`
- `chore: update dependencies`

---

#### API Design
- Version APIs: `/api/v1/resource`
- HTTP Methods:
  - `GET` - Retrieve resources
  - `POST` - Create resources
  - `PUT/PATCH` - Update resources
  - `DELETE` - Remove resources
- Status Codes:
  - `200` - Success
  - `201` - Created
  - `400` - Bad Request
  - `401` - Unauthorized
  - `403` - Forbidden
  - `404` - Not Found
  - `500` - Internal Server Error

#### Error Handling
- Always use try-catch blocks for async operations
- Return consistent error response format:
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

---

### Database Conventions
#### Schema Design
- Primary key: `id` (auto-increment integer or UUID)
- Timestamps: `created_at`, `updated_at` on all tables
- Foreign keys: `{table_name}_id`

---

### Security
- Never commit secrets, API keys, or credentials
- Use environment variables for configuration
- Sanitize all user inputs
- Hash passwords with bcrypt (minimum 10 rounds)
- Validate and sanitize file uploads

---

### Code Review
- Review code before merging
- Address comments before merging
- Test locally before requesting review
- Keep PRs focused and under 400 lines when possible
---
