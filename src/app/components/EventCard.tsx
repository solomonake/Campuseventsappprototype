import { Calendar, MapPin, DollarSign } from "lucide-react";
import { useNavigate } from "react-router";

export interface Event {
  id: string;
  title: string;
  host: string;
  date: string;
  time: string;
  location: string;
  distance: string;
  cost: string;
  isFree: boolean;
  culturalCredit: boolean;
  isTonight?: boolean;
  description?: string;
  category?: string;
}

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/event/${event.id}`)}
      className="bg-white border border-gray-300 rounded-lg p-4 tap-target cursor-pointer hover:border-gray-400 transition-colors"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-base flex-1 pr-2">{event.title}</h3>
        <div className="flex flex-wrap gap-1 justify-end">
          {event.isFree && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
              Free
            </span>
          )}
          {event.culturalCredit && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
              Cultural Credit
            </span>
          )}
          {event.isTonight && (
            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
              Tonight
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3">{event.host}</p>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>
            {event.date} at {event.time}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span>
            {event.location} • {event.distance}
          </span>
        </div>
        {!event.isFree && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <DollarSign className="w-4 h-4 flex-shrink-0" />
            <span>{event.cost}</span>
          </div>
        )}
      </div>
    </div>
  );
}
