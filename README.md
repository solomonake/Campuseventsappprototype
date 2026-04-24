# Campus Event Calendar System (CECS)

## 🎓 Educational Codebase with Best Practices

This project demonstrates **High Cohesion** and **Low Coupling** architecture principles with beginner-friendly documentation throughout.

---

## 📚 Documentation for Different Skill Levels

### 🆕 New to Programming?

Start here:
1. **[BEGINNER_GUIDE.md](BEGINNER_GUIDE.md)** - Learn React, TypeScript, and code concepts
2. **[src/app/components/LocationPicker.tsx](src/app/components/LocationPicker.tsx)** - Walkthrough of a complete component
3. **[COHESION_COUPLING_EXAMPLES.md](COHESION_COUPLING_EXAMPLES.md)** - See good vs. bad code patterns

### 💻 Experienced Developer?

Jump to:
1. **[ARCHITECTURE.md](ARCHITECTURE.md)** - High cohesion/low coupling architecture
2. **[CODE_QUALITY_SUMMARY.md](CODE_QUALITY_SUMMARY.md)** - Architecture analysis
3. **[CECS-README.md](CECS-README.md)** - Feature implementation details

### 👥 Team Lead?

Review:
1. **[TEAM_INSTRUCTIONS.md](TEAM_INSTRUCTIONS.md)** - Workflow and task assignments
2. **[RISK_MITIGATION_SUMMARY.md](RISK_MITIGATION_SUMMARY.md)** - Security risks addressed
3. **[SECURITY_GUIDE.md](SECURITY_GUIDE.md)** - Security implementation guide

---

## 🏗️ Architecture Highlights

### High Cohesion ✅
- Each file has **ONE clear responsibility**
- Related code grouped together
- Easy to find and understand

### Low Coupling ✅
- Components communicate through **interfaces**
- Services are **independent** and **testable**
- Configuration separated from logic

### Design Patterns Used
- **Strategy Pattern** - Flexible event filtering
- **Context Pattern** - Global state management
- **Service Layer** - Business logic separation
- **Configuration Pattern** - Externalized rules

See [ARCHITECTURE.md](ARCHITECTURE.md) for details.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm)

### Install Dependencies
```bash
# Install dependencies
pnpm install
```

If you prefer npm:

```bash
npm install
```

### Build the App
```bash
pnpm build
```

Or with npm:

```bash
npm run build
```

### Run Locally
```bash
# Start the Vite dev server
pnpm exec vite --host 0.0.0.0
```

If you prefer npm, use `npx vite --host 0.0.0.0`.

### Vite Entry Files

This project builds through the standard Vite entry points:

- `index.html` (project root)
- `src/main.tsx` (React bootstrap entry)

Do not remove these files unless `vite.config.ts` is updated to point to a different entry.

### Troubleshooting

#### Error: Could not resolve entry module "index.html"

Cause:
- The Vite HTML entry file is missing from the project root.

Fix:
1. Ensure `index.html` exists at the repository root.
2. Ensure `src/main.tsx` exists and mounts `src/app/App.tsx`.
3. Re-run `pnpm build` or `npm run build`.

#### Error: npm Cannot read properties of null (reading 'matches')

Cause:
- npm Arborist is attempting to process an incompatible or stale `node_modules` tree.

Fix:
```bash
rm -rf node_modules package-lock.json
npm cache verify
npm install
```

If the same error persists with npm 11, use npm 10 for installation:

```bash
npx npm@10 install
```

### Demo Credentials
- **Student:** student@uvawise.edu / student123
- **Staff:** staff@uvawise.edu / staff123
- **Admin:** admin@uvawise.edu / admin123

---

## 📂 Project Structure

```
index.html               # Vite HTML entry
src/main.tsx             # React bootstrap entry

src/app/
├── components/       # Reusable UI components
│   ├── LocationPicker.tsx  # 📍 Interactive location picker
│   └── NFCCheckIn.tsx      # Attendance check-in
│
├── pages/            # Route pages
│   ├── EventFeed.tsx       # Main event list with filters
│   ├── CreateEvent.tsx     # Event creation form
│   ├── MapView.tsx         # Map with event pins
│   └── AdminDashboard.tsx  # Event approval queue
│
├── contexts/         # Global state management
│   ├── AuthContext.tsx     # User authentication
│   └── AppContext.tsx      # App-wide state
│
├── services/         # Business logic (HIGH COHESION)
│   ├── EventService.ts     # Event operations
│   ├── MapService.ts       # Map calculations
│   ├── ApprovalService.ts  # Event approval
│   └── CheckInService.ts   # Attendance tracking
│
├── types/            # TypeScript interfaces
│   └── models.ts
│
├── config/           # Configuration (LOW COUPLING)
│   └── culturalCredit.ts   # Credit rules
│
└── data/             # Mock data
    └── mockData.ts
```

**Why this structure?**
- High Cohesion: Each folder has ONE purpose
- Low Coupling: Clean dependency flow (components → contexts → services → models)

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed explanation.

---

## ✨ Key Features

### For Students
- 📅 Browse upcoming campus events
- 🔍 Advanced filtering (tags, location, cost, credit)
- 🗺️ Map view with event pins
- ✅ Check-in to events (NFC/QR + fallback code)
- 🎓 Track cultural credit

