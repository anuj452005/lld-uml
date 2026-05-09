# UI Context

This document defines the visual language, layout conventions, component rules, interaction patterns, and design tokens for the UML editor project. All UI implementation must follow this specification exactly.

The application aesthetic is:

* Dark-only
* Technical
* IDE-inspired
* Developer-focused
* Structured rather than decorative

The interface should feel closer to:

* entity["software","Visual Studio Code","source-code editor"]
* entity["software","Linear","project management software"]
* entity["software","GitHub","developer platform"]

and not like a marketing-heavy SaaS dashboard.

---

# 1. Design Principles

## 1.1 Functional First

* Prioritize clarity and information density over decoration.
* UI elements must communicate structure and state clearly.
* Avoid unnecessary gradients, blur effects, or animated backgrounds.

---

## 1.2 Consistency Over Creativity

* Use tokens only.
* Do not invent colors.
* Do not invent spacing.
* Do not invent shadows.
* Do not introduce one-off visual patterns.

---

## 1.3 Editor-Like UX

The product is a technical workspace.

The UI should feel:

* stable
* dense enough for productive work
* keyboard-friendly
* visually structured
* deterministic

Avoid:

* oversized cards
* playful layouts
* excessive whitespace
* consumer-app aesthetics

---

# 2. Color Token System

Never use raw hex values directly in components.

Always use semantic tokens.

---

## 2.1 Base Background Tokens

| Token                  | Hex         | Usage                       |
| ---------------------- | ----------- | --------------------------- |
| `bg.canvas`            | `#0D1117`   | Main application background |
| `bg.surface.primary`   | `#161B22`   | Panels, sidebars, dialogs   |
| `bg.surface.secondary` | `#1C2128`   | Secondary surfaces          |
| `bg.surface.tertiary`  | `#21262D`   | Hovered cards and controls  |
| `bg.overlay`           | `#0B0F14CC` | Modal and overlay backdrop  |

---

## 2.2 Border Tokens

| Token              | Hex       | Usage             |
| ------------------ | --------- | ----------------- |
| `border.primary`   | `#30363D` | Default borders   |
| `border.secondary` | `#21262D` | Subtle separators |
| `border.active`    | `#388BFD` | Focused elements  |
| `border.error`     | `#F85149` | Validation errors |

---

## 2.3 Text Tokens

| Token            | Hex       | Usage                  |
| ---------------- | --------- | ---------------------- |
| `text.primary`   | `#E6EDF3` | Main text              |
| `text.secondary` | `#9DA7B3` | Secondary labels       |
| `text.tertiary`  | `#6E7681` | Muted metadata         |
| `text.inverse`   | `#0D1117` | Text on bright accents |
| `text.error`     | `#FF7B72` | Error messages         |

---

## 2.4 Accent Tokens

| Token                   | Hex       | Usage                          |
| ----------------------- | --------- | ------------------------------ |
| `accent.primary`        | `#388BFD` | Main actions and highlights    |
| `accent.primary.hover`  | `#4C9EFF` | Hover state                    |
| `accent.primary.active` | `#1F6FEB` | Active state                   |
| `accent.secondary`      | `#1F2937` | Secondary highlighted controls |

---

## 2.5 Status Tokens

| Token            | Hex       | Usage                |
| ---------------- | --------- | -------------------- |
| `status.success` | `#3FB950` | Success states       |
| `status.warning` | `#D29922` | Warning states       |
| `status.error`   | `#F85149` | Error states         |
| `status.info`    | `#58A6FF` | Informational states |

---

## 2.6 Diagram-Specific Tokens

| Token                     | Hex       | Usage                     |
| ------------------------- | --------- | ------------------------- |
| `diagram.node.background` | `#161B22` | UML node background       |
| `diagram.node.border`     | `#30363D` | UML node border           |
| `diagram.node.selected`   | `#388BFD` | Selected node outline     |
| `diagram.edge.default`    | `#6E7681` | Default relationship edge |
| `diagram.edge.active`     | `#58A6FF` | Hovered/selected edge     |
| `diagram.grid`            | `#161B22` | Background grid           |

