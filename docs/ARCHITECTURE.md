# Architecture Overview

## System Architecture

Previous Admin follows a **client-server architecture**:

```
┌─────────────────┐                    ┌──────────────────┐
│   Web Browser   │                    │  Express Server  │
│                 │  ◄─────────────►   │                  │
│   React App     │    HTTP/REST       │  Node.js/Backend │
│   (Port 2342)   │                    │  (Port 2342/3001)│
└─────────────────┘                    └──────────────────┘
                                               │
                                               ▼
                                        ┌──────────────┐
                                        │  SQLite DB   │
                                        │              │
                                        │ ~/.previous- │
                                        │ admin/       │
                                        │ previous-    │
                                        │ admin.db     │
                                        └──────────────┘
                                               │
                                               ▼
                                        ┌──────────────┐
                                        │ macOS/Linux  │
                                        │   Config     │
                                        │   Files      │
                                        └──────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App (Root)
├── AuthContext Provider
├── SettingsContext Provider
├── NotificationContext Provider
│
└── TAB Navigation
    ├── Configuration List Page
    │   └── Configuration Item
    │       ├── Config Input (Boolean/String/Number/Enum)
    │       ├── Config Item Controls
    │       └── Config Item Actions
    │
    ├── System Page
    │   ├── System Info Panel
    │   └── Real-Time Charts
    │       ├── CPU Load Chart
    │       ├── Memory Chart
    │       ├── Network Traffic Chart
    │       └── Disk I/O Chart
    │
    └── About Page
        └── Version Info
```

### State Management Pattern

```
Contexts (Global State)
├── AuthContext
│   └── User session and authentication
├── SettingsContext
│   └── User preferences and theme
└── NotificationContext
    └── Toast notifications and alerts

Custom Hooks (Business Logic)
├── useConfigActions()
│   └── Create, update, delete configurations
├── useConfigList()
│   └── Fetch and manage configuration list
└── useSystemMetrics()
    └── Fetch and store system metrics
```

### Communication Pattern

```
Frontend Component
    │
    ▼
Custom Hook (useConfigActions, etc.)
    │
    ▼
API Client (lib/api/*)
    │
    └─► HTTP REST ──► Backend API
```

## Backend Architecture

### Request Processing Pipeline

```
HTTP Request
    │
    ▼
Express Router
    │
    ├─► /api/configs ──► Configuration APIs
    ├─► /api/system ──► System Information APIs
    ├─► /api/database ──► Database Query APIs
    └─► /api/update ──► Update Check APIs
        │
        ▼
    Handler Function
        │
        ├─► ConfigurationService
        │   ├─► ConfigManager (Platform-Specific)
        │   ├─► Database
        │   └─► File Watching
        │
        ├─► Platform Operations
        │   ├─► System Info Collection
        │   ├─► Metrics Collection
        │   └─► OS-Specific Commands
        │
        └─► Database Queries
            └─► SQLite Operations
```

### Configuration Management Layer

```
ConfigManager (Abstract Interface)
    │
    ├─► macOS ConfigManager
    │   └── Reads/writes .plist files
    │   └── Uses launchctl for service management
    │
    ├─► Linux ConfigManager
    │   └── Reads/writes .cfg files
    │   └── Uses systemctl for service management
    │
    └─► Platform Detection
        └── Runtime platform detection
        └── Automatic implementation selection
```

### Data Flow: Configuration Update

```
1. User modifies configuration in UI
                │
                ▼
2. Frontend sends HTTP POST /api/configs
                │
                ▼
3. Backend receives in /api/config.ts
                │
                ▼
4. Validates configuration
                │
                ▼
5. ConfigManager writes to OS config file
    (macOS: .plist | Linux: .cfg)
                │
                ▼
6. Database stores configuration metadata
                │
                ▼
7. Returns success response to frontend
```

### Data Flow: Real-Time Metrics

```
1. Frontend opens System page
    │
    └─► HTTP GET /api/system/metrics
        │
        ▼
2. Backend metrics handler
    │
    ├─► Collects system metrics
    │   ├─► CPU load (via /proc or `sysctl`)
    │   ├─► Memory usage (via /proc or `vm_stat`)
    │   ├─► Disk I/O stats
    │   └─► Network traffic stats
    │
    └─► Returns JSON response
        │
        ▼
3. Frontend receives metrics
    │
    ├─► Updates chart data
    ├─► Re-renders charts (React)
    └─► Displays visualization
```

## Database Schema

### Configurations Table

```sql
CREATE TABLE configurations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    config TEXT NOT NULL,        -- JSON-encoded configuration
    order INTEGER DEFAULT 0,      -- Sort order
    active INTEGER DEFAULT 0,     -- Is configuration active
    created_at DATETIME,
    updated_at DATETIME,
    UNIQUE(name)
)
```

**Key Features**:
- Lightweight schema with minimal structure
- Configurations stored as JSON for flexibility
- Metadata tracking (creation, updates, active status)
- Natural sorting via order field

## Design Patterns

### Platform Abstraction

```typescript
// Single interface, multiple implementations
interface IPlatformOperations {
  getSystemInfo(): Promise<SystemInfo>;
  getMetrics(): Promise<Metrics>;
  executeCommand(cmd: string): Promise<string>;
}

// Runtime selection
const platform = detectPlatform();
const operations = platform === 'darwin' 
  ? new MacOSOperations() 
  : new LinuxOperations();
```

### Error Handling

- **Frontend**: Error boundaries catch React errors
- **Backend**: Try-catch blocks with proper HTTP status codes
- **Database**: Automatic schema initialization on first run
- **Validation**: Schema validation before accepting configuration changes

### File Watching

- **Debounced Updates**: Prevents rapid consecutive file writes
- **External Sync**: Detects and syncs external configuration changes
- **Change Detection**: Compares file hashes to detect genuine changes

## Scalability Considerations

### Frontend
- Component-based architecture enables code splitting
- Vite supports dynamic imports for lazy loading
- React Context prevents prop drilling across deep component trees

### Backend
- Stateless HTTP handlers allow horizontal scaling
- Database abstraction allows easy migration if needed
- Platform-specific optimizations for system metrics collection

### Performance Optimizations

#### Frontend
- Code splitting via Vite
- Memoized components to prevent unnecessary re-renders
- Debounced input handlers
- Efficient chart updates (only changed data points)

#### Backend
- Metrics collected on background intervals
- Configuration caching to reduce file I/O
- Efficient database queries with proper indexing

## Security Considerations

- **Database**: SQLite file permissions restrict access
- **API**: No authentication required (runs on trusted network)
- **File Access**: Platform-specific permission checks
- **Input Validation**: All configuration values validated against schema
- **Error Messages**: Generic error messages to prevent information leakage

## Extension Points

### Adding New Metrics

1. Add collection logic to `backend/metrics.ts`
2. Define new metric type in `shared/types.ts`
3. Create new chart component in `frontend/components/charts/`
4. Connect to metrics API endpoint in frontend

### Supporting New Platforms

1. Create new file in `backend/platform/{platform}/`
2. Implement `IPlatformOperations` interface
3. Create `{Platform}ConfigManager` in `backend/config/`
4. Update `platform-detector.ts` for detection
5. Update `config-manager-factory.ts` for instantiation

### Adding Configuration Sections

1. Update reference configuration (`backend/config-schema/reference.cfg`)
2. Run `npm run generate:schema` to regenerate types
3. Run `npm run generate:translationkeys` to update translations
4. Frontend automatically reflects new configuration options
