
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## Project Overview

- **Angular 21** application (standalone, zoneless, no `zone.js`)
- **Vitest** for unit testing
- **SCSS** for styles
- **Style guide 2025**: concise file naming (`app.ts`, `app.html`, `app.scss` — NOT `app.component.ts`)
- **Prettier** configured in `package.json`

## Commands

- `ng serve` — start dev server
- `ng test` — run unit tests (Vitest)
- `ng test --watch` — run tests in watch mode
- `ng build` — production build
- `ng generate component <name>` — scaffold a component

## Project Structure

```
src/
  app/
    app.ts              # Root component
    app.html            # Root template
    app.scss            # Root styles
    app.spec.ts         # Root component tests
    app.config.ts       # Application providers
    app.routes.ts       # Route definitions
    core/               # Shared cross-feature code
      domain/           # Shared models, value objects, interfaces
      application/      # Shared use cases, ports
      infrastructure/   # Shared adapters, implementations
    features/           # Feature modules (hexagonal)
      <feature-name>/
        domain/         # Models, value objects, port interfaces
        application/    # Use cases, orchestration
        infrastructure/ # Adapters, API clients, storage
        presentation/   # Components, pages, pipes, directives
        <feature-name>.routes.ts
  main.ts               # Bootstrap
  index.html            # HTML entry point
  styles.scss           # Global styles
public/                 # Static assets
```

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Zoneless

- This project does NOT use `zone.js`. Change detection is driven by signals.
- Do NOT import `zone.js` or `NgZone`
- Do NOT use `NgZone.run()`, `NgZone.runOutsideAngular()`, or any zone-related API
- Use `signal()`, `computed()`, and `effect()` for reactivity
- Always set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file
- Follow the 2025 file naming convention: `my-feature.ts`, NOT `my-feature.component.ts`

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.
- Do not write arrow functions in templates (they are not supported).

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Testing

- Test runner: **Vitest** (NOT Karma, NOT Jest)
- Test files are colocated with source: `my-feature.spec.ts`
- Use `describe()` / `it()` / `expect()` from Vitest globals (configured in `tsconfig.spec.json`)
- Use `TestBed.configureTestingModule()` for component tests
- Use `fixture.whenStable()` for async rendering (zoneless)
- Do NOT use `fakeAsync` / `tick` — these rely on `zone.js`
- Run tests with `ng test` or `ng test --watch`

## Styles

- Use **SCSS** for all component and global styles
- Global styles go in `src/styles.scss`
- Component styles use `.scss` extension

## Hexagonal Architecture

This project follows a **hexagonal architecture** (ports & adapters) enforced by `eslint-plugin-boundaries`.

### Path Aliases

- `@core/*` → `src/app/core/*`
- `@features/*` → `src/app/features/*`

### Layers & Dependency Rules

| Layer | Can import from | Cannot import |
|---|---|---|
| **Domain** | Nothing (self-contained) | `@angular/*`, `rxjs` |
| **Application** | Domain | `@angular/common`, `@angular/router`, `@angular/forms`, `rxjs` |
| **Infrastructure** | Domain, Application | — |
| **Presentation** | Application, Domain | Infrastructure directly |
| **Feature routes** | All layers of the same feature | Other features directly |

- Feature layers can only import from the **same feature** (not other features)
- All feature layers can import from `core/` at the corresponding level or below
- `app-root` files (`app.ts`, `app.config.ts`, `app.routes.ts`) can import from anywhere

### File Naming Conventions

- `*.model.ts` — Domain models and value objects (in `domain/`)
- `*.port.ts` — Port interfaces as abstract classes (in `domain/`)
- `*.use-case.ts` — Application use cases (in `application/`)
- `*.adapter.ts` — Infrastructure adapters implementing ports (in `infrastructure/`)
- Components, pipes, directives follow the 2025 naming convention in `presentation/`

### Ports & Adapters with Angular DI

Ports are defined as **abstract classes** (not interfaces) so Angular's DI can inject them:

```typescript
// domain/recipe-repository.port.ts
export abstract class RecipeRepositoryPort {
  abstract getAll(): Signal<Recipe[]>;
  abstract getById(id: string): Signal<Recipe | undefined>;
}
```

```typescript
// infrastructure/http-recipe-repository.adapter.ts
@Injectable()
export class HttpRecipeRepositoryAdapter extends RecipeRepositoryPort {
  // implementation
}
```

```typescript
// feature routes or app.config.ts — wire the adapter
{ provide: RecipeRepositoryPort, useClass: HttpRecipeRepositoryAdapter }
```

### Creating a New Feature

1. Create the feature directory: `src/app/features/<feature-name>/`
2. Create subdirectories: `domain/`, `application/`, `infrastructure/`, `presentation/`
3. Define domain models in `domain/*.model.ts`
4. Define ports as abstract classes in `domain/*.port.ts`
5. Implement use cases in `application/*.use-case.ts` (depend only on ports)
6. Implement adapters in `infrastructure/*.adapter.ts`
7. Create components in `presentation/`
8. Create `<feature-name>.routes.ts` at the feature root — wire DI providers and lazy-load presentation components
9. Register the feature route in `src/app/app.routes.ts` with `loadChildren`
