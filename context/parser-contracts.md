# Parser Contracts

This document defines the canonical contracts, transformation rules, validation rules, and isolation boundaries for the Java parsing system.

The parser system is responsible for:

- Java AST extraction
- UML semantic model generation
- parser warnings/errors
- parser normalization

The parser system is NOT responsible for:

- persistence
- authentication
- React rendering
- React Flow nodes
- database access

The parser service must remain fully stateless.

---

# 1. Parser Philosophy

The parser exists only to transform Java source into the canonical UML semantic model.

Correct:

```text
Java Source
    ↓
AST Parsing
    ↓
Normalization
    ↓
Canonical UML Model
```

Forbidden:

```text
Java Source
    ↓
React Flow Nodes
```

---

# 2. Parser Isolation Rules

The parser service must NEVER:

- write to the database
- access Supabase
- mutate frontend state
- return React Flow types
- own persistence logic

The parser returns normalized semantic UML only.

---

# 3. Parser Service Structure

Recommended structure:

```text
services/java-parser/
├── src/
│   ├── parser/
│   ├── extractors/
│   ├── transformers/
│   ├── validators/
│   ├── contracts/
│   ├── errors/
│   └── utils/
```

---

# 4. Parser Input Contract

Input:

```json
{
  "source": "java source code"
}
```

Rules:

- UTF-8 text only
- size-limited
- no file uploads initially
- single-source input only

---

# 5. Parser Output Contract

Output:

```ts
interface ParserResult {
  success: boolean

  diagram?: UMLDiagram

  warnings: ParserWarning[]

  errors: ParserError[]
}
```

The parser output MUST normalize into:

```text
@uml-editor/shared-model
```

---

# 6. Parser Success Rules

A successful parse may still contain warnings.

Example:

```text
unsupported generic constraint skipped
```

Warnings do NOT invalidate the diagram automatically.

---

# 7. Parser Failure Rules

Failures must:

- return structured errors
- preserve line information where possible
- fail safely
- avoid partial malformed UML

Never:

- throw raw stack traces
- crash parser process
- return invalid semantic state

---

# 8. Parser Error Structure

```ts
interface ParserError {
  code: string

  message: string

  line?: number
  column?: number
}
```

---

# 9. Parser Warning Structure

```ts
interface ParserWarning {
  code: string

  message: string

  line?: number
}
```

---

# 10. Supported UML Extraction

The parser currently supports extraction of:

- classes
- interfaces
- fields
- methods
- inheritance
- implemented interfaces

Do NOT implement:

- annotations modeling
- reflection analysis
- runtime behavior analysis
- method body parsing
- package diagrams

---

# 11. Supported Java Features

Supported initially:

- standard class declarations
- interfaces
- visibility modifiers
- method declarations
- field declarations
- extends
- implements

---

# 12. Unsupported Java Features

Initially unsupported:

- advanced generics
- annotation processors
- reflection-heavy structures
- bytecode analysis
- lambdas as UML entities
- nested anonymous classes

Unsupported features should produce warnings.

---

# 13. AST Isolation Rules

JavaParser AST objects must NEVER leak outside parser service boundaries.

Correct:

```text
AST
    ↓
Adapter
    ↓
UML Model
```

Forbidden:

```text
AST → frontend
```

---

# 14. Transformation Layer Rules

Transformation logic belongs ONLY in:

```text
transformers/
```

Responsibilities:

- AST normalization
- UML conversion
- semantic cleanup

---

# 15. Validation Rules

Parser validation must detect:

- duplicate class names
- invalid inheritance
- malformed entities
- unsupported relationships

Parser validation occurs BEFORE output generation.

---

# 16. Relationship Rules

Generated relationships must:

- reference valid entities
- prevent self-inheritance
- prevent circular inheritance

Invalid relationships must NOT persist.

---

# 17. Duplicate Entity Rules

Duplicate class names must:

- fail parsing
- return conflict error

Never auto-rename silently.

---

# 18. Partial Parse Rules

Partial parsing allowed ONLY when semantic integrity remains valid.

Allowed:

```text
unsupported annotation skipped
```

Forbidden:

```text
broken inheritance graph
```

---

# 19. Performance Rules

Parser must remain responsive.

Recommended limits:

| Area | Limit |
|---|---|
| Source payload | 1MB |
| Request timeout | 15s |
| Max parsing depth | bounded |

Reject oversized input safely.

---

# 20. Stateless Rules

The parser service must remain stateless.

Forbidden:

- local persistence
- session storage
- diagram ownership
- save queues

---

# 21. API Boundary Rules

Parser communication happens ONLY through:

```text
REST API contracts
```

Never:

- direct frontend imports
- shared mutable runtime state

---

# 22. Logging Rules

Allowed logs:

- parser failures
- unsupported syntax warnings
- timeout failures

Never log:

- sensitive user tokens
- credentials
- raw infrastructure secrets

---

# 23. Recovery Rules

If parser crashes internally:

- recover safely
- return structured failure
- preserve frontend editor state

Never:

- destroy user diagram state
- clear pasted source automatically

---

# 24. Extensibility Rules

Future parser support may include:

- TypeScript
- Kotlin
- C#
- Python

Do NOT implement multi-language abstraction now.

Avoid speculative parser architecture.

---

# 25. Hard Constraints

1. The parser service must remain stateless.
2. AST objects must never leak outside the parser service.
3. Parser output must normalize into the canonical UML model.
4. Parser failures must never crash the application.
5. Invalid UML structures must never persist.
6. React Flow types must never exist in parser contracts.
7. Unsupported Java syntax must fail safely.
8. Duplicate entity names must be rejected.
9. The parser must never write directly to the database.
10. Parser output must remain framework-independent.