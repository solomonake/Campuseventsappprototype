# High Cohesion & Low Coupling Examples

## For Beginners: What Are These Concepts?

### High Cohesion = "Everything in its place"
Like organizing a toolbox - hammers with hammers, screwdrivers with screwdrivers.

### Low Coupling = "Independent pieces"
Like LEGO blocks - they connect through standard pegs, not glued together.

---

## Example 1: Service Layer (High Cohesion)

### ❌ BAD: Low Cohesion (Everything mixed together)

```typescript
// One giant file doing EVERYTHING - hard to maintain!
class AppService {
  // Event stuff
  createEvent(event) { /* ... */ }
  deleteEvent(id) { /* ... */ }
  
  // User stuff
  loginUser(email, password) { /* ... */ }
  logoutUser() { /* ... */ }
  
  // Map stuff
  calculateDistance(a, b) { /* ... */ }
  getDirections(start, end) { /* ... */ }
  
  // Payment stuff
  processPayment(amount) { /* ... */ }
  refundPayment(id) { /* ... */ }
}
```

**Problems:**
- 😵 Too many responsibilities (events, users, maps, payments)
- 🐛 Hard to find bugs (which section is broken?)
- 📝 Hard to understand (what does this file do?)
- 🔧 Hard to change (might break unrelated things)

### ✅ GOOD: High Cohesion (Each file has ONE job)

```typescript
// ===== EventService.ts =====
// ONLY handles event operations
class EventService {
  createEvent(event) { /* ... */ }
  deleteEvent(id) { /* ... */ }
  updateEvent(id, changes) { /* ... */ }
  getEvents() { /* ... */ }
}

// ===== AuthService.ts =====
// ONLY handles user authentication
class AuthService {
  loginUser(email, password) { /* ... */ }
  logoutUser() { /* ... */ }
  validateSession() { /* ... */ }
}

// ===== MapService.ts =====
// ONLY handles map operations
class MapService {
  calculateDistance(a, b) { /* ... */ }
  getDirections(start, end) { /* ... */ }
  eventsToMapPins(events) { /* ... */ }
}

// ===== PaymentService.ts =====
// ONLY handles payments
class PaymentService {
  processPayment(amount) { /* ... */ }
  refundPayment(id) { /* ... */ }
  validateCard(cardNumber) { /* ... */ }
}
```

