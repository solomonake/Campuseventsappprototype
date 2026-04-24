# Security Implementation Guide

## Risk Mitigation Overview

This guide documents the security measures required to address the Top 5 risks identified in the CECS Risk Register.

---

## R4: Injection Vulnerability (HIGH PRIORITY)

### Risk Description
User input (event codes, search queries, form data) could be exploited to inject malicious code (SQL, XSS, command injection).

### Current Status
✅ Prototype has basic input validation
⚠️ Production needs comprehensive injection prevention

### Required Mitigations

#### 1. Input Sanitization

**Location:** All user input points
- Event creation forms
- Search queries  
- Check-in codes
- Filter parameters

**Implementation:**
```typescript
// Install validator library
npm install validator

// Example sanitization
import validator from 'validator';

function sanitizeInput(input: string): string {
  // Remove HTML tags
  let clean = validator.stripLow(input);
  clean = validator.escape(clean);
  
  // Trim whitespace
  clean = clean.trim();
  
  // Limit length
  clean = clean.substring(0, 1000);
  
  return clean;
}
```

#### 2. Parameterized Queries (SQL Injection Prevention)

**⚠️ CRITICAL:** NEVER concatenate user input into SQL queries

**BAD Example (Vulnerable):**
```typescript
const query = `SELECT * FROM events WHERE title = '${userInput}'`;
```

**GOOD Example (Safe):**
```typescript
// Using parameterized query
const query = 'SELECT * FROM events WHERE title = ?';
const params = [userInput];
const result = await db.query(query, params);
```

**Implementation Locations:**
- `src/app/services/EventService.ts` - Event CRUD operations
- `src/app/services/CheckInService.ts` - Attendance queries
- `src/app/services/ApprovalService.ts` - Approval workflows

#### 3. Output Encoding (XSS Prevention)

**React Auto-Escaping:** React automatically escapes content in JSX.

**DANGER ZONES:**
- `dangerouslySetInnerHTML` - AVOID unless absolutely necessary
- URLs in href attributes - validate and sanitize
- Direct DOM manipulation - use React refs carefully

**Safe Pattern:**
```typescript
// React auto-escapes this
<div>{userGeneratedContent}</div>

// If you MUST use dangerouslySetInnerHTML:
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(content)
}} />
```

#### 4. Rate Limiting

**Implementation:** Prevent brute-force code guessing

**Location:** `src/app/services/CheckInService.ts`

```typescript
// Add rate limiting to fallbackCheckIn
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

class RateLimiter {
  private attempts: Map<string, { count: number; lockoutUntil: number }>;

  checkLimit(userId: string, eventId: string): boolean {
    const key = `${userId}:${eventId}`;
    const record = this.attempts.get(key);

    if (record && Date.now() < record.lockoutUntil) {
      return false; // Still locked out
    }

    if (record && record.count >= MAX_ATTEMPTS) {
      // Lock out user
      record.lockoutUntil = Date.now() + LOCKOUT_DURATION;
      return false;
    }

    return true;
  }

  recordAttempt(userId: string, eventId: string, success: boolean) {
    const key = `${userId}:${eventId}`;
    
    if (success) {
      this.attempts.delete(key); // Clear on success
    } else {
      const record = this.attempts.get(key) || { count: 0, lockoutUntil: 0 };
      record.count++;
      this.attempts.set(key, record);
    }
  }
}
```

### Testing Checklist

- [ ] All user inputs are sanitized
- [ ] All database queries use parameterized statements
- [ ] XSS payload tests fail (e.g., `<script>alert('XSS')</script>`)
- [ ] SQL injection tests fail (e.g., `' OR '1'='1`)
- [ ] Rate limiting blocks brute force attempts

---

## R15: Privilege Escalation (HIGH PRIORITY)

### Risk Description
Users could manipulate client-side data to gain unauthorized access to privileged functions.

### Current Status
✅ Client-side role checks implemented
⚠️ Server-side authorization REQUIRED for production

### Required Mitigations

#### 1. Server-Side Authorization Checks

**⚠️ CRITICAL:** NEVER trust client-side role data

**Implementation:** `src/app/middleware/authorizationChecks.ts`

