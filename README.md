# LLD-UML Architect 🚀

**A Developer-Focused UML Editor for Low-Level Design (LLD)**

LLD-UML Architect is a technical workspace designed for developers who need to bridge the gap between Java source code and architectural diagrams. Unlike generic drag-and-drop tools, this editor is built around a canonical UML semantic model, ensuring that every diagram is technically accurate and structurally sound.

![UML Editor Banner](https://github.com/user-attachments/assets/ba3568c2-72dc-4151-8600-bd699506e487)

## ✨ Key Features

- **Dual-Mode Creation**:
    - **Manual Mode**: Build diagrams using structured forms for classes, fields, methods, and relationships.
    - **Java Import**: Paste Java source code and let our AST-based parser automatically generate an accurate UML diagram.
- **IDE-Inspired UX**: A technical, dark-themed interface inspired by VS Code, Linear, and GitHub. High information density without the clutter.
- **Semantic Modeling**: Relationships are not just lines; they are semantic links (Inheritance, Implementation, Composition, Aggregation, etc.) with UML-standard notation.
- **Durable Persistence**: 
    - **Auto-Save**: Changes are debounced and saved automatically to Supabase.
    - **Version History**: Create immutable saved versions to track your design evolution.
    - **Local Recovery**: Browser-local draft storage ensures no work is lost even during network failures.
- **High-Fidelity Rendering**: Built on React Flow for smooth zooming, panning, and responsive node manipulation.
- **Developer-Ready Exports**: Export your designs as PNG, JPEG, SVG, or PDF for documentation and reviews.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Diagram Engine**: React Flow
- **State Management**: Zustand (Multi-domain stores)
- **Code Editor**: Monaco Editor (Java Syntax Highlighting)
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons

### Backend & Infrastructure
- **API Server**: Node.js + Express.js
- **Persistence**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Microservices**: Java-based AST Parser Service

### Shared Packages
- `@repo/shared-model`: Canonical UML types and validation.
- `@repo/persistence`: Save queue and local draft management.
- `@repo/parser-client`: Standardized parser API contracts.
- `@repo/diagram-engine`: Grid-based auto-layout logic.

## 🏗️ Architecture

The project follows a **Derived View Pattern**. The UML semantic model is the absolute source of truth. The React Flow canvas is a reactive view derived from this model.

- **Frontend**: Owns the UI, Zustand stores, and diagram rendering.
- **Backend**: Handles authentication, ownership validation, and persistence orchestration.
- **Java Parser Service**: A stateless microservice that uses **JavaParser** to extract UML metadata from AST.

## 📁 Project Structure

```text
├── frontend/             # Next.js web application
├── backend/              # Node.js API server
├── services/
│   └── java-parser/      # Java-based AST parser microservice
├── packages/             # Shared monorepo-style packages
│   ├── shared-model/     # Canonical UML types
│   ├── persistence/      # Save logic and local storage
│   ├── parser-client/    # Parser API contracts
│   └── diagram-engine/   # Layout algorithms
└── context/              # Comprehensive project documentation (Specs, Architecture, Rules)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java (v17+)
- Supabase Account & Project

### Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/anuj452005/lld-uml.git
   cd lld-uml
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   # Create .env.local with NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
   # (Supabase anon public key). Set NEXT_PUBLIC_SITE_URL to your public https origin so
   # OAuth redirect_to matches production (see `frontend/.env.production` and Dockerfile ARG).
   npm run dev
   ```

3. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create .env with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
   npm run dev
   ```

4. **Java Parser Setup**:
   ```bash
   cd services/java-parser
   ./gradlew run
   ```

## 📜 Development Guidelines

This project follows strict architectural boundaries and coding standards. Before contributing, please review:
- `AGENTS.md`: Master execution rules for AI agents.
- `context/architecture.md`: System invariants and storage model.
- `context/code-standards.md`: Typing and naming conventions.

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.
