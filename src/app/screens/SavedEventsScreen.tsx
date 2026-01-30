import { useState } from "react";
import { TopAppBar } from "@/app/components/TopAppBar";
import { BottomNav } from "@/app/components/BottomNav";
import { mockEvents } from "@/app/data/mockEvents";
import { EventCard } from "@/app/components/EventCard";
import { Calendar, Trash2 } from "lucide-react";

export function SavedEventsScreen() {
  // Mock saved events (first 4 events)
  const [savedEvents, setSavedEvents] = useState(mockEvents.slice(0, 4));

  const removeEvent = (id: string) => {
    setSavedEvents(savedEvents.filter((e) => e.id !== id));
  };

  return (
    <div className="wireframe-container min-h-screen bg-gray-50">
      {/* Screen Label */}
      <div className="bg-gray-800 text-white px-4 py-2 text-sm font-mono">
        S1 - Saved Events
      </div>

      <TopAppBar title="Saved Events" />

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-300 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{savedEvents.length}</p>
            <p className="text-sm text-gray-600">Saved Events</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {savedEvents.filter((e) => e.culturalCredit).length}
            </p>
            <p className="text-sm text-gray-600">Cultural Credit</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">
              {savedEvents.filter((e) => e.isFree).length}
            </p>
            <p className="text-sm text-gray-600">Free</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="screen-content">
        {savedEvents.length > 0 ? (
          <>
            {/* Upcoming Section */}
            <div className="px-4 pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-gray-600" />
                <h2 className="font-semibold">Upcoming</h2>
              </div>
            </div>

            <div className="px-4 space-y-3 pb-4">
              {savedEvents.map((event) => (
                <div key={event.id} className="relative">
                  <EventCard event={event} />
                  <button
                    onClick={() => removeEvent(event.id)}
                    className="absolute top-3 right-3 p-2 bg-white border border-gray-300 rounded-lg tap-target hover:bg-red-50 hover:border-red-300 transition-colors"
                    aria-label="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-semibold mb-2 text-blue-900">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full py-2 px-4 bg-white text-blue-900 rounded-lg text-sm font-medium tap-target border border-blue-200 hover:bg-blue-100 transition-colors">
                    Export to Calendar
                  </button>
                  <button className="w-full py-2 px-4 bg-white text-blue-900 rounded-lg text-sm font-medium tap-target border border-blue-200 hover:bg-blue-100 transition-colors">
                    Share My Schedule
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="px-4 py-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="font-semibold mb-2">No Saved Events</h3>
            <p className="text-gray-600 text-sm mb-6">
              Browse events and save your favorites to see them here
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
