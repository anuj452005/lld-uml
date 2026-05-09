# Unit 10 — Java to UML Parsing and Model Extraction

## Overview

Implement the Java parsing service (`services/java-parser`) using JavaParser.
The service receives Java source, builds an AST, extracts classes, interfaces,
fields, methods, inheritance, and implemented interfaces, and returns a
normalized canonical UML model via REST. All AST types remain isolated inside
the parser service — only the shared model output crosses the service boundary.

---

## Goal

Pasting valid Java code and clicking "Generate UML" produces a correctly populated
`UMLDiagram` with classes, interfaces, fields, methods, and relationships
(inheritance, realization) automatically detected and rendered on the canvas.

---

## Dependencies

- Unit 09 (Java editor, API proxy route, parser API contract)

---

## Scope

### In Scope

- Gradle or Maven project setup for `services/java-parser`
- JavaParser library dependency
- HTTP server to expose `POST /parse` endpoint (Spring Boot minimal, or embedded Jetty)
- AST traversal to extract:
  - Class declarations (name, visibility, abstract flag)
  - Interface declarations
  - Field declarations (name, type, visibility, static, final)
  - Method declarations (name, params, return type, visibility, static, abstract)
  - `extends` relationships → UML Inheritance
  - `implements` relationships → UML Realization
- Adapter layer: JavaParser AST → canonical `UMLDiagram` JSON
- Structured error output for parse failures (code, message, line, column)
- Structured warning output for unsupported syntax
- Size limit enforcement (1MB source max)
- Timeout enforcement (15 second max parse time)
- Stateless: no state between requests, no database access

### Out of Scope

- Method body parsing
- Annotation modeling
- Generics parsing beyond basic support (warning only)
- Multi-file parsing
- Package diagram generation

---

## Service Structure

```text
services/java-parser/
├── src/
│   ├── main/java/com/uml/parser/
│   │   ├── ParserApplication.java        ← HTTP server entry point
│   │   ├── controller/
│   │   │   └── ParserController.java     ← POST /parse endpoint
│   │   ├── parser/
│   │   │   └── JavaSourceParser.java     ← orchestrates AST parsing
│   │   ├── extractors/
│   │   │   ├── ClassExtractor.java
│   │   │   ├── InterfaceExtractor.java
│   │   │   ├── FieldExtractor.java
│   │   │   ├── MethodExtractor.java
│   │   │   └── RelationshipExtractor.java
│   │   ├── transformers/
│   │   │   └── AstToUmlTransformer.java  ← adapter: AST → UML model
│   │   ├── validators/
│   │   │   └── ParserValidator.java      ← duplicate detection, etc.
│   │   ├── contracts/
│   │   │   ├── ParseRequest.java
│   │   │   ├── ParseResponse.java
│   │   │   ├── UmlDiagram.java           ← mirrors shared-model shape as Java POJO
│   │   │   ├── ParserError.java
│   │   │   └── ParserWarning.java
│   │   └── utils/
│   │       └── SizeValidator.java
├── build.gradle
└── README.md
```

---

## Parser Input Contract

```json
POST /parse
Content-Type: application/json

{ "source": "public class User { ... }" }
```

Rules:
- `source` must not be empty
- `source` must be UTF-8 text
- Size must not exceed 1MB
- Single source string only — no multi-file support

---

## Parser Output Contract

Success:
```json
{
  "success": true,
  "data": {
    "diagram": {
      "id": "generated-uuid",
      "name": "Generated Diagram",
      "sourceType": "java-generated",
      "classes": [...],
      "interfaces": [...],
      "relationships": [...],
      "layout": { "nodes": [] },
      "viewport": { "zoom": 1, "x": 0, "y": 0 },
      "metadata": { "isModified": false, "generatedFrom": "java" },
      "createdAt": "ISO",
      "updatedAt": "ISO"
    },
    "warnings": [],
    "errors": []
  }
}
```

Failure:
```json
{
  "success": false,
  "data": {
    "diagram": null,
    "warnings": [],
    "errors": [{ "code": "PARSE_ERROR", "message": "...", "line": 5, "column": 3 }]
  }
}
```

