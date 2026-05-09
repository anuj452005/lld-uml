# API Contracts

This document defines the canonical API contracts for the UML editor project.

The API layer is responsible for:

- authenticated diagram access
- persistence orchestration
- parser orchestration
- validation enforcement
- version management
- recovery flows

The API layer is NOT responsible for:

- React rendering
- React Flow state
- frontend UI logic
- parser implementation internals

All API behavior must follow this document exactly.

---

# 1. API Philosophy

The API must remain:

- deterministic
- strongly typed
- validation-first
- ownership-safe
- framework-independent
- consistent across endpoints

All requests must:

- validate authentication
- validate ownership
- validate payload shape
- return structured responses

---

# 2. API Base Structure

Base path:

```text
/api/v1
```

Example:

```text
/api/v1/diagrams
```

---

# 3. Standard Response Shape

All responses must follow this structure.

---

## Success Response

```json
{
  "success": true,
  "data": {}
}
```

---

## Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

---

# 4. Error Object Rules

Errors must be:

- structured
- deterministic
- frontend-safe
- non-sensitive

Never expose:

- stack traces
- SQL details
- internal infrastructure paths

---

# 5. Authentication Rules

Authentication required for ALL diagram routes.

Flow:

```text
Frontend
    ↓
Supabase JWT
    ↓
API Verification
    ↓
Ownership Validation
    ↓
Business Logic
```

Never trust frontend identity directly.

---

# 6. Route Structure

```text
/apps/api/src/routes/
```

Recommended structure:

```text
routes/
├── diagrams/
├── versions/
├── parser/
├── recovery/
└── health/
```

---

# 7. Diagrams API

---

## Create Diagram

```http
POST /api/v1/diagrams
```

Purpose:

- create blank diagram
- initialize working snapshot

---

### Request

```json
{
  "name": "Authentication Service",
  "sourceType": "manual"
}
```

---

### Response

```json
{
  "success": true,
  "data": {
    "diagramId": "uuid"
  }
}
```

---

# 8. Get Diagram

```http
GET /api/v1/diagrams/:diagramId
```

Returns:

- UML semantic model
- layout state
- viewport state
- metadata

---

# 9. Update Working Diagram

```http
PUT /api/v1/diagrams/:diagramId
```

Purpose:

- update mutable working snapshot
- autosave flow

This endpoint must NOT create immutable versions.

---

### Request

```json
{
  "diagram": {},
  "layout": {},
  "viewport": {}
}
```

---

# 10. Create Version

```http
POST /api/v1/diagrams/:diagramId/versions
```

Purpose:

- create immutable save version

---

### Request

```json
{
  "versionName": "Before Parser Refactor"
}
```

---

# 11. List Versions

```http
GET /api/v1/diagrams/:diagramId/versions
```

Returns:

- version metadata only

Avoid returning massive snapshots unnecessarily.

---

# 12. Restore Version

```http
POST /api/v1/versions/:versionId/restore
```

Purpose:

- restore selected version into working snapshot

Must NOT mutate immutable version record.

---

# 13. Parser API

---

## Generate UML

```http
POST /api/v1/parser/java
```

Purpose:

- send Java source
- receive normalized UML model

---

### Request

```json
{
  "source": "public class User {}"
}
```

---

### Response

```json
{
  "success": true,
  "data": {
    "diagram": {},
    "warnings": [],
    "errors": []
  }
}
```

---

# 14. Parser Failure Rules

Parser failures must:

- return structured errors
- preserve user input
- include line metadata when possible

Never:

- crash API
- return malformed UML

---

# 15. Recovery API

---

## Get Recovery State

```http
GET /api/v1/recovery/:diagramId
```

Purpose:

- compare local draft vs remote state
- support recovery conflict resolution

---

# 16. Validation Rules

Validation required at:

- route level
- service level
- parser level

Validation categories:

- payload shape
- UML integrity
- relationship integrity
- ownership
- parser payload size

---

# 17. Request Validation Rules

Use centralized schemas only.

Validation package:

```text
@uml-editor/validation
```

Never duplicate validators.

---

# 18. Ownership Rules

Every diagram operation must verify:

```text
diagram.owner_id === authenticated_user.id
```

Before:

- read
- update
- restore
- delete
- version creation

---

# 19. Persistence Rules

API owns persistence orchestration.

Frontend must NEVER:

- write directly to database
- bypass ownership checks

---

# 20. Idempotency Rules

Autosave endpoints must be idempotent.

Duplicate autosave requests must not:

- create duplicate versions
- corrupt snapshots

---

# 21. Timeout Rules

Recommended timeout limits:

| Operation | Timeout |
|---|---|
| Autosave | 5s |
| Parser Request | 15s |
| Version Restore | 10s |

Requests exceeding limits must fail safely.

---

# 22. Payload Limits

Recommended limits:

| Payload | Limit |
|---|---|
| Parser input | 1MB |
| Snapshot payload | 5MB |
| Version metadata | 10KB |

Reject oversized payloads explicitly.

---

# 23. Logging Rules

Log:

- request failures
- parser failures
- persistence failures
- auth failures

Never log:

- JWT tokens
- sensitive user data
- raw credentials

---

# 24. Service Layer Rules

Routes must remain thin.

Correct:

```text
Route
    ↓
Controller
    ↓
Service
    ↓
Persistence
```

Avoid business logic inside routes.

---

# 25. API Versioning Rules

All routes must be versioned.

Current:

```text
v1
```

Never expose unversioned APIs.

---

# 26. Future Expansion Rules

Future APIs may include:

- exports
- collaboration
- comments
- code sync

Do NOT implement now.

Do NOT create speculative endpoints.

---

# 27. Hard Constraints

1. All diagram APIs require authentication.
2. Ownership must be verified before every operation.
3. The frontend must never bypass backend persistence.
4. API responses must remain structurally consistent.
5. Parser failures must never crash the API.
6. Validation must occur before persistence.
7. Autosave must never create immutable versions.
8. Immutable versions must never mutate.
9. Request payloads must be size-limited.
10. All APIs must remain versioned.