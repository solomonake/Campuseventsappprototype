/**
 * =============================================================================
 * LOCATION PICKER COMPONENT - BEGINNER'S GUIDE
 * =============================================================================
 *
 * WHAT THIS COMPONENT DOES:
 * This component lets staff members pick where an event will happen.
 * They can either:
 *   1. Choose from a list of known campus buildings (Quick Select)
 *   2. Click on a map to pin a custom location (Pin on Map)
 *
 * WHY WE NEED THIS:
 * - Not all events happen in buildings (outdoor concerts, parking lot events)
 * - Staff need flexibility to mark exact spots
 * - Better accuracy = students can find events easier
 *
 * HOW IT WORKS:
 * 1. Parent component (CreateEvent) passes in:
 *    - selectedLocation: The current location (if any)
 *    - onLocationChange: A function to call when location changes
 * 2. This component shows two tabs (preset or custom)
 * 3. When user selects a location, we call onLocationChange()
 * 4. Parent component receives the new location and stores it
 *
 * ARCHITECTURE NOTES (High Cohesion):
 * - This component ONLY handles location selection
 * - It doesn't know about events, users, or other app logic
 * - It's reusable - could be used anywhere we need location picking
 *
 * ARCHITECTURE NOTES (Low Coupling):
 * - Receives data through props (not global imports)
 * - Communicates back through callback function
 * - Parent controls the location state, we just display & collect input
 *
 * @module components/LocationPicker
 */

// ============================================================================
// IMPORTS - Bringing in code from other files
// ============================================================================

// useState is a React "hook" that lets us remember values between renders
// Think of it like a notepad that doesn't get erased when the screen updates
import { useState } from "react";

// Location is a TypeScript "type" - it defines what a location looks like
// (has id, name, coordinates, etc.)
import { Location } from "../types/models";

// mockLocations is our list of preset campus buildings
// In production, this would come from a database
import { mockLocations } from "../data/mockData";

// These are our UI building blocks (buttons, inputs, cards, etc.)
// We import them instead of writing HTML from scratch
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// Icons from lucide-react library (MapPin looks like 📍, List looks like ☰)
import { MapPin, List } from "lucide-react";

// ============================================================================
// TYPESCRIPT INTERFACE - Defining what props this component expects
// ============================================================================

/**
 * LocationPickerProps Interface
 *
 * Think of this as a "contract" - it defines what data this component needs.
 *
 * BEGINNER NOTE: "Interface" in TypeScript is like a template
 * It says "if you use this component, you MUST give it these things"
 *
 * Props are like function parameters, but for components
 */
interface LocationPickerProps {
  // The currently selected location (could be null if nothing selected yet)
  // null means "no location picked yet"
  selectedLocation: Location | null;

  // A function the parent component gives us to call when location changes
  // Think of it like: "When user picks a location, call this function"
  // The parent will receive the new location and update its state
  onLocationChange: (location: Location) => void;
}

// ============================================================================
// MAIN COMPONENT FUNCTION
// ============================================================================

/**
 * LocationPicker Component Function
 *
 * BEGINNER NOTE: In React, a "component" is just a JavaScript function that
 * returns HTML (actually JSX, which looks like HTML).
 *
 * This component is like a mini-app within the app. It:
 * 1. Keeps track of its own data (state)
 * 2. Responds to user actions (events)
 * 3. Displays UI (returns JSX)
 *
 * PROPS EXPLAINED:
 * - Props are like function parameters
 * - We "destructure" them: { selectedLocation, onLocationChange }
 * - This means: "Take these two things out of the props object"
 *
 * RETURN VALUE:
 * - We return JSX (looks like HTML)
 * - React turns this into actual HTML on the page
 */