**Every Privileged Endpoint Must:**
```typescript
app.post('/api/events/:id/approve', async (req, res) => {
  // 1. Get user from SERVER session (not client!)
  const user = req.session.user;
  
  // 2. Verify session is valid
  if (!user || !isSessionValid(req.session)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // 3. Check authorization
  if (!isAuthorized(user.id, user.role, 'APPROVE_EVENT')) {
    logSecurityEvent('unauthorized_access_attempt', user.id, 'APPROVE_EVENT');
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // 4. Proceed with operation
  // ...
});
```

#### 2. Session Management

**Requirements:**
- Sessions stored server-side only
- Secure, HTTP-only cookies
- CSRF token validation
- Session expiration (30 min idle timeout)
- Secure session ID generation

```typescript
// Express session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // HTTPS only
    httpOnly: true,    // No JS access
    sameSite: 'strict', // CSRF protection
    maxAge: 30 * 60 * 1000 // 30 minutes
  },
  store: new RedisStore() // Server-side storage
}));
```

#### 3. Role-Based Access Control (RBAC)

**Configuration:** `src/app/middleware/authorizationChecks.ts`

**Privileged Actions Matrix:**

| Action | Student | Staff | Administrator |
|--------|---------|-------|---------------|
| View Events | ✅ | ✅ | ✅ |
| Create Event | ❌ | ✅ | ✅ |
| Approve Event | ❌ | ❌ | ✅ |
| Delete Event | ❌ | ❌ | ✅ |
| Manage Users | ❌ | ❌ | ✅ |
| View Analytics | ❌ | ✅ | ✅ |

#### 4. Audit Logging

**Log All Security Events:**
- Failed login attempts
- Authorization failures
- Privilege escalation attempts
- Role changes
- Administrative actions

```typescript
function logSecurityEvent(
  event: string,
  userId: string,
  details: string
) {
  logger.warn({
    timestamp: new Date().toISOString(),
    event,
    userId,
    details,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
}
```

### Testing Checklist

- [ ] Client-side role changes don't affect server permissions
- [ ] Attempting privileged action without auth returns 401
- [ ] Attempting privileged action with wrong role returns 403
- [ ] Sessions expire after idle timeout
- [ ] CSRF tokens required for state-changing operations
- [ ] All security events are logged

---

## R3: Map Integration Failure

### Risk Description
Map component failures could crash the entire event feed.

### Current Status
✅ MapService separation implemented
⚠️ Contract tests needed

### Required Mitigations

#### 1. Service Separation

**Implementation:** `src/app/services/MapService.ts`

**Architecture:**
```
EventService (owns event data)
     ↓ provides events
MapService (converts to map pins)
     ↓ provides pins
MapView Component (renders map)
```

**Benefits:**
- Map failures don't affect event list
- Can swap map providers easily
- Independent testing possible

#### 2. Error Boundaries

```typescript
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }) {
  return (
    <div>
      <h2>Map Unavailable</h2>
      <p>The map is temporarily unavailable. You can still view events in list view.</p>
      <button onClick={() => navigate('/events')}>View Event List</button>
    </div>
  );
}

<ErrorBoundary FallbackComponent={ErrorFallback}>
  <MapView />
</ErrorBoundary>
```

#### 3. Contract Tests

**Location:** `src/app/services/__tests__/MapService.contract.test.ts`

```typescript
describe('MapService Contract', () => {
  const mapService = new MapService();

  test('eventsToMapPins always returns array', () => {
    expect(Array.isArray(mapService.eventsToMapPins([]))).toBe(true);
  });

  test('handles null/undefined gracefully', () => {
    expect(() => mapService.eventsToMapPins(null)).not.toThrow();
    expect(mapService.eventsToMapPins(null)).toEqual([]);
  });

  test('getDirectionsUrl returns valid URL', () => {
    const url = mapService.getDirectionsUrl(validLocation);
    expect(url).toMatch(/^https:\/\/www\.google\.com\/maps/);
  });
});
```

### Testing Checklist

- [ ] Map errors don't crash event feed
- [ ] Event feed works when map service is down
- [ ] Contract tests pass
- [ ] Error boundary displays fallback UI
- [ ] Users can navigate to list view from map error

