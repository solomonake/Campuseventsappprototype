// User types and roles
export type UserRole = "student" | "staff" | "administrator";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Role change request system
export type RoleRequestStatus = "pending" | "approved" | "rejected";

export interface RoleChangeRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  currentRole: UserRole;
  requestedRole: UserRole;
  reason: string;
  status: RoleRequestStatus;
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewerNotes?: string;
}

// Event status lifecycle
export type EventStatus = "draft" | "pending" | "approved" | "rejected" | "archived" | "canceled";

// Location information
export interface Location {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  accessibilityInfo?: string;
}

// Tag system
export interface Tag {
  id: string;
  name: string;
}

// Event model
export interface Event {
  id: string;
  title: string;
  description: string;
  datetime: string;
  location: Location;
  cost: number; // 0 for free
  creditEligible: boolean;
  status: EventStatus;
  hostUserId: string;
  hostName: string;
  tags: Tag[];
  capacity?: number;
  sequence?: number;
  createdAt: string;
  updatedAt: string;
}

// Attendance check-in
export type CheckInStatus = "checked-in" | "pending" | "failed";
export type CheckInMethod = "primary" | "fallback-code";

export interface AttendanceCheckIn {
  id: string;
  eventId: string;
  userId: string;
  timestamp: string;
  status: CheckInStatus;
  method: CheckInMethod;
}

// Filter preferences
export interface FilterCriteria {
  tags: string[];
  startDate?: string;
  endDate?: string;
  locations: string[];
  costFilter: "free" | "any";
  creditFilter: "eligible" | "any";
}

export interface UserPreferences {
  id: string;
  userId: string;
  savedFilters: FilterCriteria;
  reminderEnabled: boolean;
  reminderTiming: number; // minutes before event
}