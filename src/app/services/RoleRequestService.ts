import { RoleChangeRequest, UserRole, RoleRequestStatus } from "../types/models";

export class RoleRequestService {
  private requests: RoleChangeRequest[] = [];

  constructor() {
    // Initialize with demo data
    this.requests = [];
  }

  // Submit a role change request
  submitRequest(
    userId: string,
    userName: string,
    userEmail: string,
    currentRole: UserRole,
    requestedRole: UserRole,
    reason: string
  ): RoleChangeRequest {
    // Check if user already has a pending request
    const existingPending = this.requests.find(
      (req) => req.userId === userId && req.status === "pending"
    );

    if (existingPending) {
      throw new Error("You already have a pending role change request");
    }

    const request: RoleChangeRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      userId,
      userName,
      userEmail,
      currentRole,
      requestedRole,
      reason,
      status: "pending",
      requestedAt: new Date().toISOString(),
    };

    this.requests.push(request);
    return request;
  }

  // Get all requests (for admin)
  getAllRequests(): RoleChangeRequest[] {
    return this.requests.sort((a, b) => {
      // Pending first, then by date
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
    });
  }

  // Get pending requests (for admin)
  getPendingRequests(): RoleChangeRequest[] {
    return this.requests.filter((req) => req.status === "pending");
  }

  // Get user's requests
  getUserRequests(userId: string): RoleChangeRequest[] {
    return this.requests
      .filter((req) => req.userId === userId)
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  }

  // Get user's pending request
  getUserPendingRequest(userId: string): RoleChangeRequest | null {
    return this.requests.find((req) => req.userId === userId && req.status === "pending") || null;
  }

  // Approve a request
  approveRequest(
    requestId: string,
    reviewerId: string,
    reviewerNotes?: string
  ): RoleChangeRequest | null {
    const request = this.requests.find((req) => req.id === requestId);
    if (!request || request.status !== "pending") {
      return null;
    }

    request.status = "approved";
    request.reviewedAt = new Date().toISOString();
    request.reviewedBy = reviewerId;
    request.reviewerNotes = reviewerNotes;

    return request;
  }

  // Reject a request
  rejectRequest(
    requestId: string,
    reviewerId: string,
    reviewerNotes?: string
  ): RoleChangeRequest | null {
    const request = this.requests.find((req) => req.id === requestId);
    if (!request || request.status !== "pending") {
      return null;
    }

    request.status = "rejected";
    request.reviewedAt = new Date().toISOString();
    request.reviewedBy = reviewerId;
    request.reviewerNotes = reviewerNotes;

    return request;
  }

  // Get request by ID
  getRequestById(requestId: string): RoleChangeRequest | null {
    return this.requests.find((req) => req.id === requestId) || null;
  }

  // Cancel a pending request (by user)
  cancelRequest(requestId: string, userId: string): boolean {
    const request = this.requests.find((req) => req.id === requestId);
    if (!request || request.userId !== userId || request.status !== "pending") {
      return false;
    }

    // Remove the request
    this.requests = this.requests.filter((req) => req.id !== requestId);
    return true;
  }
}