### For Staff
- ➕ Create new events
- 📍 **NEW!** Pin exact locations on map
- 💾 Save drafts or submit for approval
- 🏷️ Tag events with categories

### For Administrators
- ✅ Approve/reject pending events
- 👥 Manage role change requests
- 📊 View all events by status

---

## 🆕 Latest Features

### Interactive Location Picker

Staff can now pin exact event locations on a map!

**Features:**
- 🔵 Quick Select - Choose from preset locations
- 📍 Pin on Map - Click to set custom coordinates
- ✏️ Custom names for locations
- ✅ Visual confirmation

See [FEATURE_SUMMARY.md](FEATURE_SUMMARY.md) and [CHANGELOG.md](CHANGELOG.md) for details.

---

## 🔒 Security & Quality

### Security Measures (Risk Mitigations)

- **R4:** Injection vulnerability prevention
- **R15:** Privilege escalation protection
- **R3:** Map integration failure isolation
- **R6:** Frozen scope enforcement
- **R7:** Configuration-driven design

See [SECURITY_GUIDE.md](SECURITY_GUIDE.md) for implementation details.

### Code Quality

- ✅ High cohesion (single responsibility)
- ✅ Low coupling (interface-based)
- ✅ Beginner-friendly comments
- ✅ Design patterns documented
- ✅ Testable architecture

See [CODE_QUALITY_SUMMARY.md](CODE_QUALITY_SUMMARY.md) for metrics.

---

## 🧪 Testing

```bash
# Run tests (when implemented)
pnpm test

# Lint code
pnpm lint
```

**Architecture Benefits for Testing:**
- Services can be unit tested (no UI needed)
- Components can be integration tested (mock context)
- High cohesion = focused tests
- Low coupling = easy mocking

---

## 📖 Learning Resources

### Internal Documentation
- [BEGINNER_GUIDE.md](BEGINNER_GUIDE.md) - Start here if you're new
- [ARCHITECTURE.md](ARCHITECTURE.md) - Understand the structure
- [COHESION_COUPLING_EXAMPLES.md](COHESION_COUPLING_EXAMPLES.md) - See patterns in action

### External Resources
- [React Documentation](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [OWASP Security](https://owasp.org/www-project-top-ten/)

---

## 👥 Team Workflow

See [TEAM_INSTRUCTIONS.md](TEAM_INSTRUCTIONS.md) for:
- Fork and branch workflow
- Role assignments
- Risk mitigation tasks
- GitHub Codespaces + Copilot usage

---

## 📋 Documentation Index

| Document | Purpose | Audience |
|----------|---------|----------|
| [BEGINNER_GUIDE.md](BEGINNER_GUIDE.md) | Learn React & TypeScript basics | Beginners |
| [ARCHITECTURE.md](ARCHITECTURE.md) | High cohesion/low coupling guide | All developers |
| [COHESION_COUPLING_EXAMPLES.md](COHESION_COUPLING_EXAMPLES.md) | Real code examples | All developers |
| [CODE_QUALITY_SUMMARY.md](CODE_QUALITY_SUMMARY.md) | Architecture analysis | Tech leads |
| [CECS-README.md](CECS-README.md) | Feature details | All developers |
| [FEATURE_SUMMARY.md](FEATURE_SUMMARY.md) | Latest features | All users |
| [CHANGELOG.md](CHANGELOG.md) | Version history | All developers |
| [TEAM_INSTRUCTIONS.md](TEAM_INSTRUCTIONS.md) | Workflow & tasks | Team members |
| [SECURITY_GUIDE.md](SECURITY_GUIDE.md) | Security implementation | Developers |
| [RISK_MITIGATION_SUMMARY.md](RISK_MITIGATION_SUMMARY.md) | Risk status | Project leads |

---

## 🤝 Contributing

### Code Quality Standards

When adding code, ensure:
- **High Cohesion:** One responsibility per file
- **Low Coupling:** Use interfaces, avoid direct dependencies
- **Comments:** Beginner-friendly explanations
- **Tests:** Unit tests for services, integration tests for components

See checklists in [CODE_QUALITY_SUMMARY.md](CODE_QUALITY_SUMMARY.md).

---

## 📝 Notes

This codebase is designed to be **educational** and **production-ready**:
- ✅ Demonstrates best practices
- ✅ Extensively documented
- ✅ Beginner-friendly
- ✅ Industry-standard architecture
- ✅ Security-focused

**Perfect for:**
- Learning React and TypeScript
- Understanding software architecture
- Seeing design patterns in action
- Building production applications

---

## 📞 Support

**Questions about the code?**
1. Check inline comments (files are heavily documented)
2. Read [BEGINNER_GUIDE.md](BEGINNER_GUIDE.md)
3. Review [COHESION_COUPLING_EXAMPLES.md](COHESION_COUPLING_EXAMPLES.md)

**Questions about features?**
1. Check [CECS-README.md](CECS-README.md)
2. Review [FEATURE_SUMMARY.md](FEATURE_SUMMARY.md)

---

## 🎉 Ready to Learn!

Start with [BEGINNER_GUIDE.md](BEGINNER_GUIDE.md) and explore the commented code!

**Happy Coding! 🚀**

---

*Built with React, TypeScript, Tailwind CSS, and best practices in mind.*  
*Architecture: High Cohesion ✅ Low Coupling ✅ Beginner-Friendly ✅*
