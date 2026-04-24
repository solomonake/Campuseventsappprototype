# New Feature: Interactive Location Picker

## Overview

Staff members can now pin exact event locations using an interactive map interface when creating new events.

## User Story

**As a** staff member creating an event  
**I want to** pin the exact location on a map  
**So that** students can see precisely where the event will be held

## Feature Details

### Two Location Selection Methods

#### 1. Quick Select (Dropdown)
- Choose from predefined campus locations
- Fast selection for common venues
- Shows accessibility information
- Displays coordinates for reference

#### 2. Pin on Map (Interactive)
- Click anywhere on the campus map
- Set custom coordinates for:
  - Outdoor events
  - Parking lots
  - New or temporary venues
  - Specific spots in large buildings
- Enter custom location name
- Visual confirmation with animated pin
- See existing locations as reference points

### How It Works

1. **Navigate to Create Event** (Staff login required)
2. **Scroll to Location section**
3. **Choose your method:**
   - **Quick Select tab**: Pick from dropdown
   - **Pin on Map tab**: Click on map to set location
4. **For custom locations:**
   - Click desired spot on map grid
   - Coordinates auto-populate
   - Enter descriptive name
   - Click "Set Custom Location"
5. **Green confirmation** shows when location is set
6. **Continue** filling out rest of event form

### Visual Feedback

- 🔵 Blue pins = Preset campus locations
- 🔴 Red pin (pulsing) = Your custom location
- Coordinates displayed in real-time
- Location name shown on confirmation

## Technical Details

### Prototype Implementation

**Current (Prototype):**
- CSS-based grid overlay
- 5x5 clickable grid points
- Simulated map appearance
- Coordinates calculated from grid position

**Production (Planned):**
- Full interactive map (Leaflet or Mapbox)
- Click anywhere for precise coordinates
- Zoom and pan controls
- Satellite/terrain view options
- Search for campus buildings

### Data Structure

Custom locations are stored with same format as preset locations:

```typescript
{
  id: "custom-1713820800000",
  name: "Outdoor Pavilion Near Library",
  coordinates: {
    lat: 38.036234,
    lng: -78.504567
  }
}
```

### Validation

- Latitude: -90 to 90
- Longitude: -180 to 180
- Location name required
- No special characters in coordinates

## Benefits

### For Staff
- ✅ Precise location control
- ✅ Support outdoor/temporary events
- ✅ Flexibility for new venues
- ✅ Visual confirmation of selection

### For Students
- ✅ Exact event locations
- ✅ Better map pin accuracy
- ✅ Easier to find outdoor events
- ✅ Clear visual on map view

### For Administrators
- ✅ More accurate event data
- ✅ Better analytics on event distribution
- ✅ Identify popular event areas
- ✅ Plan future permanent venues

## Scope Compliance

### ✅ APPROVED - This Feature Is Within Scope

**R6 Frozen Scope Analysis:**

| Prohibited Feature | Status |
|-------------------|---------|
| Turn-by-turn navigation | ❌ Not included |
| Distance calculations | ❌ Not included |
| Walking time estimates | ❌ Not included |
| Route optimization | ❌ Not included |
| Real-time tracking | ❌ Not included |

**Why This Is Allowed:**
- This is INPUT functionality (creating events)
- NOT output/navigation (getting directions)
- Aligns with existing "pin + external link" scope
- No routing or navigation logic
- External directions still use Google Maps link

## Usage Examples

### Example 1: Outdoor Concert
**Before:** "Select 'Student Center'" (not accurate for lawn event)  
**After:** Click on lawn area, name it "Student Center Lawn", get exact coordinates

### Example 2: Parking Lot Tailgate
**Before:** No good preset option  
**After:** Click on Parking Lot B, name it "Parking Lot B - Section 3"

### Example 3: New Building
**Before:** Building not in preset list  
**After:** Click on new building location, add custom name

## Testing Checklist

Staff Testing:
- [ ] Can select preset location via dropdown
- [ ] Can click map to set custom location
- [ ] Coordinates auto-populate on map click
- [ ] Can enter custom location name
- [ ] Can submit event with custom location
- [ ] Custom location appears in event details
- [ ] Custom location shows on map view

Edge Cases:
- [ ] Invalid coordinates rejected
- [ ] Empty location name prevented
- [ ] Switching between preset/custom works
- [ ] Location persists through draft save
- [ ] Location displays correctly in approval queue

## Future Enhancements (Post-Production)

### Phase 1 (Current)
- ✅ CSS grid map
- ✅ Preset + custom locations
- ✅ Basic validation

### Phase 2 (Next Sprint)
- 🔄 Integrate Leaflet/Mapbox
- 🔄 Full click-anywhere support
- 🔄 Zoom/pan controls
- 🔄 Building search

### Phase 3 (Future)
- ⏳ Indoor floor plans
- ⏳ Accessibility routing
- ⏳ Parking suggestions
- ⏳ Weather overlay

## Questions & Support

**Q: Can I change a custom location after creating it?**  
A: Yes, edit the event and select a different location.

**Q: Will custom locations show on the map view?**  
A: Yes! Custom locations appear as pins just like preset locations.

**Q: What happens to events with custom locations if I delete them?**  
A: The location data is part of the event. Deleting the event removes the location reference.

**Q: Can students see custom location coordinates?**  
A: Yes, coordinates are visible on the event detail page and map view.

**Q: Is there a limit to custom locations?**  
A: No limit - each event can have its own unique location.

## Related Documentation

- `src/app/components/LocationPicker.tsx` - Component source code
- `CHANGELOG.md` - Feature change log
- `TEAM_INSTRUCTIONS.md` - Scope compliance notes
- `RISK_MITIGATION_SUMMARY.md` - R6 scope documentation

---

*Feature implemented: April 22, 2026*  
*Status: ✅ Complete and ready for testing*
