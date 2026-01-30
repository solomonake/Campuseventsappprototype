import { useParams, useNavigate } from "react-router";
import { TopAppBar } from "@/app/components/TopAppBar";
import { BottomNav } from "@/app/components/BottomNav";
import { mockEvents } from "@/app/data/mockEvents";
import {
  Calendar,
  MapPin,
  DollarSign,
  Share2,
  Bookmark,
  Navigation,
  Users,
  Clock,
  Info,
} from "lucide-react";

export function EventDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="wireframe-container min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Event not found</p>
          <button
            onClick={() => navigate("/home")}
            className="text-blue-600 tap-target"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wireframe-container min-h-screen bg-gray-50">
      {/* Screen Label */}
      <div className="bg-gray-800 text-white px-4 py-2 text-sm font-mono">
        E1 - Event Detail
      </div>

      <TopAppBar title="" showBack />

      {/* Hero Section */}
      <div className="bg-white px-4 pt-4 pb-6 border-b border-gray-300">
        <div className="flex justify-between items-start mb-3">
          <h1 className="text-2xl font-bold flex-1 pr-2">{event.title}</h1>
          <div className="flex flex-wrap gap-2 justify-end">
            {event.isFree && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                Free
              </span>
            )}
            {event.culturalCredit && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                Cultural Credit
              </span>
            )}
            {event.isTonight && (
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                Tonight
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Users className="w-4 h-4" />
          <span className="text-sm">Hosted by {event.host}</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button className="flex flex-col items-center gap-1 py-3 px-2 bg-blue-50 rounded-xl tap-target border border-blue-200 hover:bg-blue-100 transition-colors">
            <Bookmark className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-medium text-blue-900">Save</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-3 px-2 bg-blue-50 rounded-xl tap-target border border-blue-200 hover:bg-blue-100 transition-colors">
            <Share2 className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-medium text-blue-900">Share</span>
          </button>
          <button
            onClick={() => navigate("/map")}
            className="flex flex-col items-center gap-1 py-3 px-2 bg-blue-600 rounded-xl tap-target hover:bg-blue-700 transition-colors"
          >
            <Navigation className="w-5 h-5 text-white" />
            <span className="text-xs font-medium text-white">Directions</span>
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="screen-content px-4 py-4 space-y-4">
        {/* Key Info Card */}
        <div className="bg-white rounded-xl p-4 border border-gray-300">
          <h3 className="font-semibold mb-3">Event Details</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{event.date}</p>
                <p className="text-sm text-gray-600">{event.time}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{event.location}</p>
                <p className="text-sm text-gray-600">{event.distance} from you</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">
                  {event.isFree ? "Free Admission" : event.cost}
                </p>
              </div>
            </div>
            {event.category && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{event.category}</p>
                  <p className="text-sm text-gray-600">Category</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl p-4 border border-gray-300">
          <h3 className="font-semibold mb-2">About This Event</h3>
          <p className="text-gray-700">{event.description}</p>
        </div>

        {/* Cultural Credit Info */}
        {event.culturalCredit && (
          <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-purple-900 mb-1">
                  Cultural Credit Eligible
                </h3>
                <p className="text-sm text-purple-800 mb-2">
                  This event qualifies for cultural credit hours required for
                  graduation.
                </p>
                <p className="text-sm text-purple-800">
                  <strong>To earn credit:</strong> Scan the QR code at the event
                  check-in table. Code available 30 minutes before event start.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Similar Events */}
        <div className="bg-white rounded-xl p-4 border border-gray-300">
          <h3 className="font-semibold mb-3">You Might Also Like</h3>
          <div className="space-y-2">
            {mockEvents
              .filter(
                (e) => e.id !== event.id && e.category === event.category
              )
              .slice(0, 2)
              .map((similarEvent) => (
                <button
                  key={similarEvent.id}
                  onClick={() => navigate(`/event/${similarEvent.id}`)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg tap-target hover:border-gray-300 transition-colors"
                >
                  <p className="font-medium text-sm mb-1">
                    {similarEvent.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    {similarEvent.date} • {similarEvent.location}
                  </p>
                </button>
              ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