---

# 3. Typography

## 3.1 Font Families

| Usage             | Font           |
| ----------------- | -------------- |
| UI font           | Inter          |
| Code font         | JetBrains Mono |
| Method signatures | JetBrains Mono |
| Diagram labels    | Inter          |

---

## 3.2 Font Scale

| Token       | Size | Weight | Usage          |
| ----------- | ---- | ------ | -------------- |
| `text.xs`   | 12px | 400    | Metadata       |
| `text.sm`   | 13px | 400    | Labels         |
| `text.base` | 14px | 400    | Body text      |
| `text.md`   | 15px | 500    | Controls       |
| `text.lg`   | 18px | 600    | Panel headings |
| `text.xl`   | 22px | 700    | Major headers  |

---

## 3.3 Typography Rules

* Use monospace font for:

  * method signatures
  * parser errors
  * code snippets
  * UML field definitions

* Use Inter for:

  * navigation
  * buttons
  * labels
  * dialogs

* Never mix more than two font families.

---

# 4. Spacing System

Use a strict spacing scale.

| Token      | Value |
| ---------- | ----- |
| `space.1`  | 4px   |
| `space.2`  | 8px   |
| `space.3`  | 12px  |
| `space.4`  | 16px  |
| `space.5`  | 20px  |
| `space.6`  | 24px  |
| `space.8`  | 32px  |
| `space.10` | 40px  |

Rules:

* Prefer 8px multiples.
* Use consistent vertical rhythm.
* Avoid arbitrary padding values.

---

# 5. Border Radius Scale

| Token       | Value | Usage   |
| ----------- | ----- | ------- |
| `radius.sm` | 4px   | Inputs  |
| `radius.md` | 6px   | Buttons |
| `radius.lg` | 8px   | Panels  |
| `radius.xl` | 12px  | Modals  |

Rules:

* Do not exceed 12px radius.
* Avoid fully rounded pills except for status badges.

---

# 6. Shadow System

| Token       | Value                         | Usage  |
| ----------- | ----------------------------- | ------ |
| `shadow.sm` | `0 1px 2px rgba(0,0,0,0.25)`  | Inputs |
| `shadow.md` | `0 4px 12px rgba(0,0,0,0.35)` | Panels |
| `shadow.lg` | `0 8px 24px rgba(0,0,0,0.45)` | Modals |

Rules:

* Use shadows sparingly.
* Prefer borders over heavy elevation.

---

# 7. Layout Patterns

## 7.1 Main Application Layout

```text
┌─────────────────────────────────────────────┐
│ Top Navigation                              │
├──────────────┬──────────────────────────────┤
│ Left Sidebar │ Diagram Workspace            │
│              │                              │
│              │                              │
├──────────────┴──────────────────────────────┤
│ Bottom Status Bar                           │
└─────────────────────────────────────────────┘
```

---

## 7.2 Top Navigation

Contains:

* project name
* save status
* version actions
* export actions
* user menu

Rules:

* Fixed height: 56px
* Always visible
* Border-bottom separator required

---

## 7.3 Left Sidebar

Contains:

* diagram structure
* UML entities
* relationships
* parser controls
* diagram settings

Rules:

* Fixed width: 280px
* Collapsible
* Independent scroll area

---

## 7.4 Diagram Workspace

Rules:

* Infinite canvas feel
* Dark grid background
* Minimal visual noise
* Node drag interactions must feel responsive
* Use subtle grid visibility only

---

## 7.5 Bottom Status Bar

Contains:

* save status
* parser status
* selected element info
* zoom level

Rules:

* Fixed height: 28px
* Low visual emphasis
* Use muted colors

---

# 8. Component Library Conventions

## 8.1 General Rules

All components must:

* Use shared tokens only
* Support keyboard interaction
* Support focus states
* Support disabled states
* Avoid inline styles unless dynamic rendering requires them

