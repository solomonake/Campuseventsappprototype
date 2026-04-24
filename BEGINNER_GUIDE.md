# Beginner's Guide to the Campus Event Calendar System

## Welcome! 👋

This guide will help you understand the codebase, even if you're new to programming. We'll explain concepts as we go!

---

## Table of Contents

1. [Key Concepts](#key-concepts)
2. [Project Structure](#project-structure)
3. [How Data Flows](#how-data-flows)
4. [Reading the Code](#reading-the-code)
5. [Common Patterns](#common-patterns)
6. [Next Steps](#next-steps)

---

## Key Concepts

### What is React?

Think of React like building with LEGO blocks:
- Each piece (component) has a specific shape and purpose
- You combine small pieces to make bigger pieces
- You can reuse the same piece many times
- If one piece breaks, you only fix that piece (not the whole structure)

**Example:**
```
Button component + Input component + Label component
         ↓
      LoginForm component
         ↓
      LoginPage component
```

### What is TypeScript?

TypeScript is JavaScript with a safety net:
- **JavaScript:** "Put whatever you want in this box"
- **TypeScript:** "This box only holds numbers, don't put text in it!"

**Example:**
```typescript
// JavaScript - might cause bugs later
let age = "twenty"; // Oops, this should be a number!

// TypeScript - catches errors immediately
let age: number = "twenty"; // ❌ ERROR: Can't put text in a number variable
let age: number = 20; // ✅ CORRECT
```

### What is a Component?

A component is a reusable piece of UI (user interface).

**Real-world analogy:** Think of a vending machine
- **Input:** Money (props)
- **Process:** Select item (logic)
- **Output:** Snack (rendered UI)

**Code example:**
```typescript
// This component shows a greeting
function Greeting({ name }) {
  return <div>Hello, {name}!</div>;
}

// Use it anywhere:
<Greeting name="Alice" />  // Shows: Hello, Alice!
<Greeting name="Bob" />    // Shows: Hello, Bob!
```

### What is State?

State is a component's memory - values it remembers between updates.

**Real-world analogy:** A light switch
- State: ON or OFF
- When you flip it, it remembers the new state
- It doesn't reset every time you look at it

**Code example:**
```typescript
function Counter() {
  // count is the state, setCount updates it
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Add 1
      </button>
    </div>
  );
}
```

### What are Props?

Props are like function parameters, but for components.

**Real-world analogy:** A recipe
- Props: Ingredients you pass in
- Component: The cooking process
- Return: The finished dish

**Code example:**
```typescript
// Component definition (the recipe)
function WelcomeCard({ title, message }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  );
}

// Using it (passing ingredients)
<WelcomeCard 
  title="Welcome!" 
  message="Thanks for joining us"
/>
```

---

## Project Structure

### File Organization (Like organizing a house)

```
src/app/
├── components/     # Reusable UI pieces (like furniture)
│   ├── LocationPicker.tsx
│   └── NFCCheckIn.tsx
│
├── pages/          # Full screens (like rooms)
│   ├── EventFeed.tsx
│   ├── CreateEvent.tsx
│   └── MapView.tsx
│
├── contexts/       # Global data (like central heating)
│   ├── AuthContext.tsx    # Who's logged in?
│   └── AppContext.tsx     # App-wide settings
│
├── services/       # Business logic (like appliances)
│   ├── EventService.ts    # Event operations
│   └── MapService.ts      # Map calculations
│
├── types/          # Data blueprints (like furniture manuals)
│   └── models.ts
│
└── config/         # Settings (like thermostat)
    └── culturalCredit.ts
```

### Why This Organization?

**Kitchen Analogy:**
- **components/** = Utensils (spoons, knives, pans)
- **pages/** = Complete meals (breakfast, lunch, dinner)
- **contexts/** = Shared resources (water supply, electricity)
- **services/** = Appliances (oven, fridge, dishwasher)
- **types/** = Recipe cards (tells you what ingredients you need)
- **config/** = Kitchen settings (oven temperature, fridge settings)

**Benefits:**
1. ✅ Easy to find things (everything has its place)
2. ✅ Easy to add new features (just add to the right folder)
3. ✅ Easy to fix bugs (you know where to look)

---

## How Data Flows

### The React Data Flow (One-Way Street)

Data in React flows in ONE direction (parent → child):

```
         User Data
            ↓
      AuthContext (stores it)
            ↓
     EventFeed (uses it)
            ↓
    EventCard (displays it)
```

**Important Rules:**
- ✅ Parents can pass data to children (via props)
- ✅ Children can notify parents (via callback functions)
- ❌ Children CANNOT directly change parent data
- ❌ Siblings CANNOT directly talk to each other

### Example Data Flow

**Scenario:** User logs in

```typescript
// 1. User types email and password
LoginPage 
  ↓ calls
AuthContext.login(email, password)
  ↓ validates and stores
User data saved in AuthContext
  ↓ provides to all children
EventFeed can now access user
  ↓ displays
"Welcome, Alice!"
```

**Why one-way?**
- Easier to understand (like following a river downstream)
- Easier to debug (you know where data comes from)
- Prevents "spaghetti code" (data flying everywhere)

---

## Reading the Code

### How to Read a React Component

Let's break down a simple component:

```typescript
// 1. IMPORTS - Bring in tools we need
import { useState } from "react";
import { Button } from "./ui/button";

// 2. TYPE DEFINITIONS - What shape is our data?
interface CounterProps {
  initialCount: number;
  title: string;
}

// 3. COMPONENT FUNCTION - The main logic
export default function Counter({ initialCount, title }: CounterProps) {
  
  // 4. STATE - Component's memory
  const [count, setCount] = useState(initialCount);
  
  // 5. EVENT HANDLERS - Functions that run on user actions
  const handleIncrement = () => {
    setCount(count + 1);
  };
  
  // 6. RENDER - What to show on screen
  return (
    <div>
      <h2>{title}</h2>
      <p>Count: {count}</p>
      <Button onClick={handleIncrement}>
        Add 1
      </Button>
    </div>
  );
}
```

**Reading Order:**
1. Look at the **interface** - what props does it need?
2. Look at **useState** calls - what does it remember?
3. Look at **event handlers** - what can users do?
4. Look at **return statement** - what appears on screen?

### Understanding TypeScript Types

```typescript
// STRING - Text
let name: string = "Alice";

// NUMBER - Any number
let age: number = 25;

// BOOLEAN - True or false
let isStudent: boolean = true;

// ARRAY - List of items
let scores: number[] = [95, 87, 92];

// OBJECT - Group of related data
let person: { name: string; age: number } = {
  name: "Alice",
  age: 25
};

// INTERFACE - Reusable object blueprint
interface Event {
  id: string;
  title: string;
  datetime: string;
  cost: number;
}

// Using the interface
let concert: Event = {
  id: "evt-1",
  title: "Spring Concert",
  datetime: "2026-05-01T19:00:00",
  cost: 15
};
```

---

## Common Patterns

### Pattern 1: Parent-Child Communication

**Child needs to tell parent something happened:**

```typescript
// PARENT COMPONENT
function ParentForm() {
  const [location, setLocation] = useState(null);
  
  return (
    <LocationPicker 
      selectedLocation={location}
      onLocationChange={setLocation}  // ← Pass function to child
    />
  );
}

// CHILD COMPONENT
function LocationPicker({ selectedLocation, onLocationChange }) {
  const handleClick = () => {
    const newLocation = { /* ... */ };
    onLocationChange(newLocation);  // ← Child calls parent's function
  };
  
  return <button onClick={handleClick}>Pick Location</button>;
}
```

**Flow:**
1. Parent gives child a function (onLocationChange)
2. User does something in child (clicks button)
3. Child calls the function parent gave it
4. Parent's state updates
5. Parent re-renders with new data
6. Child receives new data as props

### Pattern 2: Conditional Rendering

**Show different things based on conditions:**

```typescript
function EventCard({ event }) {
  return (
    <div>
      <h3>{event.title}</h3>
      
      {/* Show icon only if event has cultural credit */}
      {event.creditEligible && (
        <Award className="icon" />
      )}
      
      {/* Show different text based on cost */}
      {event.cost === 0 ? (
        <p>Free Event</p>
      ) : (
        <p>Cost: ${event.cost}</p>
      )}
    </div>
  );
}
```

**Symbols:**
- `&&` means "and" - both sides must be true
- `? :` means "if-else" - if true do first thing, else do second thing
- `===` means "exactly equal to"

### Pattern 3: Mapping Over Arrays

**Turn an array of data into an array of components:**

```typescript
function EventList({ events }) {
  return (
    <div>
      {events.map((event) => (
        <EventCard 
          key={event.id}  // ← React needs unique key for each item
          event={event} 
        />
      ))}
    </div>
  );
}
```

**What's happening:**
1. We have an array: `[event1, event2, event3]`
2. map() runs a function for each item
3. Function returns a component for that item
4. Result: `[<EventCard event1 />, <EventCard event2 />, <EventCard event3 />]`
5. React renders all the components

**Why key?**
- React uses keys to track which items changed
- Without keys, React has to re-render everything
- With keys, React only re-renders what changed (faster!)

### Pattern 4: useEffect Hook

**Do something when component loads or data changes:**

```typescript
function EventFeed() {
  const [events, setEvents] = useState([]);
  
  // Run when component first appears on screen
  useEffect(() => {
    // Fetch events from server
    fetchEvents().then(data => setEvents(data));
  }, []); // ← Empty array means "run once on mount"
  
  return <div>{/* ... */}</div>;
}
```

**useEffect dependency array:**
- `[]` - Run once when component mounts
- `[count]` - Run when count changes
- No array - Run after every render (usually too much!)

---

## Common Terminology

### Front-End Terms

| Term | Meaning | Example |
|------|---------|---------|
| **Component** | Reusable UI piece | `<Button>`, `<EventCard>` |
| **Props** | Data passed to component | `<Button text="Click me">` |
| **State** | Component's memory | `const [count, setCount] = useState(0)` |
| **Hook** | Special React function | `useState`, `useEffect`, `useContext` |
| **JSX** | HTML-like syntax in JavaScript | `<div>Hello</div>` |
| **Event Handler** | Function that runs on user action | `onClick`, `onChange` |

### Back-End Terms

| Term | Meaning | Example |
|------|---------|---------|
| **Service** | Business logic layer | `EventService`, `MapService` |
| **Model** | Data structure definition | `Event`, `User`, `Location` |
| **Context** | Global state provider | `AuthContext`, `AppContext` |
| **Interface** | TypeScript type definition | `interface Event { ... }` |
| **API** | Way for code to talk to server | `fetch('/api/events')` |

---

## Next Steps

### Learning Path for Beginners

**Week 1: Understand Components**
1. Read `LocationPicker.tsx` with comments
2. Try changing the text in the component
3. Add a new button that does something

**Week 2: Understand State**
1. Look at `useState` examples in `CreateEvent.tsx`
2. Try adding a new state variable
3. Make a button that updates that state

**Week 3: Understand Props**
1. See how `EventFeed` passes data to `EventCard`
2. Add a new prop to `EventCard`
3. Use that prop to show something new

**Week 4: Understand Data Flow**
1. Trace how login data flows through the app
2. See `AuthContext` → `EventFeed` → display
3. Try adding a new piece of user data

### Good Beginner Resources

**React Official Tutorial:**
https://react.dev/learn

**TypeScript for Beginners:**
https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html

**JavaScript Basics:**
https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps

---

## Tips for Reading This Codebase

### 1. Start Small

Don't try to understand everything at once!

**Start with:**
- One simple component (like `Button.tsx`)
- Understand what it does
- See where it's used
- Then move to the parent component

### 2. Follow the Comments

We've added beginner-friendly comments explaining:
- **WHAT** the code does
- **WHY** we wrote it this way
- **HOW** it fits into the bigger picture

Look for comment blocks marked with:
```typescript
// ============================================================================
// SECTION NAME
// ============================================================================
```

### 3. Use the Browser Inspector

**Chrome/Firefox DevTools:**
1. Right-click on page → "Inspect"
2. Go to "React DevTools" tab
3. See component tree
4. Click component to see its props and state

### 4. Break Things (In Your Local Copy!)

**Best way to learn:**
1. Change something small
2. See what breaks
3. Fix it
4. Understand why it broke

**Safe experiments:**
- Change text in JSX
- Add console.log() statements
- Comment out a line and see what happens
- Change a CSS class

### 5. Ask Questions

**When stuck, ask:**
- "What does this function return?"
- "Why do we use this pattern here?"
- "What would happen if I changed this?"
- "Where does this data come from?"

Then trace through the code to find answers!

---

## Glossary of Code Symbols

```typescript
// ARROWS
=> // Arrow function: (x) => x + 1
-> // Not used in JavaScript
↓  // Comment showing data flow

// LOGIC
&& // AND: both must be true
|| // OR: at least one must be true
!  // NOT: opposite of true/false
=== // Exactly equal
!== // Not equal
?  : // If-then-else: condition ? ifTrue : ifFalse

// DESTRUCTURING
const { name, age } = person  // Pull values out of object
const [first, second] = array // Pull values out of array

// SPREAD
...array  // Copy all items from array
...object // Copy all properties from object

// OPTIONAL
name?.length  // Only access if name exists (won't crash if null)
user ?? "Guest" // Use user if it exists, else use "Guest"

// TYPE ANNOTATIONS
name: string    // This is a string
age: number     // This is a number
isActive: boolean // This is true/false
items: string[] // Array of strings
```

---

## Remember!

**Programming is problem-solving:**
1. Understand the problem
2. Break it into small pieces
3. Solve each piece
4. Put pieces together

**Good code is:**
- ✅ Easy to read (like a good book)
- ✅ Easy to change (like LEGO blocks)
- ✅ Easy to test (can verify it works)
- ✅ Well organized (everything has its place)

**You've got this! 🚀**

Every expert was once a beginner. Keep learning, keep coding, keep asking questions!

---

*Happy coding! If you have questions, check the inline comments in the code files - they're written to help beginners understand!*
