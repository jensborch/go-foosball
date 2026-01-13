# Go-Foosball AI Coding Instructions

## Project Overview

This is a **foosball tournament management system** with a Go REST API backend and React/TypeScript frontend. The backend embeds the frontend using Go's `embed` package for single-binary deployment.

## Architecture & Key Components

### Backend Structure (Go)

- **`main.go`**: Entry point with embedded React client, Gin router setup, SQLite connection
- **`model/`**: Domain models using GORM (Tournament, Player, Game, Table)
- **`persistence/`**: Repository pattern with GORM, singleton game combinations manager
- **`resources/`**: HTTP handlers following RESTful patterns, WebSocket event publishers
- **Database**: SQLite with GORM AutoMigrate, connection pooling (max 10 connections)

### Frontend Structure (React/TypeScript)

- **Vite build system** with TypeScript, MUI components, TanStack Query for state management
- **API client**: Auto-generated from Swagger using `swagger-typescript-api`
- **Real-time updates**: WebSocket connections for live game events

### Key Patterns

1. **Repository Pattern**: `persistence/` layer abstracts GORM operations
2. **Resource Handlers**: Each endpoint returns `func(*gin.Context)` closures with injected dependencies
3. **Embedded Static**: `//go:embed client/dist` serves React app from Go binary
4. **Singleton Game Logic**: `GetGameCombinationsInstance(tournamentId)` manages round-robin tournaments

## Development Workflows

### Building & Testing

```bash
# Full build with embedded client
make client build

# Backend only
make build

# Run tests with coverage
make test  # or: go test -race -covermode=atomic -coverprofile=coverage.out ./...

# Frontend development
cd client && pnpm start  # Development server on :3000
cd client && pnpm build  # Production build
```

### Database & Migrations

- **No manual migrations**: GORM AutoMigrate handles schema changes
- **SQLite file**: Default `foosball.db`, configurable via `--db` flag
- **Connection pooling**: `SetMaxOpenConns(10)` for concurrency

### API Documentation

```bash
make swagger  # Generates docs from Go annotations
# View at: http://localhost:8080/swagger/index.html
```

## Project-Specific Conventions

### Go Code Patterns

- **Error handling**: Use `HandlePanic(c)` in all Gin handlers via `defer`
- **Repository constructors**: `persistence.NewXRepository(db *gorm.DB)`
- **Validation**: Custom validators registered in `main.go` (e.g., `GameWinnerValidator`)
- **Base model**: All entities embed `model.Base` with GORM fields and JSON tags

### Gin Framework Patterns

- **Handler Function Factories**: All handlers return `func(*gin.Context)` closures with injected dependencies

```go
func GetPlayer(param string, db *gorm.DB) func(*gin.Context) {
    return func(c *gin.Context) {
        defer HandlePanic(c)
        // handler logic
    }
}
```

- **Route Groups**: Organize endpoints by resource with `/api` prefix
- **Parameter Extraction**: Use `c.Param(param)` for path params, `c.GetQuery()` for query params
- **Request Binding**: Use `c.ShouldBindJSON(&struct{})` with validation tags
- **Response Patterns**: Consistent JSON responses with proper HTTP status codes
- **Error Handling**: `defer HandlePanic(c)` in every handler for centralized error management
- **Custom Validation**: Register domain-specific validators like `gamewinner` for business rules
- **CORS Middleware**: `AllowAllOrigins` configuration for development flexibility
- **Static File Serving**: Embedded React app served via custom `serveStatic` function
- **WebSocket Upgrades**: Use gorilla/websocket upgrader for real-time events

### GORM Relationship Patterns

- **Foreign Keys**: Use `uint` IDs with `gorm:"not null"` and corresponding struct fields for associations
- **Join Tables**: `TournamentTable` and `TournamentPlayer` implement many-to-many relationships
- **Composite Unique Indexes**: `gorm:"index:player_tournament,unique"` ensures unique player-tournament pairs
- **Embedded Structs**: `Color` embedded in `Table` with `gorm:"embedded"` tag
- **Complex Queries**: Use `Preload(clause.Associations)` for eager loading all nested relationships
- **Manual Joins**: Combine `Joins()` with `Preload()` for performance in complex queries

```go
// Example: Loading games with all player associations
r.db.Preload("RightPlayerOne.Player").
    Preload("RightPlayerTwo.Player").
    Preload("LeftPlayerOne.Player").
    Preload("LeftPlayerTwo.Player").
    Preload(clause.Associations)
```

- **Soft Deletes**: Use `gorm.DeletedAt` in `model.Base` for soft delete functionality
- **History Tracking**: `TournamentPlayerHistory` tracks ranking changes over time without foreign key to main record

### Testing Approach

### Testing Approach

