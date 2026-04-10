import { Event, FilterCriteria } from "../types/models";

// Strategy pattern for filters
export interface FilterStrategy {
  apply(events: Event[]): Event[];
}

// Tag filter strategy
export class TagFilterStrategy implements FilterStrategy {
  constructor(private selectedTags: string[]) {}

  apply(events: Event[]): Event[] {
    if (this.selectedTags.length === 0) return events;
    
    return events.filter((event) =>
      this.selectedTags.some((tagName) =>
        event.tags.some((tag) => tag.name === tagName)
      )
    );
  }
}

// Cost filter strategy
export class CostFilterStrategy implements FilterStrategy {
  constructor(private costFilter: "free" | "any") {}

  apply(events: Event[]): Event[] {
    if (this.costFilter === "any") return events;
    return events.filter((event) => event.cost === 0);
  }
}

// Cultural credit filter strategy
export class CreditEligibilityStrategy implements FilterStrategy {
  constructor(private creditFilter: "eligible" | "any") {}

  apply(events: Event[]): Event[] {
    if (this.creditFilter === "any") return events;
    return events.filter((event) => event.creditEligible);
  }
}

// Location filter strategy
export class LocationFilterStrategy implements FilterStrategy {
  constructor(private selectedLocations: string[]) {}

  apply(events: Event[]): Event[] {
    if (this.selectedLocations.length === 0) return events;
    
    return events.filter((event) =>
      this.selectedLocations.includes(event.location.name)
    );
  }
}

// Time window filter strategy
export class TimeWindowStrategy implements FilterStrategy {
  constructor(private startDate?: string, private endDate?: string) {}

  apply(events: Event[]): Event[] {
    return events.filter((event) => {
      const eventDate = new Date(event.datetime);
      
      if (this.startDate && eventDate < new Date(this.startDate)) {
        return false;
      }
      
      if (this.endDate && eventDate > new Date(this.endDate)) {
        return false;
      }
      
      return true;
    });
  }
}

// Event service with filter pipeline
export class EventService {
  private events: Event[];

  constructor(events: Event[]) {
    this.events = events;
  }

  // Apply filters using strategy pattern
  applyFilters(criteria: FilterCriteria): Event[] {
    const strategies: FilterStrategy[] = [
      new TagFilterStrategy(criteria.tags),
      new CostFilterStrategy(criteria.costFilter),
      new CreditEligibilityStrategy(criteria.creditFilter),
      new LocationFilterStrategy(criteria.locations),
      new TimeWindowStrategy(criteria.startDate, criteria.endDate),
    ];

    let filtered = this.events;
    
    // Apply each strategy in pipeline
    for (const strategy of strategies) {
      filtered = strategy.apply(filtered);
    }

    return filtered;
  }

  // Get approved events only (for public feed)
  getApprovedEvents(): Event[] {
    return this.events.filter((event) => event.status === "approved");
  }

  // Get events by status (for admin/staff views)
  getEventsByStatus(status: string): Event[] {
    return this.events.filter((event) => event.status === status);
  }

  // Sort events chronologically
  sortChronologically(events: Event[]): Event[] {
    return [...events].sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );
  }

  // Get event by ID
  getEventById(id: string): Event | undefined {
    return this.events.find((event) => event.id === id);
  }

  // Create new event
  createEvent(event: Event): void {
    this.events.push(event);
  }

  // Update event
  updateEvent(id: string, updates: Partial<Event>): boolean {
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) return false;
    
    this.events[index] = { ...this.events[index], ...updates };
    return true;
  }

  // Delete event
  deleteEvent(id: string): boolean {
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) return false;
    
    this.events.splice(index, 1);
    return true;
  }
}
