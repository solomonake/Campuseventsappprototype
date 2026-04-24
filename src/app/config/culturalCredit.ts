/**
 * Cultural Credit Configuration
 *
 * RISK MITIGATION (R7 - Requirement Volatility):
 * ==============================================
 * Cultural credit rules are stored as CONFIGURATION DATA
 * rather than hardcoded logic throughout the application.
 *
 * Benefits:
 * - Late requirement changes don't require code rewrites
 * - Rules can be updated without redeployment
 * - Easy to test different rule configurations
 * - Single source of truth for credit eligibility
 *
 * Configuration-Driven Approach:
 * - Rules are defined in this config file
 * - Business logic reads from config
 * - Changes only require config update, not code changes
 *
 * Production: Move these to environment variables or database
 * to allow runtime configuration updates.
 *
 * @module config/culturalCredit
 */

/**
 * Cultural Credit Eligibility Rules
 *
 * Defines which types of events qualify for cultural credit.
 *
 * NOTE: These rules can change based on academic policy.
 * By keeping them as configuration data, policy changes
 * don't require code modifications.
 */
export const CulturalCreditConfig = {
  /**
   * Event tags that automatically qualify for cultural credit
   */
  eligibleTags: [
    "Arts",
    "Academic",
    "Workshop"
  ],

  /**
   * Event types that automatically qualify
   */
  eligibleEventTypes: [
    "lecture",
    "performance",
    "exhibition",
    "cultural-celebration"
  ],

  /**
   * Minimum attendance duration (in minutes) to earn credit
   * Default: 30 minutes
   */
  minimumAttendanceDuration: 30,

  /**
   * Maximum credits a student can earn per semester
   * Default: 10 credits
   */
  maxCreditsPerSemester: 10,

  /**
   * Whether paid events can qualify for credit
   * Default: true (events can have admission fee)
   */
  allowPaidEvents: true,

  /**
   * Minimum event duration (in minutes) to qualify
   * Default: 30 minutes
   */
  minimumEventDuration: 30,

  /**
   * Check-in window (minutes before event start)
   * Students can check in this many minutes before event starts
   * Default: 15 minutes
   */
  checkInWindowBefore: 15,

  /**
   * Check-in deadline (minutes after event start)
   * Students must check in within this time after event starts
   * Default: 30 minutes
   */
  checkInDeadlineAfter: 30,

  /**
   * Whether credit is automatically awarded on check-in
   * or requires manual staff verification
   * Default: false (requires verification)
   */
  automaticCreditAward: false,

  /**
   * Departments that can designate events as credit-eligible
   */
  authorizedDepartments: [
    "Arts Department",
    "International Programs Office",
    "Environmental Sciences Department",
    "Student Activities Board"
  ]
};

/**
 * Validate Cultural Credit Eligibility
 *
 * Checks if an event qualifies for cultural credit based on
 * configured rules.
 *
 * This function reads from config rather than hardcoding rules,
 * making it easy to update eligibility criteria.
 *
 * @param event - Event to check
 * @returns boolean - True if event qualifies for credit
 */
export function isCulturalCreditEligible(event: {
  tags: Array<{ name: string }>;
  creditEligible: boolean;
  cost: number;
  duration?: number;
}): boolean {
  // If manually marked as credit-eligible, trust that designation
  if (event.creditEligible) {
    return true;
  }

  // Check if event has eligible tags
  const hasEligibleTag = event.tags.some(tag =>
    CulturalCreditConfig.eligibleTags.includes(tag.name)
  );

  // Check if paid events are allowed
  if (event.cost > 0 && !CulturalCreditConfig.allowPaidEvents) {
    return false;
  }

  // Check minimum duration if specified
  if (event.duration && event.duration < CulturalCreditConfig.minimumEventDuration) {
    return false;
  }

  return hasEligibleTag;
}

/**
 * Calculate Credit Award
 *
 * Determines how many credits to award based on event
 * attendance and configuration rules.
 *
 * @param attendanceDuration - Minutes attended
 * @returns number - Credits to award (typically 0 or 1)
 */
export function calculateCreditAward(attendanceDuration: number): number {
  if (attendanceDuration >= CulturalCreditConfig.minimumAttendanceDuration) {
    return 1;
  }
  return 0;
}

/**
 * Export configuration for easy access
 */
export default CulturalCreditConfig;
