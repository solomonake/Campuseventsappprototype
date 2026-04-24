# Architecture Guide - High Cohesion & Low Coupling

## Beginner's Guide to Software Architecture

### What is High Cohesion?

**High Cohesion** means each file/component has ONE clear job and does it well.

Think of it like organizing a toolbox:
- ✅ GOOD: Screwdrivers drawer, Hammers drawer, Nails drawer
- ❌ BAD: Random tools mixed together everywhere

**Example in our code:**
- `EventService.ts` - ONLY handles event operations
- `AuthContext.tsx` - ONLY handles user authentication
- `LocationPicker.tsx` - ONLY handles location selection

### What is Low Coupling?

**Low Coupling** means components don't depend too much on each other.

Think of it like building with LEGO blocks:
- ✅ GOOD: Each block connects through standard pegs (interface)
- ❌ BAD: Blocks glued together (can't change one without breaking others)

**Example in our code:**
- MapService doesn't know about EventService internals
- Components receive data through props (not reaching into other files)
- Services use interfaces, not concrete implementations

---

## Our Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     React Components                     │
│  (What users see and interact with - UI ONLY)           │
├─────────────────────────────────────────────────────────┤
│  Pages/          Components/         UI Components/     │
│  - EventFeed     - LocationPicker    - Button          │
│  - CreateEvent   - NFCCheckIn        - Card            │
│  - MapView       - ...               - Input           │
└─────────────────────────────────────────────────────────┘
                          ↓ Uses (Props & Hooks)
┌─────────────────────────────────────────────────────────┐
│                    Context Providers                     │
│  (Global state management - COORDINATION)                │
├─────────────────────────────────────────────────────────┤
│  AuthContext     - User login/logout/session            │
│  AppContext      - App-wide state & service instances   │
└─────────────────────────────────────────────────────────┘
                          ↓ Uses (Instantiates)
┌─────────────────────────────────────────────────────────┐
│                    Service Layer                         │
│  (Business logic - DOES THE WORK)                       │
├─────────────────────────────────────────────────────────┤
│  EventService         - Create/read/update events       │
│  ApprovalService      - Approve/reject events           │
│  CheckInService       - Handle attendance               │
│  MapService           - Map calculations                │
│  RoleRequestService   - Role change requests            │
└─────────────────────────────────────────────────────────┘
                          ↓ Works with
┌─────────────────────────────────────────────────────────┐
│                    Data Models                           │
│  (TypeScript interfaces - SHAPE OF DATA)                │
├─────────────────────────────────────────────────────────┤
│  types/models.ts  - Event, User, Location, etc.        │
└─────────────────────────────────────────────────────────┘
                          ↓ Uses
┌─────────────────────────────────────────────────────────┐
│                    Configuration                         │
│  (Settings & rules - CHANGEABLE WITHOUT CODE EDITS)     │
├─────────────────────────────────────────────────────────┤
│  config/culturalCredit.ts  - Credit rules               │
│  data/mockData.ts          - Sample data                │
└─────────────────────────────────────────────────────────┘
```

---

## Key Architectural Principles

### 1. Separation of Concerns (HIGH COHESION)

Each layer has ONE responsibility:

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Components** | Display UI and handle user input | Button clicks, form inputs |
| **Contexts** | Manage global state | Current user, app settings |
| **Services** | Execute business logic | Filter events, approve requests |
| **Models** | Define data structure | What an Event looks like |
| **Config** | Store changeable rules | Cultural credit requirements |

**Why this matters:**
- Need to change how events are filtered? → Only edit EventService
- Need to change the UI? → Only edit components
- Need to change credit rules? → Only edit config file

### 2. Dependency Direction (LOW COUPLING)

Dependencies flow ONE WAY (downward):

```
Components → Contexts → Services → Models → Config
```

**Rules:**
- ✅ Components CAN use Contexts
- ✅ Services CAN use Models
- ❌ Services CANNOT use Components
- ❌ Models CANNOT use Services

**Why this matters:**
- Can change UI without touching services
- Can replace services without changing UI
- Each layer is independent

### 3. Interface-Based Design (LOW COUPLING)

Services expose **contracts** (interfaces), not implementations:

```typescript
// GOOD - Using interface
interface MapPin {
  id: string;
  coordinates: { lat: number; lng: number };
}

class MapService {
  eventsToMapPins(events: Event[]): MapPin[] {
    // Component only knows about MapPin, not Event internals
  }
}

// BAD - Direct dependency
// Component would need to know Event structure
```

**Why this matters:**
- MapView only knows about MapPin (simple)
- EventService can change Event structure
- MapView won't break when Event changes

---

## Design Patterns Used

### 1. Strategy Pattern (EventService filters)

**What it is:** Different ways to do the same job, swappable at runtime.

**Like:** Different payment methods at a store (cash, card, phone).

**In our code:**
```typescript
// Each filter is a separate strategy
class TagFilterStrategy {
  apply(events: Event[]): Event[] { /* filter by tags */ }
}

class CostFilterStrategy {
  apply(events: Event[]): Event[] { /* filter by cost */ }
}

// EventService combines them
everyFilter.apply(events); // Works on any strategy!
```

**Benefits:**
- ✅ Easy to add new filters (just add new strategy class)
- ✅ Each filter is independent and testable
- ✅ Can combine filters in any order

### 2. Context API Pattern (Global State)

**What it is:** A way to share data across many components without passing props everywhere.

**Like:** A school announcement system (everyone can hear, no need to tell each person).

**In our code:**
```typescript
// AuthContext makes user data available everywhere
<AuthProvider>
  <EventFeed />  {/* Can access user */}
  <MapView />    {/* Can access user */}
</AuthProvider>
```

**Benefits:**
- ✅ Don't need to pass user through every component
- ✅ Single source of truth for user data
- ✅ Easy to update (change in one place)

### 3. Service Layer Pattern (Business Logic)

**What it is:** Separate the "brain" (logic) from the "face" (UI).

**Like:** Restaurant - Waiters (UI) vs. Chefs (logic).

**In our code:**
```typescript
// Component (UI) - Just displays and collects input
function EventFeed() {
  const { eventService } = useApp();
  const events = eventService.getApprovedEvents();
  return <div>{events.map(...)}</div>;
}

// Service (Logic) - Does the actual work
class EventService {
  getApprovedEvents(): Event[] {
    return this.events.filter(e => e.status === 'approved');
  }
}
```

**Benefits:**
- ✅ Can test logic without rendering UI
- ✅ Can change UI without touching logic
- ✅ Can reuse logic in different UIs

---

## Coupling Analysis

### Low Coupling Examples (GOOD ✅)

1. **MapService ↔ EventService**
   ```typescript
   // MapService converts to simple MapPin (interface)
   // Doesn't need to know Event internals
   eventsToMapPins(events: Event[]): MapPin[]
   ```
   **Coupling Level:** LOW ✅

2. **Components ↔ Services**
   ```typescript
   // Component uses service through context (abstraction)
   const { eventService } = useApp();
   // Not: import EventService directly
   ```
   **Coupling Level:** LOW ✅

3. **Config ↔ Business Logic**
   ```typescript
   // Logic reads config, doesn't hard-code rules
   if (attendanceMinutes >= CulturalCreditConfig.minimumDuration)
   // Not: if (attendanceMinutes >= 30)
   ```
   **Coupling Level:** LOW ✅

### Where We Could Improve

1. **Components importing mockData directly**
   ```typescript
   // CURRENT (Medium coupling)
   import { mockLocations } from "../data/mockData";

   // BETTER (Low coupling)
   const { locations } = useApp();
   ```
   **Fix:** Move mockData into AppContext

2. **Services holding events array**
   ```typescript
   // CURRENT (Shared state)
   class EventService {
     private events: Event[];
   }

   // BETTER (Stateless)
   class EventService {
     filterEvents(events: Event[], criteria: FilterCriteria) { }
   }
   ```
   **Fix:** Make services stateless, pass data in

---

## Cohesion Analysis

### High Cohesion Examples (GOOD ✅)

1. **EventService**
   - ✅ Only handles event operations
   - ✅ All methods relate to events
   - ✅ Single, clear purpose

2. **LocationPicker**
   - ✅ Only handles location selection
   - ✅ All code relates to picking locations
   - ✅ Self-contained component

3. **AuthContext**
   - ✅ Only handles authentication
   - ✅ All methods relate to user session
   - ✅ Clear responsibility

### Medium Cohesion (Could Improve)

1. **AppContext** (does a lot)
   - Manages events
   - Manages filters
   - Manages preferences
   - Manages services

   **Better:** Split into separate contexts
   ```typescript
   EventContext  - Just event state
   FilterContext - Just filter state
   ServiceContext - Just service instances
   ```

---

## File Organization (Cohesion by Location)

```
src/app/
├── components/          # UI components (cohesive - all UI)
│   ├── ui/             # Reusable UI primitives
│   ├── LocationPicker  # Feature-specific component
│   └── NFCCheckIn      # Feature-specific component
│
├── pages/              # Route pages (cohesive - all pages)
│   ├── EventFeed
│   ├── CreateEvent
│   └── MapView
│
├── contexts/           # Global state (cohesive - all contexts)
│   ├── AuthContext
│   └── AppContext
│
├── services/           # Business logic (cohesive - all logic)
│   ├── EventService
│   ├── MapService
│   └── CheckInService
│
├── types/              # Data models (cohesive - all types)
│   └── models.ts
│
├── config/             # Configuration (cohesive - all config)
│   └── culturalCredit.ts
│
└── data/               # Mock data (cohesive - all data)
    └── mockData.ts
```

**Why this organization?**
- Easy to find files (cohesive grouping)
- Clear boundaries between layers
- New developers understand structure quickly

---

## Rules for Maintaining Architecture

### When Adding New Features

1. **Ask: What layer does this belong to?**
   - UI? → Component
   - Logic? → Service
   - Data shape? → Model
   - Global state? → Context

2. **Keep dependencies flowing downward**
   ```
   Component → Context → Service → Model
   ```

3. **One responsibility per file**
   - EventService = events only
   - Not: EventAndUserService ❌

### When Modifying Code

1. **Change only ONE layer when possible**
   - UI change? → Edit component only
   - Logic change? → Edit service only

2. **Use interfaces between layers**
   - Service returns MapPin, not Event
   - Component receives props, not imports

3. **Configuration over code**
   - Add to config file
   - Not: Hard-code in logic

---

## Testing Strategy (Based on Architecture)

### Unit Tests (Single Component)
```typescript
// Test service alone (no UI needed)
test('EventService filters by tags', () => {
  const service = new EventService(mockEvents);
  const filtered = service.applyFilters({ tags: ['Arts'] });
  expect(filtered.length).toBe(2);
});
```

### Integration Tests (Multiple Components)
```typescript
// Test service + context together
test('AppContext provides EventService', () => {
  const { result } = renderHook(() => useApp());
  expect(result.current.eventService).toBeDefined();
});
```

### Component Tests (UI)
```typescript
// Test component with mocked context
test('EventFeed displays events', () => {
  render(<EventFeed />, { wrapper: TestProviders });
  expect(screen.getByText('Fall Career Fair')).toBeInTheDocument();
});
```

**Why this works:**
- Each layer tests independently (low coupling)
- Tests are focused (high cohesion)
- Can test logic without rendering UI

---

## Summary Checklist

**High Cohesion Checklist:**
- [ ] Each file has ONE clear purpose
- [ ] Related functionality is grouped together
- [ ] File names clearly indicate what's inside
- [ ] No "god objects" doing everything

**Low Coupling Checklist:**
- [ ] Components don't import services directly
- [ ] Services don't import components
- [ ] Changes in one layer don't require changes in others
- [ ] Using interfaces between layers
- [ ] Configuration separate from logic

---

## For Beginners: Key Takeaways

1. **High Cohesion = "Everything in its place"**
   - Each file does ONE job
   - Related code stays together

2. **Low Coupling = "Independent pieces"**
   - Files don't know too much about each other
   - Can change one without breaking others

3. **Why It Matters:**
   - Easier to find code
   - Easier to fix bugs
   - Easier to add features
   - Easier to test

4. **Think of it like a house:**
   - High Cohesion = Kitchen stuff in kitchen, bedroom stuff in bedroom
   - Low Coupling = Can renovate kitchen without touching bedroom

---

*This architecture makes the codebase maintainable, testable, and scalable!*