---

## Extraction Rules

### Class Extraction

```text
- public class Foo → { type: "class", visibility: "public", name: "Foo" }
- abstract class Bar → { isAbstract: true }
- private class Baz → { visibility: "private" }
```

### Interface Extraction

```text
- public interface Serializable → { type: "interface", visibility: "public" }
```

### Field Extraction

```text
- private String name → { visibility: "private", type: "String", name: "name" }
- public static int count → { isStatic: true, visibility: "public" }
- private final String id → { isReadonly: true }
```

### Method Extraction

```text
- public boolean login(String email, String password) → {
    name: "login",
    signature: "login(email: String, password: String): boolean",
    parameters: [{ name: "email", type: "String" }, { name: "password", type: "String" }],
    returnType: "boolean",
    visibility: "public"
  }
```

### Relationship Extraction

```text
class Dog extends Animal → Inheritance(Dog → Animal)
class Dog implements Runnable → Realization(Dog → Runnable)
```

---

## Validation Rules

- Duplicate class names → return `DUPLICATE_CLASS` error
- Self-inheritance → return `SELF_INHERITANCE` error
- Unsupported syntax → return `UNSUPPORTED_SYNTAX` warning, continue parsing
- Broken inheritance reference (target class not in file) → return warning, skip edge

---

## Error Code Reference

| Code | Meaning |
|---|---|
| `PARSE_ERROR` | General Java syntax error |
| `DUPLICATE_CLASS` | Two classes share the same name |
| `SELF_INHERITANCE` | Class extends itself |
| `EMPTY_SOURCE` | Empty source provided |
| `SIZE_EXCEEDED` | Source over 1MB |
| `TIMEOUT` | Parse exceeded 15 seconds |
| `UNSUPPORTED_SYNTAX` | Warning: feature not supported |

---

## API Proxy Update (apps/api)

The `POST /api/v1/parser/java` route from Unit 09 must forward the request
to the Java parser service:

```text
apps/api
    ↓ POST /parse
services/java-parser
    ↓ response
apps/api normalizes and returns to frontend
```

Parser service URL is configured via environment variable:
```text
JAVA_PARSER_URL=http://localhost:8080
```

---

## Implementation Order

1. `services/java-parser/build.gradle` — Java project setup
2. `ParserApplication.java` — HTTP server bootstrap
3. `contracts/` — all Java POJOs matching the shared model shape
4. `extractors/ClassExtractor.java`
5. `extractors/InterfaceExtractor.java`
6. `extractors/FieldExtractor.java`
7. `extractors/MethodExtractor.java`
8. `extractors/RelationshipExtractor.java`
9. `validators/ParserValidator.java`
10. `transformers/AstToUmlTransformer.java`
11. `parser/JavaSourceParser.java`
12. `controller/ParserController.java`
13. Update `apps/api` — wire proxy to real Java parser URL

---

## Acceptance Criteria

- [ ] Pasting a simple Java class generates a `UMLClass` in the output
- [ ] Pasting an interface generates a `UMLInterface`
- [ ] Fields with correct visibility, static, and readonly flags extracted
- [ ] Methods with correct signature, params, return type extracted
- [ ] `extends` generates Inheritance relationship
- [ ] `implements` generates Realization relationship
- [ ] Duplicate class names return structured error
- [ ] Malformed Java returns structured error with line number where possible
- [ ] Unsupported syntax returns warning, not failure
- [ ] Source over 1MB rejected before parsing
- [ ] Parser timeout returns structured error
- [ ] No AST types leak into response payload
- [ ] Service is stateless — no shared mutable state between requests

---

## Invariants to Preserve

- Parser service NEVER writes to the database
- Parser service NEVER accesses Supabase
- AST types NEVER appear outside `services/java-parser`
- Output must always normalize into the canonical UML model shape
- Invalid Java must never crash the service process

---

## Documentation to Update After Completion

- `context/progress-tracker.md` — mark Unit 10 complete
