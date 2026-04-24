/**
 * Map View Page
 *
 * Displays events on a visual campus map with location pins.
 * Provides geographic context for event discovery.
 *
 * RISK MITIGATION (R6 - Scope Creep on Maps):
 * ============================================
 * FROZEN SCOPE: Map feature is intentionally LIMITED to:
 * 1. Display event location pins
 * 2. Provide external directions link (Google Maps)
 * 3. Show basic event info on pin click
 *
 * OUT OF SCOPE (DO NOT IMPLEMENT):
 * - Full routing between locations
 * - Turn-by-turn navigation
 * - Distance calculations
 * - Walking time estimates
 * - Indoor navigation
 * - Custom map tiles
 *
 * Any scope expansion MUST be approved by project lead to prevent
 * schedule delays and resource overallocation.
 *
 * RISK MITIGATION (R3 - Map Integration Failure):
 * ===============================================
 * TODO: Separate MapService concerns to prevent map failures
 *       from breaking the main event feed.
 *
 * Recommended Architecture:
 * - Create standalone MapService for map-specific logic
 * - Implement contract tests between MapView and EventService
 * - Add error boundaries to isolate map rendering failures
 * - Provide graceful degradation if map fails (fallback to list view)
 *
 * @module pages/MapView
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { Event } from "../types/models";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Award, Calendar, MapPin, Info } from "lucide-react";
import { format } from "date-fns";

/**
 * MapView Component
 *
 * Renders events on a simulated campus map.
 *
 * Current Implementation:
 * - CSS-based map simulation (prototype)
 * - Event pins positioned based on coordinates
 * - Sidebar with event details
 * - External directions link
 *
 * Production TODO:
 * - Integrate actual mapping library (Leaflet/Mapbox)
 * - Implement MapService separation (R3 mitigation)
 * - Add contract tests for map-feed interaction
 *
 * @returns {JSX.Element} Map view page
 */
export default function MapView() {
  const { eventService, filterCriteria } = useApp();
  const navigate = useNavigate();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Apply filters to events
  useEffect(() => {
    let events = eventService.getApprovedEvents();
    events = eventService.applyFilters(filterCriteria);
    events = eventService.sortChronologically(events);
    setFilteredEvents(events);
  }, [filterCriteria, eventService]);

  // Calculate map bounds to center on events
  const centerLat = filteredEvents.length > 0
    ? filteredEvents.reduce((sum, e) => sum + e.location.coordinates.lat, 0) / filteredEvents.length
    : 38.0356;
  const centerLng = filteredEvents.length > 0
    ? filteredEvents.reduce((sum, e) => sum + e.location.coordinates.lng, 0) / filteredEvents.length
    : -78.5034;

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Map Area */}
      <div className="flex-1 relative bg-gray-100">
        {/* Simulated Map (using CSS to create a campus map look) */}
        <div
          className="w-full h-full relative"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        >
          {/* Center reference point */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <MapPin className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm font-medium">Campus Map View</p>
              <p className="text-xs">Centered at {centerLat.toFixed(4)}, {centerLng.toFixed(4)}</p>
            </div>
          </div>

          {/* Event pins positioned relative to their coordinates */}
          {filteredEvents.map((event, index) => {
            // Simple positioning based on relative coordinates
            // In a real app, this would use a proper map library like Leaflet or Google Maps
            const x = ((event.location.coordinates.lng + 78.5034) * 5000) + 50;
            const y = ((event.location.coordinates.lat - 38.0356) * 5000) + 50;
            
            return (
              <div
                key={event.id}
                className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group"
                style={{
                  left: `${Math.min(Math.max(x % 100, 10), 90)}%`,
                  top: `${Math.min(Math.max(y % 100, 10), 90)}%`,
                }}
                onClick={() => setSelectedEvent(event)}
              >
                {/* Pin */}
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                    selectedEvent?.id === event.id
                      ? "bg-blue-600 ring-4 ring-blue-200"
                      : "bg-red-500"
                  }`}>
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-3 bg-red-500" />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    <div className="bg-gray-900 text-white text-xs rounded px-2 py-1">
                      {event.title}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-semibold mb-2">Map Legend</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <span>Event Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-600 ring-2 ring-blue-200" />
              <span>Selected Event</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Click on a pin to view event details
          </p>
        </div>

        {/* Filter indicator */}
        {(filterCriteria.tags.length > 0 ||
          filterCriteria.locations.length > 0 ||
          filterCriteria.costFilter !== "any" ||
          filterCriteria.creditFilter !== "any") && (
          <div className="absolute top-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <Info className="w-4 h-4 inline mr-1" />
              Map is filtered
            </p>
          </div>
        )}
      </div>

      {/* Event Details Sidebar */}
      <div className="w-96 bg-white border-l overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {selectedEvent ? "Event Details" : "Select an Event"}
          </h2>

          {selectedEvent ? (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg pr-2">{selectedEvent.title}</h3>
                    {selectedEvent.creditEligible && (
                      <Award className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{selectedEvent.hostName}</p>
                </div>

                <p className="text-sm">{selectedEvent.description}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>
                      {format(new Date(selectedEvent.datetime), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{selectedEvent.location.name}</span>
                  </div>
                </div>

                {selectedEvent.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedEvent.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <Button
                    className="w-full"
                    onClick={() => navigate(`/events/${selectedEvent.id}`)}
                  >
                    View Full Details
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      const { lat, lng } = selectedEvent.location.coordinates;
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
                        "_blank"
                      );
                    }}
                  >
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <MapPin className="w-16 h-16 mx-auto mb-4" />
              <p className="text-sm">
                Click on a map pin to view event information
              </p>
            </div>
          )}

          {/* All Events List */}
          <div className="mt-8">
            <h3 className="font-semibold mb-3">
              All Events ({filteredEvents.length})
            </h3>
            <div className="space-y-2">
              {filteredEvents.map((event) => (
                <button
                  key={event.id}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedEvent?.id === event.id
                      ? "bg-blue-50 border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{event.title}</p>
                      <p className="text-xs text-gray-500 truncate">{event.location.name}</p>
                    </div>
                    {event.creditEligible && (
                      <Award className="w-4 h-4 text-yellow-500 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}