- **Integration tests**: Use `httptest.Server` with real database in `main_test.go`
- **Test helpers**: Functions returning `func(t *testing.T)` for reusable test logic
- **No mocking**: Tests use actual SQLite in-memory database
- **Test database cleanup**: `startServer()` removes `test.db` before each run
- **HTTP testing patterns**: Direct HTTP calls to test endpoints end-to-end

### Frontend Patterns

- **API integration**: Regenerate `src/api/Api.ts` when backend changes: `pnpm swagger`
- **State management**: TanStack Query for server state, React state for UI
- **Styling**: MUI components with emotion/styled, custom theming in `src/components/Theming.tsx`

### React/TypeScript Frontend Architecture

- **Build System**: Vite with SWC for fast builds and HMR
- **Package Manager**: pnpm with `preinstall` hook enforcing usage
- **TypeScript**: Strict mode enabled with comprehensive type checking
- **Testing**: Vitest with jsdom environment, Testing Library for component tests

### MUI (Material-UI) Patterns

```tsx
// Styled components with theme integration
export const StyledCard = styled((props: CardProps) => (
  <Card elevation={4} {...props} />
))``;

// Theme customization in Theming.tsx
export const theme = createTheme({
  palette: {
    primary: { main: "#37474f" },
    secondary: { main: "#e65100" },
  },
});
```

- **Component Library**: MUI v7 with emotion/styled for custom styling
- **Icons**: @mui/icons-material for consistent iconography
- **Typography**: Roboto font family loaded via @fontsource
- **Theming**: Centralized theme configuration with custom primary/secondary colors
- **Layout**: Grid system for responsive layouts, CssBaseline for consistent defaults

### TanStack Query Integration

```tsx
// Custom hooks with cache key management
export const usePlayers = (tournament: number) => {
  return useQuery<Api.Player[], Error>({
    queryKey: [CacheKeys.Players, tournament],
    queryFn: async () => api.players.playersList({ exclude: tournament }),
  });
};
```

- **Cache Management**: Enum-based cache keys in `CacheKeys`
- **Error Handling**: Centralized error handling via `handleErrors` utility
- **Optimistic Updates**: Mutations with automatic cache invalidation
- **Background Refetching**: Disabled `refetchOnWindowFocus`, limited retry attempts

### Vite Configuration

- **Base Path**: `/client` for embedded deployment in Go binary
- **Plugins**: React SWC for fast compilation, SVG support, TypeScript paths
- **Testing**: Integrated Vitest configuration with coverage reporting
- **Environment**: jsdom for browser-like testing environment

### Development Workflow

```bash
# Frontend development server (port 3000)
cd client && pnpm start

# Production build for embedding
cd client && pnpm build

# Run tests with coverage
cd client && pnpm test:ci

# Regenerate API client from Swagger
cd client && pnpm swagger
```

### Component Patterns

- **Error Boundaries**: App-level error catching with fallback UI
- **Full-Screen Dialogs**: Reusable dialog pattern for forms
- **Styled Components**: emotion/styled for theme-aware custom components
- **Real-time Updates**: WebSocket integration for live tournament data
- **Form Handling**: Controlled components with MUI TextField patterns

### Real-time Features

- **WebSocket events**: Tournament/game updates via `resources/events.go`
- **Event types**: Player events (`/tournaments/:id/events/player`) and game events (`/tournaments/:id/events/game`)
- **Connection management**: `EventPublisher` handles WebSocket lifecycle per tournament

## Integration Points

### Client-Server Communication

- **API Base**: `/api/*` routes for REST endpoints
- **Static serving**: `/client/*` serves embedded React app
- **Avatars**: `/avatars` serves uploaded player images from filesystem

### External Dependencies

- **Backend**: Gin, GORM, SQLite driver, Swagger generation
- **Frontend**: React 18, MUI, TanStack Query, Recharts for analytics
- **Build tools**: Go embed, Vite, pnpm package management

### Cross-Component Data Flow

1. **Tournament creation** → Players/tables assignment → Game generation → Real-time updates
2. **Elo rating system** implemented in `model/player.go` for competitive scoring
3. **Round-robin logic** in `persistence/combinations.go` manages fair game scheduling
4. **Game scoring**: Winners gain points, losers lose points based on rating differential
5. **History tracking**: Player ranking changes saved automatically in `TournamentPlayerHistory`

## Key Files for Understanding

- **`main.go`**: Application bootstrap, routing, database setup
- **`CONVENTIONS.md`**: Detailed coding standards and project structure rules
- **`model/model.go`**: Base entity structure with GORM integration
- **`persistence/combinations.go`**: Complex tournament game scheduling logic
- **`client/src/api/Api.ts`**: Auto-generated TypeScript API client
- **`Makefile`**: Cross-platform build targets and development commands
