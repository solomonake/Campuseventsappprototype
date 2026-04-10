import { AttendanceCheckIn, CheckInMethod, CheckInStatus } from "../types/models";

export class CheckInService {
  private checkIns: AttendanceCheckIn[];

  constructor() {
    this.checkIns = [];
  }

  // Primary check-in method
  checkIn(eventId: string, userId: string): AttendanceCheckIn {
    const checkIn: AttendanceCheckIn = {
      id: `checkin-${Date.now()}`,
      eventId,
      userId,
      timestamp: new Date().toISOString(),
      status: "checked-in",
      method: "primary",
    };

    this.checkIns.push(checkIn);
    return checkIn;
  }

  // Fallback check-in with event code
  fallbackCheckIn(
    eventId: string,
    userId: string,
    eventCode: string
  ): AttendanceCheckIn | null {
    // Validate event code (simple validation for prototype)
    const expectedCode = `EVENT-${eventId.slice(-4).toUpperCase()}`;
    
    if (eventCode.toUpperCase() !== expectedCode) {
      return null;
    }

    const checkIn: AttendanceCheckIn = {
      id: `checkin-${Date.now()}`,
      eventId,
      userId,
      timestamp: new Date().toISOString(),
      status: "checked-in",
      method: "fallback-code",
    };

    this.checkIns.push(checkIn);
    return checkIn;
  }

  // Get check-in for user and event
  getCheckIn(eventId: string, userId: string): AttendanceCheckIn | undefined {
    return this.checkIns.find(
      (c) => c.eventId === eventId && c.userId === userId
    );
  }

  // Get all check-ins for an event
  getEventCheckIns(eventId: string): AttendanceCheckIn[] {
    return this.checkIns.filter((c) => c.eventId === eventId);
  }

  // Get all check-ins for a user
  getUserCheckIns(userId: string): AttendanceCheckIn[] {
    return this.checkIns.filter((c) => c.userId === userId);
  }

  // Record timestamp
  recordTimestamp(checkInId: string): boolean {
    const checkIn = this.checkIns.find((c) => c.id === checkInId);
    if (!checkIn) return false;

    checkIn.timestamp = new Date().toISOString();
    return true;
  }
}
