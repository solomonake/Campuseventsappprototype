# Changelog

## [Unreleased] - 2026-04-24

### Fixed - Build and Install Reliability

#### Vite production build entry resolution

- Added missing Vite entry files so production builds can resolve the app entry correctly:
  - `index.html` at the repository root
  - `src/main.tsx` to bootstrap React and mount `src/app/App.tsx`
- Resolved build failure:
  - `Could not resolve entry module "index.html"`

#### npm installation stability documentation

- Updated project documentation with install troubleshooting for:
  - `npm error Cannot read properties of null (reading 'matches')`
- Documented clean rebuild steps for `node_modules` and lockfile when npm Arborist encounters stale tree state.
- Added npm command parity in Quick Start instructions (`npm install`, `npm run build`).

## [Unreleased] - 2026-04-22

### Added - Location Pin Feature

#### New Interactive Location Picker for Event Creation

Staff members can now pin exact event locations using an interactive map interface:

**New Component: `LocationPicker`**
- **Two Selection Methods:**
  1. **Quick Select** - Choose from predefined campus locations (dropdown)
  2. **Pin on Map** - Click anywhere on campus map to set custom coordinates

**Features:**
- Interactive map grid showing existing campus locations
- Visual feedback when pinning custom locations
- Real-time coordinate display
- Location name customization
- Validation of coordinates (lat/lng range checks)
- Shows both preset and custom locations on the same map

**Benefits:**
- More accurate event location data
- Flexibility for outdoor events, parking lots, or new venues
- Visual confirmation of location selection
- Custom location names (e.g., "Outdoor Pavilion", "Parking Lot B")

**Technical Implementation:**
- Prototype uses CSS grid for clickable map points
- Production will integrate Leaflet or Mapbox for full map interaction
- Supports both preset locations and custom coordinates
- Location data structure remains compatible with existing Event model

**Files Added:**
- `src/app/components/LocationPicker.tsx` - Interactive location picker component

**Files Modified:**
- `src/app/pages/CreateEvent.tsx` - Replaced simple dropdown with LocationPicker

**Scope Compliance (R6):**
This feature does NOT violate frozen map scope because:
- ✅ This is location INPUT for event creation
- ✅ No routing or navigation functionality
- ✅ No turn-by-turn directions
- ✅ Simple coordinate selection only

**Production Upgrade Path:**
Replace CSS grid with actual map library:
```typescript
// Production implementation example
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

function MapClickHandler({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}
```

---

## Previous Updates

See `RISK_MITIGATION_SUMMARY.md` for risk mitigation framework additions (R4, R15, R3, R6, R7).
