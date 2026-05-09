# Project Overview

This application is a developer-focused UML editor for designing low-level design (LLD) diagrams in a structured way. Users can either create diagrams manually through a form-driven interface or paste Java code and generate a UML class diagram automatically. The app stores the diagram state in Supabase, preserves layout and viewport state across reloads, and supports both auto-save and explicit version saving so users can return to the same canvas state later.

## Goals

1. Provide a UML editor tailored for developers rather than a generic drag-and-drop diagram tool.
2. Let users create and edit class diagrams using structured inputs for classes, fields, methods, and relationships.
3. Support Java-to-UML generation from pasted code as a first automated import path.
4. Preserve diagram state, layout, zoom, and pan so the canvas restores exactly as the user left it.
5. Support both auto-save and manual save versions so users do not lose work.
6. Keep the system single-user for the initial release to reduce complexity and improve reliability.
7. Build the model and rendering layers in a way that can later support two-way sync between code and diagram edits.

## Core User Flow

1. The user opens the application and signs in with Supabase authentication.
2. The user creates a new diagram or opens an existing one.
3. The user chooses one of two starting modes:

   1. Manual UML creation.
   2. Java code-to-UML generation.
4. In manual mode, the user adds a class through a structured form and fills in:

   * class name
   * fields
   * methods
   * visibility
   * method signatures
5. In code-to-UML mode, the user pastes Java code into the editor and clicks generate.
6. The parser converts the Java source into a UML semantic model.
7. The app renders the UML as an editable diagram canvas.
8. The user can move nodes around, add classes, remove classes, and create or change relationships using drag edges plus a relationship type selector.
9. The app auto-saves the current state after changes.
10. The user can also click save to create a named version.
11. When the user returns later, the app loads the latest saved state and restores the diagram exactly as it was, including node positions and viewport.

## Features

### 1. Authentication and Access

* Supabase login and session management.
* Single-user ownership of each diagram.
* User-specific diagram storage and retrieval.

### 2. Diagram Creation

* Create a new manual UML diagram.
* Create a UML diagram from pasted Java code.
* Open and continue editing an existing diagram.

### 3. Manual UML Editing

* Add class nodes using a structured form.
* Edit class name, fields, methods, and visibility.
* Enter full method signatures such as `login(email: String): boolean`.
* Create relationships by dragging an edge and selecting the relationship type.
* Move nodes freely on the canvas.

### 4. Java to UML Generation

* Paste Java code into an editor.
* Parse Java source into a structured UML model.
* Detect classes, interfaces, fields, methods, inheritance, and implemented interfaces.
* Render the generated model as an editable diagram.

### 5. Diagram Persistence

* Auto-save diagram changes after a short debounce delay.
* Save explicit versions on demand.
* Restore the latest saved diagram state on reload.
* Persist diagram data, layout positions, and viewport state.

### 6. Editing and Validation

* Prevent invalid class names and method signatures.
* Prevent self-inheritance and other invalid relationships.
* Keep the diagram model and visual layout separate.
* Mark generated diagrams as modified after manual edits.

### 7. Future-Ready Structure

* Keep the model designed for later two-way sync between diagram edits and source code.
* Keep the parsing and model transformation layers separate from the UI layer.

## In Scope

* A web application for creating UML class diagrams.
* Manual UML creation using structured forms.
* Java code pasted into an editor and converted into UML.
* Editable canvas for moving nodes and managing relationships.
* Class, interface, field, method, and relationship modeling.
* Full method signatures with parameters and return type.
* Relationship creation with drag-and-select behavior.
* Supabase authentication.
* Supabase database storage for diagrams and versions.
* Auto-save and explicit save versioning.
* Full restore of canvas state on page reload or returning later.
* Single-user editing only.
* Java as the first supported language for code-to-UML generation.

## Out of Scope

* Real-time multi-user collaboration.
* Google Drive integration.
* Exporting source code back from UML.
* Two-way sync between code and UML in the initial release.
* Support for multiple programming languages in the first version.
* GitHub repository import.
* Multi-file or full-project Java parsing.
* AI-assisted diagram generation in the first release.
* Chat-based diagram editing.
* Freeform drawing tools that are unrelated to UML modeling.

## Success Criteria

The project is done when all of the following are true:

1. A user can sign in and create a diagram in Supabase-backed storage.
2. A user can manually create a UML class diagram using structured forms.
3. A user can paste Java code and generate a UML diagram from it.
4. A user can drag nodes, add classes, remove classes, and create relationships on the canvas.
5. The app validates basic UML constraints such as preventing self-inheritance.
6. The app auto-saves changes without requiring a manual save after every edit.
7. The app supports explicit version saves.
8. When the user reloads the page or returns later, the latest saved diagram is restored with the same node positions and viewport state.
9. The system stores diagram data in a way that keeps the model layer separate from the visual layout layer.
10. The codebase is structured so that two-way sync can be added later without rewriting the entire application.
