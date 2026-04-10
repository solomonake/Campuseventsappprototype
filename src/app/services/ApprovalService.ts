import { Event } from "../types/models";

export class ApprovalService {
  private events: Event[];

  constructor(events: Event[]) {
    this.events = events;
  }

  // Approve event
  approveEvent(eventId: string): boolean {
    const event = this.events.find((e) => e.id === eventId);
    if (!event || event.status !== "pending") return false;

    event.status = "approved";
    event.updatedAt = new Date().toISOString();
    return true;
  }

  // Reject event
  rejectEvent(eventId: string): boolean {
    const event = this.events.find((e) => e.id === eventId);
    if (!event || event.status !== "pending") return false;

    event.status = "rejected";
    event.updatedAt = new Date().toISOString();
    return true;
  }

  // Get pending events
  getPendingEvents(): Event[] {
    return this.events.filter((e) => e.status === "pending");
  }
}