---

## R6: Scope Creep on Maps (FROZEN SCOPE)

### Approved Features (IMPLEMENT ONLY THESE)

✅ Display event location pins
✅ Show event info on pin click
✅ Provide external directions link (Google Maps)

### OUT OF SCOPE (DO NOT IMPLEMENT)

❌ Turn-by-turn navigation
❌ Distance calculations
❌ Walking time estimates
❌ Route optimization
❌ Indoor navigation
❌ Custom map tiles
❌ Real-time location tracking

### Scope Enforcement

**Document:** `TEAM_INSTRUCTIONS.md`

**Code Comment:** Every map-related file has frozen scope notice

**Pull Request Template:**
```markdown
## Map Feature Scope Check

Does this PR add ANY of the following?
- [ ] Routing/navigation logic
- [ ] Distance/time calculations
- [ ] Custom map rendering

If YES to any: Request scope change approval BEFORE merging.
```

---

## R7: Requirement Volatility

### Risk Description
Late changes to cultural credit rules require code rewrites.

### Mitigation: Configuration-Driven Design

**Implementation:** `src/app/config/culturalCredit.ts`

**Benefits:**
- Policy changes don't require code changes
- Easy to test different configurations
- Single source of truth

**Configuration File:**
```typescript
export const CulturalCreditConfig = {
  eligibleTags: ["Arts", "Academic", "Workshop"],
  minimumAttendanceDuration: 30,
  maxCreditsPerSemester: 10,
  allowPaidEvents: true,
  checkInWindowBefore: 15,
  checkInDeadlineAfter: 30,
};
```

**Usage in Code:**
```typescript
// BAD: Hardcoded logic
if (event.tags.includes("Arts") && attendanceMinutes >= 30) {
  awardCredit();
}

// GOOD: Configuration-driven
if (isCulturalCreditEligible(event) && 
    attendanceMinutes >= CulturalCreditConfig.minimumAttendanceDuration) {
  awardCredit();
}
```

### Production Enhancement

Move configuration to database for runtime updates:

```typescript
class ConfigService {
  async getCreditConfig() {
    return await db.query('SELECT * FROM system_config WHERE key = ?', 
                         ['cultural_credit']);
  }

  async updateCreditConfig(config) {
    // Update config without code deployment
    await db.query('UPDATE system_config SET value = ? WHERE key = ?',
                  [JSON.stringify(config), 'cultural_credit']);
  }
}
```

---

## Security Checklist (Pre-Production)

### Input Validation
- [ ] All user inputs are sanitized
- [ ] Length limits enforced
- [ ] Type validation performed
- [ ] Special characters handled safely

### Injection Prevention
- [ ] All SQL uses parameterized queries
- [ ] No eval() or dangerous functions
- [ ] Output properly encoded
- [ ] URLs validated before use

### Authorization
- [ ] All privileged endpoints check auth server-side
- [ ] Sessions stored server-side only
- [ ] CSRF protection enabled
- [ ] Role checks use server session data

### Error Handling
- [ ] Errors don't leak sensitive info
- [ ] Error boundaries catch failures
- [ ] Graceful degradation implemented
- [ ] User-friendly error messages

### Logging & Monitoring
- [ ] Security events logged
- [ ] Failed auth attempts tracked
- [ ] Audit trail for privileged actions
- [ ] Alerts configured for anomalies

---

## Deployment Checklist

- [ ] All R4 injection mitigations implemented
- [ ] All R15 privilege escalation mitigations implemented
- [ ] R3 contract tests passing
- [ ] R6 scope frozen and documented
- [ ] R7 configuration externalized
- [ ] Security penetration testing completed
- [ ] Code review by security team
- [ ] All credentials removed from code
- [ ] Environment variables configured
- [ ] HTTPS enforced
- [ ] Security headers set (CSP, HSTS, etc.)

---

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [React Security Best Practices](https://snyk.io/blog/10-react-security-best-practices/)

---

*Last Updated: April 22, 2026*
*Risk Register: `/src/imports/CECS_Risk_Register_R1-R15.pdf`*
