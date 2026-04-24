# Team Workflow Update - Risk Mitigation Assignment

@everyone Hey team, to prepare for our next assignment, we are shifting our workflow. 

## New Workflow Process

### First: Fork the Repository

Please complete your assigned tasks in your own separate copy of the repo. I will coordinate the change requests and merge them together later so we can avoid **"Big-Bang Integration"** failures.

### Second: Use GitHub Codespaces + Copilot

Try to open the website using **GitHub Codespaces** and use **GitHub Copilot** while you work. Copilot is great for:
- Debugging
- Generating test cases
- Answering questions related to server-side integration

## Top 5 Risk Mitigation Tasks

We need to tackle the **Top 5 Risks** from our Risk Management Summary before the next assignment. Please follow your specific roles:

---

### <@881953748333781062> (Implementation & Integration Lead)

You oversee the code structure and integration issues.

#### Tasks:

**R4 (Injection Vulnerability) & R15 (Privilege Escalation):**
- Use Copilot to help you implement parameterized queries
- Add output encoding
- Implement server-side role checks on all privileged endpoints

**R3 (Map Integration Failure):**
- Work on separating the MapService
- Set up contract tests so map pin rendering doesn't break the feed

---

### @Mason (Requirements, Design, & Testing Lead)

You own the problem definition and the skeptical tester's mindset.

#### Tasks:

**R6 (Scope Creep on Maps):**
- Freeze the map scope in writing to just a pin + external link
- Ensure we don't waste time building full routing
- ✅ **NEW:** Location picker for event creation is APPROVED (input only, not navigation)

**R7 (Requirement Volatility):**
- Ensure our cultural credit rules are stored as configuration data rather than hardcoded logic
- Late changes shouldn't require code rewrites

**Testing:**
- Start defining the test cases and test data for our CI pipeline
- Ensure Solomon's server-side checks and map fallbacks actually work

---

## Risk Register Reference

See `/src/imports/CECS_Risk_Register_R1-R15.pdf` for complete risk details.

## Timeline

Please complete your assigned tasks before the next assignment deadline. Coordinate merge requests through the project lead to avoid integration conflicts.