**Benefits:**
- ✅ Clear purpose (file name tells you what's inside)
- ✅ Easy to find (need map code? Check MapService)
- ✅ Easy to test (test events without worrying about payments)
- ✅ Easy to change (update maps without touching user logic)

---

## Example 2: Component Coupling

### ❌ BAD: High Coupling (Components know too much about each other)

```typescript
// ===== EventFeed.tsx (BAD) =====
import EventService from '../services/EventService';  // ← Direct import

function EventFeed() {
  // Directly creates its own service instance
  const eventService = new EventService();  // ← Tightly coupled
  
  // Directly imports and uses mockData
  const locations = mockLocations;  // ← Knows about mock data
  
  return <div>...</div>;
}
```

**Problems:**
- 🔗 Component is "glued" to EventService
- 🏭 Creates its own service (what if other components need same instance?)
- 🧪 Hard to test (can't easily swap out real service for test version)
- 🔧 Hard to change (changing service requires changing component)

### ✅ GOOD: Low Coupling (Components are independent)

```typescript
// ===== AppContext.tsx =====
// Context creates and provides services (single source)
export function AppProvider({ children }) {
  const eventService = useMemo(() => new EventService(events), [events]);
  
  return (
    <AppContext.Provider value={{ eventService, events }}>
      {children}
    </AppContext.Provider>
  );
}

// ===== EventFeed.tsx (GOOD) =====
function EventFeed() {
  // Gets service from context (not creating its own)
  const { eventService } = useApp();  // ← Loose coupling through context
  
  // Uses the service (doesn't know HOW it works)
  const events = eventService.getApprovedEvents();
  
  return <div>...</div>;
}
```

**Benefits:**
- ✅ Component doesn't create service (context provides it)
- ✅ Same service instance used everywhere (consistent state)
- ✅ Easy to swap service (just change context, not every component)
- ✅ Easy to test (can provide mock service through context)

---

## Example 3: Data Flow (Low Coupling)

### ❌ BAD: Components reaching into each other

```typescript
// ===== CreateEvent.tsx (BAD) =====
import EventFeed from './EventFeed';  // ← Importing sibling component

function CreateEvent() {
  const handleSubmit = (event) => {
    // Directly calling another component's function!
    EventFeed.refreshEvents();  // ← Bad! Components shouldn't do this
  };
}
```

**Problem:**
- 🕸️ Components are tangled together
- 🔧 Can't change EventFeed without breaking CreateEvent
- 🧪 Can't test CreateEvent alone (needs EventFeed)

### ✅ GOOD: Parent coordinates communication

```typescript
// ===== AppContext.tsx (Coordinator) =====
export function AppProvider({ children }) {
  const [events, setEvents] = useState(mockEvents);
  
  const refreshEvents = () => {
    setEvents([...events]);  // ← Parent manages state
  };
  
  return (
    <AppContext.Provider value={{ events, refreshEvents }}>
      {children}
    </AppContext.Provider>
  );
}

// ===== CreateEvent.tsx (GOOD) =====
function CreateEvent() {
  const { refreshEvents } = useApp();  // ← Get function from parent
  
  const handleSubmit = (event) => {
    // Call parent's function, not sibling component
    refreshEvents();  // ← Good! Parent coordinates
  };
}

// ===== EventFeed.tsx (GOOD) =====
function EventFeed() {
  const { events } = useApp();  // ← Get data from parent
  
  // Automatically updates when parent calls refreshEvents()
  return <div>{events.map(...)}</div>;
}
```

**Flow:**
```
CreateEvent → refreshEvents() → AppContext (updates events) → EventFeed (re-renders)
```

**Benefits:**
- ✅ Components don't know about each other
- ✅ Parent (context) coordinates everything
- ✅ Each component is independent
- ✅ Easy to test each component alone

---

## Example 4: Interface-Based Design (Low Coupling)

### ❌ BAD: Direct dependency on complex object

```typescript
// ===== MapView.tsx (BAD) =====
function MapView({ events }: { events: Event[] }) {
  return (
    <Map>
      {events.map(event => (
        <Pin 
          lat={event.location.coordinates.lat}  // ← Knows Event structure
          lng={event.location.coordinates.lng}
          title={event.title}
          host={event.hostName}
          cost={event.cost}
          // ... many Event properties
        />
      ))}
    </Map>
  );
}
```

**Problems:**
- 🔗 MapView knows too much about Event structure
- 🔧 If Event changes, MapView breaks
- 🧠 MapView has to remember which Event fields to use
- 📦 Passing whole Event when only need a few fields

### ✅ GOOD: Simple interface (contract)

```typescript
// ===== MapService.ts (Interface) =====
// Simple interface - only what map needs
interface MapPin {
  id: string;
  coordinates: { lat: number; lng: number };
  title: string;
}

class MapService {
  // Converts complex Event to simple MapPin
  eventsToMapPins(events: Event[]): MapPin[] {
    return events.map(event => ({
      id: event.id,
      coordinates: event.location.coordinates,
      title: event.title,
    }));
  }
}

// ===== MapView.tsx (GOOD) =====
function MapView() {
  const { eventService } = useApp();
  const mapService = new MapService();
  
  // Get events, convert to simple pins
  const events = eventService.getApprovedEvents();
  const pins = mapService.eventsToMapPins(events);
  
  return (
    <Map>
      {pins.map(pin => (  // ← Only knows about MapPin (simple!)
        <Pin 
          lat={pin.coordinates.lat}
          lng={pin.coordinates.lng}
          title={pin.title}
        />
      ))}
    </Map>
  );
}
```

**Benefits:**
- ✅ MapView only knows about MapPin (not Event)
- ✅ Event structure can change without breaking MapView
- ✅ MapService handles conversion (separation of concerns)
- ✅ Clear contract (MapPin interface)

---

## Example 5: Configuration-Driven (Low Coupling)

### ❌ BAD: Hardcoded rules everywhere

```typescript
// ===== CheckInService.ts (BAD) =====
class CheckInService {
  awardCredit(event, attendance) {
    // Rules hardcoded in multiple places!
    if (attendance.duration >= 30 &&  // ← Magic number
        event.tags.includes('Arts') &&  // ← Hardcoded tag
        event.cost === 0) {  // ← Hardcoded rule
      return true;
    }
  }
}

// ===== EventFilter.ts (BAD) =====
class EventFilter {
  getCreditEvents(events) {
    // Same rules, written again!
    return events.filter(e => 
      e.tags.includes('Arts') &&  // ← Duplicated logic
      e.cost === 0
    );
  }
}
```

**Problems:**
- 🔁 Same logic in multiple files (duplicate code)
- 🔧 Change rule? Must update everywhere
- 🐛 Easy to forget one place → bugs
- ❌ Can't change rules without editing code

### ✅ GOOD: Centralized configuration

```typescript
// ===== config/culturalCredit.ts (GOOD) =====
// Single source of truth for credit rules
export const CulturalCreditConfig = {
  minimumDuration: 30,
  eligibleTags: ['Arts', 'Academic', 'Workshop'],
  allowPaidEvents: false,
};

// Helper function using config
export function isCreditEligible(event, attendance) {
  // Reads from config (one place!)
  return (
    attendance.duration >= CulturalCreditConfig.minimumDuration &&
    event.tags.some(tag => 
      CulturalCreditConfig.eligibleTags.includes(tag.name)
    ) &&
    (CulturalCreditConfig.allowPaidEvents || event.cost === 0)
  );
}

// ===== CheckInService.ts (GOOD) =====
import { isCreditEligible } from '../config/culturalCredit';

class CheckInService {
  awardCredit(event, attendance) {
    // Uses shared function (no duplicated logic)
    return isCreditEligible(event, attendance);
  }
}

// ===== EventFilter.ts (GOOD) =====
import { isCreditEligible } from '../config/culturalCredit';

class EventFilter {
  getCreditEvents(events) {
    // Uses same shared function
    return events.filter(e => isCreditEligible(e, { duration: 999 }));
  }
}
```

**Benefits:**
- ✅ Rules in ONE place (config file)
- ✅ Change rule? Edit config only
- ✅ No duplicate logic
- ✅ Can even load rules from database (no code changes!)

---

## Summary: Principles in Our Codebase

### High Cohesion Examples

| File | Responsibility | Cohesion Level |
|------|---------------|----------------|
| `EventService.ts` | Event operations only | ✅ HIGH |
| `MapService.ts` | Map operations only | ✅ HIGH |
| `AuthContext.tsx` | Authentication only | ✅ HIGH |
| `LocationPicker.tsx` | Location picking only | ✅ HIGH |

### Low Coupling Examples

| Pattern | How It Works | Coupling Level |
|---------|-------------|----------------|
| Components → Context | Components get data from context, not direct imports | ✅ LOW |
| Service → Interface | MapService provides MapPin, not full Event | ✅ LOW |
| Logic → Config | Business logic reads rules from config | ✅ LOW |
| Parent → Children | Parent passes props, children notify via callbacks | ✅ LOW |

---

## Quick Reference: Is My Code Well-Designed?

### ✅ Good Signs (High Cohesion, Low Coupling)

- [ ] Each file has ONE clear purpose
- [ ] File name describes what's inside
- [ ] Components receive data through props/context
- [ ] Services don't import components
- [ ] Rules are in config files, not spread through code
- [ ] Can change one file without breaking others
- [ ] Can test each piece independently

### ❌ Warning Signs (Low Cohesion, High Coupling)

- [ ] File does many unrelated things
- [ ] Hard to name the file (because it does too much)
- [ ] Components create their own service instances
- [ ] Same logic duplicated in multiple files
- [ ] Magic numbers/strings everywhere
- [ ] Changing one file breaks many others
- [ ] Can't test pieces separately

---

## Practice Exercise

**Try This:**

1. **Find a component** in our codebase
2. **Ask:** What is its ONE job?
3. **Check:** Does it do anything else? (If yes, low cohesion)
4. **Look at imports:** What does it depend on?
5. **Count:** How many other files would break if this file changed?
6. **Goal:** High cohesion (one job) + Low coupling (few dependencies)

**Example:**
```
Component: LocationPicker
Job: Let user pick a location
Does it do anything else? No ✅
Dependencies: Only UI components and Location type ✅
What would break if we changed it? Only CreateEvent (which uses it) ✅
Verdict: GOOD DESIGN! High cohesion, low coupling
```

---

## Remember!

**High Cohesion:**
- "Does this file have ONE clear job?"
- "Would a new developer understand what this does?"

**Low Coupling:**
- "Can I change this without breaking other things?"
- "Are pieces connected through simple interfaces?"

**Good architecture = Easy to understand, easy to change, easy to test!**