export default function LocationPicker({ selectedLocation, onLocationChange }: LocationPickerProps) {

  // ==========================================================================
  // STATE VARIABLES - Component's memory
  // ==========================================================================

  /**
   * mode: Which tab is currently active?
   *
   * BEGINNER NOTE: useState is a React "hook" - a special function
   * that lets components remember values.
   *
   * const [value, setValue] = useState(initialValue)
   *        ↑      ↑                      ↑
   *    current  function to          starting
   *    value    update it             value
   *
   * Why we need this:
   * - When user clicks "Quick Select" tab, mode = "preset"
   * - When user clicks "Pin on Map" tab, mode = "custom"
   * - This tells us which interface to show
   */
  const [mode, setMode] = useState<"preset" | "custom">("preset");

  /**
   * customName: The name the user types for a custom location
   *
   * Example: "Outdoor Pavilion" or "Parking Lot B"
   *
   * Why string "":
   * - Empty string "" means no name typed yet
   * - Gets updated when user types in the name input field
   */
  const [customName, setCustomName] = useState("");

  /**
   * customLat: Latitude coordinate for custom location
   *
   * BEGINNER NOTE: Coordinates are like addresses for maps
   * - Latitude = North/South position (-90 to +90)
   * - 38.0356 = Somewhere in Virginia
   *
   * Why string not number?
   * - Input fields give us strings, we convert to number later
   * - Easier to work with partial input (like "38.")
   */
  const [customLat, setCustomLat] = useState("");

  /**
   * customLng: Longitude coordinate for custom location
   *
   * - Longitude = East/West position (-180 to +180)
   * - -78.5034 = Somewhere in Virginia
   */
  const [customLng, setCustomLng] = useState("");

  // ==========================================================================
  // EVENT HANDLER FUNCTIONS - Respond to user actions
  // ==========================================================================

  /**
   * handlePresetSelect - When user picks a location from dropdown
   *
   * WHAT HAPPENS:
   * 1. User clicks dropdown and selects "Student Center"
   * 2. Dropdown sends us the location ID (like "loc-1")
   * 3. We find the full location object from our list
   * 4. We tell the parent component about the selection
   *
   * BEGINNER NOTES:
   * - "const functionName = () => {}" is an "arrow function"
   * - It's a newer way to write functions in JavaScript
   * - find() searches an array and returns the first match
   * - if (location) checks if we found something (not undefined)
   *
   * WHY THIS WAY (Low Coupling):
   * - We don't update parent state directly
   * - We call the callback function they gave us
   * - Parent controls its own state, we just notify
   *
   * @param locationId - The ID of the location user selected (e.g., "loc-1")
   */
  const handlePresetSelect = (locationId: string) => {
    // Search our array of preset locations for one with matching ID
    // find() returns the location object if found, or undefined if not
    const location = mockLocations.find((l) => l.id === locationId);

    // Only proceed if we actually found a location
    // (Defensive programming - always check before using!)
    if (location) {
      // Call the function parent gave us, passing the selected location
      // Parent will receive this and update its state
      onLocationChange(location);
    }
  };

  /**
   * handleMapClick - When user clicks on the map grid
   *
   * WHAT HAPPENS:
   * 1. User clicks a spot on the map
   * 2. We receive the coordinates (lat, lng) of that spot
   * 3. We update our state with those coordinates
   * 4. If user hasn't typed a name, we auto-generate one
   *
   * BEGINNER NOTES:
   * - toFixed(6) rounds to 6 decimal places (e.g., 38.035678)
   * - Template literal `text ${variable}` inserts variable into string
   * - !customName means "if customName is empty"
   *
   * WHY toFixed?
   * - GPS coordinates are VERY precise
   * - toFixed(6) gives us accuracy to ~10 centimeters
   * - More than enough for campus events!
   *
   * @param lat - Latitude coordinate where user clicked (North/South position)
   * @param lng - Longitude coordinate where user clicked (East/West position)
   */
  const handleMapClick = (lat: number, lng: number) => {
    // Convert numbers to strings with 6 decimal places
    // toFixed returns a string, which is what our state variables expect
    setCustomLat(lat.toFixed(6));
    setCustomLng(lng.toFixed(6));

    // Auto-generate a default name if user hasn't typed one yet
    // This makes it easier - they can always change it
    if (!customName) {
      // Template literal creates a string like "Custom Location (38.0356, -78.5034)"
      setCustomName(`Custom Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
    }
  };

  /**
   * createCustomLocation - When user clicks "Set Custom Location" button
   *
   * WHAT HAPPENS:
   * 1. User has entered coordinates and name
   * 2. They click the button
   * 3. We validate everything is correct
   * 4. We create a Location object
   * 5. We send it to the parent component
   *
   * VALIDATION STEPS:
   * 1. Are coordinates valid numbers?
   * 2. Are they within Earth's valid range?
   * 3. Did user enter a name?
   *
   * BEGINNER NOTES:
   * - parseFloat converts string "38.123" to number 38.123
   * - isNaN means "is Not a Number" (checks if conversion failed)
   * - trim() removes extra spaces from beginning/end
   * - return; exits the function early (don't continue if validation fails)
   *
   * WHY VALIDATE CLIENT-SIDE:
   * - Faster feedback to user (no waiting for server)
   * - Better user experience
   * - STILL need server-side validation for security!
   */
  const createCustomLocation = () => {
    // Convert strings to numbers (input fields give us strings)
    // parseFloat("38.123") → 38.123 (number)
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);

    // VALIDATION #1: Are these valid numbers?
    // isNaN checks if it's "Not a Number"
    // This catches cases like user typing "abc" instead of numbers
    if (isNaN(lat) || isNaN(lng)) {
      alert("Please enter valid coordinates");
      return; // Stop here, don't continue
    }

    // VALIDATION #2: Are coordinates within valid Earth ranges?
    // Latitude ranges from -90 (South Pole) to +90 (North Pole)
    // Longitude ranges from -180 to +180 (wraps around Earth)
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert("Coordinates out of range");
      return; // Stop here
    }

    // VALIDATION #3: Did user enter a location name?
    // trim() removes whitespace, so "   " becomes ""
    if (!customName.trim()) {
      alert("Please enter a location name");
      return; // Stop here
    }

    // All validation passed! Create the Location object
    // This follows the Location interface from types/models.ts
    const customLocation: Location = {
      // Unique ID using current timestamp (milliseconds since 1970)
      // "custom-1713820800000" - very unlikely to duplicate
      id: `custom-${Date.now()}`,

      // Remove extra spaces from name
      name: customName.trim(),

      // Coordinates object with lat and lng
      coordinates: { lat, lng },
    };

    // Tell parent component about the new location
    // Parent will update its state and use this location for the event
    onLocationChange(customLocation);
  };

  /**
   * Simulate Map Click
   *
   * For prototype, provides grid of clickable points.
   * In production, replace with actual map library (Leaflet/Mapbox).
   */
  const renderMapGrid = () => {
    // Campus bounds (UVA-Wise approximate)
    const minLat = 38.030;
    const maxLat = 38.040;
    const minLng = -78.510;
    const maxLng = -78.495;

    const gridPoints: { lat: number; lng: number; label: string }[] = [];

    // Create 5x5 grid of clickable points
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const lat = minLat + (maxLat - minLat) * (i / 4);
        const lng = minLng + (maxLng - minLng) * (j / 4);
        gridPoints.push({
          lat,
          lng,
          label: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        });
      }
    }

    return (
      <div
        className="relative bg-gray-100 rounded-lg border-2 border-gray-300"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)
          `,
          backgroundSize: "30px 30px",
          minHeight: "400px",
        }}
      >
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-2">
            Click on the map to pin your event location
          </p>

          {/* Show existing locations as reference */}
          <div className="absolute inset-0 p-8">
            {mockLocations.map((loc, idx) => {
              // Calculate position based on coordinates
              const x = ((loc.coordinates.lng - minLng) / (maxLng - minLng)) * 100;
              const y = 100 - ((loc.coordinates.lat - minLat) / (maxLat - minLat)) * 100;

              return (
                <div
                  key={loc.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  title={loc.name}
                >
                  <div className="bg-blue-500 rounded-full w-3 h-3 border-2 border-white shadow-md" />
                  <div className="text-xs bg-white px-1 rounded mt-1 shadow-sm whitespace-nowrap">
                    {loc.name}
                  </div>
                </div>
              );
            })}

            {/* Selected custom location */}
            {customLat && customLng && (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${((parseFloat(customLng) - minLng) / (maxLng - minLng)) * 100}%`,
                  top: `${100 - ((parseFloat(customLat) - minLat) / (maxLat - minLat)) * 100}%`,
                }}
              >
                <div className="bg-red-500 rounded-full w-4 h-4 border-2 border-white shadow-lg animate-pulse" />
                <div className="text-xs bg-red-100 px-2 py-1 rounded mt-1 shadow-md font-semibold">
                  New Location
                </div>
              </div>
            )}
          </div>

          {/* Clickable grid overlay */}
          <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-1 p-8">
            {gridPoints.map((point, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleMapClick(point.lat, point.lng)}
                className="hover:bg-green-200 hover:bg-opacity-30 rounded transition-colors border border-transparent hover:border-green-400"
                title={`Click to pin at ${point.label}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Location</CardTitle>
        <CardDescription>
          Choose a predefined location or pin a custom spot on the map
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={(v) => setMode(v as "preset" | "custom")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="preset">
              <List className="w-4 h-4 mr-2" />
              Quick Select
            </TabsTrigger>
            <TabsTrigger value="custom">
              <MapPin className="w-4 h-4 mr-2" />
              Pin on Map
            </TabsTrigger>
          </TabsList>

          {/* Preset Location Selection */}
          <TabsContent value="preset" className="space-y-4">
            <div>
              <Label htmlFor="preset-location">Choose Location</Label>
              <Select
                value={selectedLocation?.id || ""}
                onValueChange={handlePresetSelect}
              >
                <SelectTrigger id="preset-location">
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {mockLocations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                      {location.accessibilityInfo && (
                        <span className="text-xs text-gray-500 ml-2">
                          ({location.accessibilityInfo})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedLocation && (
              <div className="bg-blue-50 p-3 rounded text-sm">
                <strong>Selected:</strong> {selectedLocation.name}
                <br />
                <span className="text-gray-600">
                  Coordinates: {selectedLocation.coordinates.lat.toFixed(6)},{" "}
                  {selectedLocation.coordinates.lng.toFixed(6)}
                </span>
              </div>
            )}
          </TabsContent>

          {/* Custom Map Pin Selection */}
          <TabsContent value="custom" className="space-y-4">
            {renderMapGrid()}

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="custom-lat">Latitude *</Label>
                <Input
                  id="custom-lat"
                  type="number"
                  step="0.000001"
                  placeholder="38.0356"
                  value={customLat}
                  onChange={(e) => setCustomLat(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="custom-lng">Longitude *</Label>
                <Input
                  id="custom-lng"
                  type="number"
                  step="0.000001"
                  placeholder="-78.5034"
                  value={customLng}
                  onChange={(e) => setCustomLng(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="custom-name">Location Name *</Label>
              <Input
                id="custom-name"
                placeholder="e.g., Outdoor Pavilion, Parking Lot B"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>

            <Button
              type="button"
              onClick={createCustomLocation}
              disabled={!customLat || !customLng || !customName}
              className="w-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Set Custom Location
            </Button>

            {selectedLocation && selectedLocation.id.startsWith("custom") && (
              <div className="bg-green-50 p-3 rounded text-sm">
                <strong>Custom Location Set:</strong> {selectedLocation.name}
                <br />
                <span className="text-gray-600">
                  Coordinates: {selectedLocation.coordinates.lat.toFixed(6)},{" "}
                  {selectedLocation.coordinates.lng.toFixed(6)}
                </span>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-4 text-xs text-gray-500">
          <strong>Production Note:</strong> The map pin feature will use a full interactive map
          (Leaflet or Mapbox) allowing staff to click anywhere on campus to set exact event
          locations. This prototype uses a simplified grid system.
        </div>
      </CardContent>
    </Card>
  );
}
