<div id="toc">
<h1>Merge Mages - SideQuest</h1>
</div>
<img src="https://cdn.discordapp.com/attachments/1451564147585318945/1451578654575427710/BCO.png?ex=6946af78&is=69455df8&hm=ce896e866ad0506c4f2a56620b4620c88198621df4829379f2c9d2543deffc8d&" alt="drawing" width="200">

## What is SideQuest?
SideQuest is a collaboration platform for students to team up across different disciplines. Whether you're a graphic design student who wants your artwork turned into a 3D model, or a programmer looking for custom assets, SideQuest makes it easy to find help from classmates with the right skills.

Students can post project requests — called “sidequests” — and others can join in to contribute, learn, and build something together. It’s a fun, flexible way to connect, share talent, and turn creative ideas into real projects.

---

### Conventions

#### Naming Conventions
- **Variables & Functions**: `camelCase`
- **Classes & Components**: `PascalCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Files**: `kebab-case` for components/modules, `camelCase` for utilities
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

Use present tense, imperative mood ("add" not "added" or "adds")

---

### Frontend Conventions

#### File Structure
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page-level components
│   ├── services/       # API calls and external services
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Helper functions
│   ├── context/        # React context providers
│   ├── types/          # TypeScript type definitions
│   ├── styles/         # Global styles and themes
│   └── assets/         # Images, fonts, etc.
```

#### Component Guidelines
- One component per file
- Use functional components with hooks
- Extract business logic into custom hooks
- Props should be typed with TypeScript interfaces
- Use named exports for components

---

### Backend Conventions

#### File Structure
```
api/
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/         # Database models
│   ├── services/       # Business logic
│   ├── routes/         # API route definitions
│   ├── middleware/     # Express middleware
│   ├── utils/          # Helper functions
│   ├── validators/     # Input validation schemas
│   └── config/         # Configuration files
```

#### API Design
- Use RESTful conventions
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
- Use singular names for tables (e.g., `user` not `users`)
- Primary key: `id` (auto-increment integer or UUID)
- Timestamps: `created_at`, `updated_at` on all tables
- Foreign keys: `{table_name}_id` (e.g., `user_id`)
- Use indexes on frequently queried columns

---

### Testing

#### Coverage Requirements
- Minimum 70% code coverage
- 100% coverage for critical business logic
- Test files: `*.test.ts` or `*.spec.ts`

#### Testing Structure
- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Critical user flows

#### Test Naming
```javascript
describe('Component/Function Name', () => {
  it('should perform expected behavior', () => {
    // Test implementation
  });
});
```

---

### Security

- Never commit secrets, API keys, or credentials
- Use environment variables for configuration
- Sanitize all user inputs
- Implement rate limiting on API endpoints
- Use HTTPS in production
- Hash passwords with bcrypt (minimum 10 rounds)
- Validate and sanitize file uploads

---

### Documentation

- Document all public APIs
- Keep README.md up to date
- Document environment variables in `.env.example`
- Maintain a CHANGELOG.md for version history

---

### Code Review

- All code must be reviewed before merging
- Address all comments before merging
- Test locally before requesting review
- Keep PRs focused and under 400 lines when possible
- Update tests with code changes
