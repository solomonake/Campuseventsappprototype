import { useState } from "react";
import { TopAppBar } from "@/app/components/TopAppBar";
import { BottomNav } from "@/app/components/BottomNav";
import { mockEvents } from "@/app/data/mockEvents";
import { MapPin, Navigation, Locate } from "lucide-react";
import { useNavigate } from "react-router";

export function MapScreen() {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(
    mockEvents[0].id
  );

  const selectedEventData = mockEvents.find((e) => e.id === selectedEvent);

  return (
    <div className="wireframe-container min-h-screen bg-gray-50">
      {/* Screen Label */}
      <div className="bg-gray-800 text-white px-4 py-2 text-sm font-mono">
        M1 - Map View
      </div>

      <TopAppBar title="Event Map" showBack />

      {/* Map Area */}
      <div className="relative h-96 bg-gray-200 border-b-2 border-gray-300">
        {/* Map Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-2" />
            <p className="text-sm">Interactive Map</p>
            <p className="text-xs">(Campus & Nearby Areas)</p>
          </div>
        </div>

        {/* Event Pins - Visual representation */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <button
            onClick={() => setSelectedEvent(mockEvents[0].id)}
            className="w-10 h-10 bg-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center tap-target animate-pulse"
          >
            <MapPin className="w-5 h-5 text-white" />
          </button>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-blue-600"></div>
        </div>

        <div className="absolute top-1/2 left-1/3">
          <button
            onClick={() => setSelectedEvent(mockEvents[1].id)}
            className="w-8 h-8 bg-green-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center tap-target"
          >
            <MapPin className="w-4 h-4 text-white" />
          </button>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-green-600"></div>
        </div>

        <div className="absolute top-2/3 right-1/3">
          <button
            onClick={() => setSelectedEvent(mockEvents[2].id)}
            className="w-8 h-8 bg-purple-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center tap-target"
          >
            <MapPin className="w-4 h-4 text-white" />
          </button>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-purple-600"></div>
        </div>

        {/* Your Location Indicator */}
        <div className="absolute bottom-20 right-1/4">
          <div className="relative">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button
            className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center tap-target border border-gray-300"
            aria-label="Center on my location"
          >
            <Locate className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 text-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span>Free</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
            <span>Cultural Credit</span>
          </div>
        </div>
      </div>

      {/* Selected Event Card */}
      {selectedEventData && (
        <div className="bg-white border-t-2 border-gray-300 p-4 shadow-lg">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">
                {selectedEventData.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {selectedEventData.host}
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedEventData.distance}</span>
                </div>
                <span>•</span>
                <span>{selectedEventData.location}</span>
              </div>
            </div>
            <div className="flex gap-1">
              {selectedEventData.isFree && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  Free
                </span>
              )}
              {selectedEventData.culturalCredit && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                  Credit
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => navigate(`/event/${selectedEventData.id}`)}
              className="py-3 px-4 bg-gray-100 text-gray-900 rounded-xl font-medium tap-target hover:bg-gray-200 transition-colors"
            >
              View Details
            </button>
            <button className="py-3 px-4 bg-blue-600 text-white rounded-xl font-medium tap-target hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Navigation className="w-4 h-4" />
              Directions
            </button>
          </div>
        </div>
      )}

      {/* Event List Toggle */}
      <div className="screen-content px-4 py-4">
        <h3 className="font-semibold mb-3">Nearby Events</h3>
        <div className="space-y-2">
          {mockEvents.slice(0, 5).map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEvent(event.id)}
              className={`w-full text-left p-3 rounded-lg tap-target transition-all ${
                selectedEvent === event.id
                  ? "bg-blue-50 border-2 border-blue-600"
                  : "bg-white border border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1">{event.title}</p>
                  <p className="text-xs text-gray-600">
                    {event.location} • {event.distance}
                  </p>
                </div>
                <span className="text-xs text-gray-600">{event.time}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
