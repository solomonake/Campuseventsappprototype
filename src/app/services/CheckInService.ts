/**
 * Check-In Service - SECURITY CRITICAL
 *
 * RISK MITIGATION (R4 - Injection Vulnerability):
 * ==============================================
 * CRITICAL: When implementing database backend, USE PARAMETERIZED QUERIES ONLY
 *
 * Security Requirements:
 * 1. Input Validation: Sanitize all user inputs (eventId, userId, eventCode)
 * 2. Parameterized Queries: NEVER concatenate user input into SQL
 * 3. Output Encoding: Encode all user data before display
 * 4. Rate Limiting: Prevent brute-force code guessing
 *
 * Example BAD (Vulnerable to SQL Injection):
 *   query = `SELECT * FROM checkins WHERE userId = '${userId}'`
 *
 * Example GOOD (Safe with parameterized query):
 *   query = `SELECT * FROM checkins WHERE userId = ?`
 *   params = [userId]
 *
 * @module services/CheckInService
 */

import { AttendanceCheckIn, CheckInMethod, CheckInStatus } from "../types/models";

export class CheckInService {
  private checkIns: AttendanceCheckIn[];

  constructor() {
    this.checkIns = [];
  }

  /**
   * Primary Check-In Method
   *
   * SECURITY NOTE (R4): In production, validate userId and eventId
   * against allowlist patterns before processing.
   */
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

  /**
   * Fallback Check-In with Event Code
   *
   * SECURITY CRITICAL (R4 - Injection Vulnerability):
   * ------------------------------------------------
   * This method accepts USER INPUT (eventCode) which is UNTRUSTED.
   *
   * Current Prototype Protection:
   * - Simple format validation only
   *
   * Required Production Security:
   * 1. Input Sanitization: Strip special characters, limit length
   * 2. Rate Limiting: Max 5 attempts per user per event
   * 3. Audit Logging: Log all failed attempts
   * 4. CAPTCHA: After 3 failed attempts
   * 5. Constant-time comparison: Prevent timing attacks
   *
   * TODO: Implement input sanitization before production deployment
   */
  fallbackCheckIn(
    eventId: string,
    userId: string,
    eventCode: string  // ⚠️ USER INPUT - MUST SANITIZE
  ): AttendanceCheckIn | null {
    // TODO (R4): Add input sanitization here
    // Example: eventCode = sanitizeInput(eventCode);

    // Validate event code (simple validation for prototype)
    const expectedCode = `EVENT-${eventId.slice(-4).toUpperCase()}`;

    // TODO (R4): Use constant-time comparison to prevent timing attacks
    if (eventCode.toUpperCase() !== expectedCode) {
      // TODO: Log failed attempt for security monitoring
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