---

## 8.2 Buttons

### Primary Button

* Background: `accent.primary`
* Text: `text.inverse`
* Radius: `radius.md`

### Secondary Button

* Background: `bg.surface.secondary`
* Border: `border.primary`

### Destructive Button

* Background: `status.error`

---

## 8.3 Inputs

Rules:

* Height: 36px
* Background: `bg.surface.secondary`
* Border on focus: `border.active`
* Use monospace for code-like inputs

---

## 8.4 Modals

Rules:

* Use centered layout
* Maximum width: 640px
* Use `shadow.lg`
* Backdrop required
* Prevent background interaction

---

## 8.5 Side Panels

Rules:

* Used for UML editing forms
* Slide from right side
* Width: 360px
* Independent scroll area

---

## 8.6 UML Nodes

Rules:

* Structured compartments:

  * title
  * fields
  * methods
* Thin border
* Minimal padding
* Use monospace for fields and methods

Selected node:

* Blue outline
* Slight elevation increase

---

# 9. Icon System

## 9.1 Icon Library

Use:

* urlLucide Icons[https://lucide.dev](https://lucide.dev)

Do not mix icon libraries.

---

## 9.2 Icon Style

Use:

* Filled-style usage patterns where appropriate
* Consistent stroke weight
* Consistent sizing

---

## 9.3 Icon Sizes

| Usage         | Size |
| ------------- | ---- |
| Small actions | 14px |
| Standard UI   | 16px |
| Toolbar       | 18px |
| Major actions | 20px |

---

# 10. Interaction Rules

## 10.1 Hover States

Hover effects must:

* Be subtle
* Avoid large motion
* Prefer brightness shifts
* Preserve readability

---

## 10.2 Animations

Rules:

* Fast and minimal
* Use only for:

  * modal transitions
  * panel transitions
  * selection feedback

Avoid:

* bounce animations
* large scale effects
* decorative motion

---

## 10.3 Focus States

All interactive elements must:

* Have visible focus rings
* Use `accent.primary`
* Support keyboard navigation

---

# 11. Diagram Canvas Rules

## 11.1 Canvas Behavior

The canvas should behave like an IDE workspace.

Requirements:

* Smooth zooming
* Smooth panning
* Deterministic drag behavior
* No delayed selection feedback
* Maintain high contrast against nodes

---

## 11.2 Relationship Rendering

Rules:

* Relationship arrows must remain visually distinct
* Inheritance arrows must use UML-standard triangle heads
* Composition must use filled diamonds
* Aggregation must use outlined diamonds

---

## 11.3 Grid Rules

Use:

* subtle dotted or line grid
* low contrast
* no decorative patterns

---

# 12. Tailwind Usage Rules

## 12.1 Use Semantic Tokens

Do not:

```tsx
className="bg-[#161B22]"
```

Use:

```tsx
className="bg-surface-primary"
```

---

## 12.2 Utility Usage

Prefer utility classes.

Avoid:

* deep CSS nesting
* arbitrary one-off utility chains
* duplicated styling patterns

---

# 13. Responsive Behavior

## 13.1 Desktop-First

The application is optimized primarily for desktop usage.

Minimum supported width:

* 1280px

---

## 13.2 Mobile Behavior

Mobile support is secondary.

Rules:

* Allow viewing
* Do not optimize for heavy editing workflows
* Sidebar becomes overlay drawer on narrow screens

---

# 14. Hard UI Constraints

1. Never use raw hex values directly in components.
2. Never mix icon libraries.
3. Never use glassmorphism or decorative gradients.
4. Never allow the diagram canvas to visually overpower the editor controls.
5. Never create custom spacing values outside the spacing scale.
6. Never use oversized border radii.
7. Never introduce light theme styles.
8. Never create inconsistent node styles across UML entity types.
9. Never mix semantic business state into purely visual components.
10. Never introduce consumer-app visual patterns into the editor workspace.
