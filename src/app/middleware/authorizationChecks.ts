/**
 * Authorization Middleware
 *
 * RISK MITIGATION (R15 - Privilege Escalation):
 * ============================================
 * CRITICAL: All privileged endpoints MUST have server-side role checks.
 *
 * Privilege Escalation Attack Vectors:
 * 1. Client-side role bypass (user modifies localStorage)
 * 2. API endpoint without auth check
 * 3. Parameter tampering (userId manipulation)
 * 4. Session hijacking/fixation
 * 5. JWT token forgery
 *
 * Defense Strategy:
 * - NEVER trust client-side role data
 * - ALWAYS verify permissions on server
 * - Implement least-privilege principle
 * - Log all privilege escalation attempts
 * - Use deny-by-default policy
 *
 * @module middleware/authorizationChecks
 */

import { UserRole } from "../types/models";

/**
 * Privileged Actions Registry
 *
 * Maps each privileged action to required role(s).
 * This is configuration data (R7) to prevent hardcoded role checks.
 */
export const PrivilegedActions = {
  // Event Management
  CREATE_EVENT: ["staff", "administrator"],
  APPROVE_EVENT: ["administrator"],
  REJECT_EVENT: ["administrator"],
  DELETE_EVENT: ["administrator"],
  EDIT_ANY_EVENT: ["administrator"],

  // User Management
  VIEW_ALL_USERS: ["administrator"],
  MODIFY_USER_ROLE: ["administrator"],
  DELETE_USER: ["administrator"],

  // Role Requests
  APPROVE_ROLE_REQUEST: ["administrator"],
  REJECT_ROLE_REQUEST: ["administrator"],

  // Reports & Analytics
  VIEW_ANALYTICS: ["staff", "administrator"],
  EXPORT_DATA: ["administrator"],

  // System Configuration
  MODIFY_SETTINGS: ["administrator"],
  VIEW_AUDIT_LOGS: ["administrator"],
} as const;

/**
 * Server-Side Authorization Check
 *
 * CRITICAL SECURITY FUNCTION (R15)
 *
 * This function MUST be called on the server for every privileged operation.
 * Client-side checks are for UX only - they are NOT security controls.
 *
 * Security Requirements:
 * 1. Verify user session is valid and not expired
 * 2. Check user role against required roles for action
 * 3. Log authorization failures for security monitoring
 * 4. Use deny-by-default: if in doubt, deny access
 *
 * @param userId - User attempting the action
 * @param userRole - User's role (from SERVER session, NOT client)
 * @param action - Action being attempted
 * @returns boolean - True if authorized, false otherwise
 */
export function isAuthorized(
  userId: string,
  userRole: UserRole,
  action: keyof typeof PrivilegedActions
): boolean {
  // TODO (R15): Verify session is valid and not expired
  // TODO (R15): Verify userRole comes from SERVER session, not client

  const requiredRoles = PrivilegedActions[action];

  if (!requiredRoles) {
    // Deny-by-default: unknown actions are forbidden
    console.warn(`[SECURITY] Unknown action attempted: ${action} by user ${userId}`);
    return false;
  }

  const authorized = requiredRoles.includes(userRole);

  if (!authorized) {
    // TODO (R15): Log authorization failure for security audit
    console.warn(
      `[SECURITY] Authorization failed: User ${userId} (role: ${userRole}) attempted ${action}`
    );
  }

  return authorized;
}

/**
 * Require Administrator Role
 *
 * Helper function to enforce administrator-only access.
 *
 * SECURITY: This check MUST be performed on the server.
 * Client-side role data can be manipulated.
 *
 * @param userRole - User's role (from server session)
 * @returns boolean - True if user is administrator
 */
export function requireAdmin(userRole: UserRole): boolean {
  return userRole === "administrator";
}

/**
 * Require Staff or Administrator Role
 *
 * Helper function to enforce staff-level access.
 *
 * @param userRole - User's role (from server session)
 * @returns boolean - True if user is staff or admin
 */
export function requireStaff(userRole: UserRole): boolean {
  return userRole === "staff" || userRole === "administrator";
}

/**
 * Check Resource Ownership
 *
 * Verifies that a user owns a specific resource (event, check-in, etc.)
 *
 * Used for operations where users can only modify their own resources.
 *
 * SECURITY: Resource ownership MUST be verified server-side.
 *
 * @param userId - User attempting the action
 * @param resourceOwnerId - Owner of the resource
 * @param userRole - User's role (admins can access any resource)
 * @returns boolean - True if user owns resource or is admin
 */
export function canModifyResource(
  userId: string,
  resourceOwnerId: string,
  userRole: UserRole
): boolean {
  // Administrators can modify any resource
  if (userRole === "administrator") {
    return true;
  }

  // Users can only modify their own resources
  return userId === resourceOwnerId;
}

/**
 * Validate API Request Parameters
 *
 * SECURITY (R4 & R15): Validates request parameters to prevent
 * injection attacks and parameter tampering.
 *
 * Checks:
 * - Parameter types match expected
 * - String lengths within bounds
 * - IDs match expected format
 * - No special characters in unsafe contexts
 *
 * @param params - Request parameters to validate
 * @param schema - Expected parameter schema
 * @returns boolean - True if parameters are valid
 */
export function validateRequestParams(
  params: Record<string, any>,
  schema: Record<string, { type: string; maxLength?: number; pattern?: RegExp }>
): boolean {
  for (const [key, rules] of Object.entries(schema)) {
    const value = params[key];

    // Check type
    if (typeof value !== rules.type) {
      console.warn(`[SECURITY] Invalid parameter type: ${key}`);
      return false;
    }

    // Check length for strings
    if (rules.type === "string" && rules.maxLength && value.length > rules.maxLength) {
      console.warn(`[SECURITY] Parameter too long: ${key}`);
      return false;
    }

    // Check pattern if specified
    if (rules.pattern && !rules.pattern.test(value)) {
      console.warn(`[SECURITY] Parameter pattern mismatch: ${key}`);
      return false;
    }
  }

  return true;
}

/**
 * Example Usage for Production Backend
 *
 * ```typescript
 * // In API endpoint handler
 * app.post('/api/events/:id/approve', async (req, res) => {
 *   // 1. Get user from SERVER session (not client data!)
 *   const user = req.session.user;
 *
 *   // 2. Check authorization SERVER-SIDE
 *   if (!isAuthorized(user.id, user.role, 'APPROVE_EVENT')) {
 *     return res.status(403).json({ error: 'Forbidden' });
 *   }
 *
 *   // 3. Validate parameters (R4)
 *   if (!validateRequestParams(req.params, {
 *     id: { type: 'string', pattern: /^evt-\d+$/ }
 *   })) {
 *     return res.status(400).json({ error: 'Invalid parameters' });
 *   }
 *
 *   // 4. Proceed with operation using PARAMETERIZED query
 *   const result = await db.query(
 *     'UPDATE events SET status = ? WHERE id = ?',
 *     ['approved', req.params.id]
 *   );
 *
 *   res.json({ success: true });
 * });
 * ```
 */
