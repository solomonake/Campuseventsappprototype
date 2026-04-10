import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { NFCCheckIn } from "../components/NFCCheckIn";
import {
  Calendar,
  MapPin,
  DollarSign,
  Award,
  User,
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  Users,
} from "lucide-react";
import { format } from "date-fns";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { eventService, checkInService } = useApp();
  const { user } = useAuth();
  const [checkInSuccess, setCheckInSuccess] = useState(false);

  const event = eventService.getEventById(id || "");
  const existingCheckIn = user ? checkInService.getCheckIn(id || "", user.id) : null;

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/events")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>
      </div>
    );
  }

  const handlePrimaryCheckIn = () => {
    if (!user) return;

    const checkIn = checkInService.checkIn(event.id, user.id);
    if (checkIn) {
      setCheckInSuccess(true);
    }
  };

  const openDirections = () => {
    const { lat, lng } = event.location.coordinates;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/events")}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Events
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-3xl">{event.title}</CardTitle>
                {event.creditEligible && (
                  <Award className="w-6 h-6 text-yellow-500" title="Cultural Credit Eligible" />
                )}
              </div>
              <CardDescription className="text-base flex items-center gap-2">
                <User className="w-4 h-4" />
                Hosted by {event.hostName}
              </CardDescription>
            </div>
            {event.capacity && (
              <Badge variant="outline" className="ml-4">
                <Users className="w-3 h-3 mr-1" />
                Capacity: {event.capacity}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">About This Event</h3>
            <p className="text-gray-700">{event.description}</p>
          </div>

          <Separator />

          {/* Event Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm text-gray-500">Date & Time</p>
                  <p>{format(new Date(event.datetime), "EEEE, MMMM d, yyyy")}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(event.datetime), "h:mm a")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm text-gray-500">Cost</p>
                  <p>{event.cost === 0 ? "Free" : `$${event.cost}`}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-500">Location</p>
                  <p>{event.location.name}</p>
                  {event.location.accessibilityInfo && (
                    <p className="text-sm text-gray-600">{event.location.accessibilityInfo}</p>
                  )}
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto mt-1"
                    onClick={openDirections}
                  >
                    Get Directions
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>

              {event.creditEligible && (
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-gray-500">Cultural Credit</p>
                    <p className="text-sm">This event is eligible for cultural credit</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {event.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Check-in Section (Students Only) */}
          {user?.role === "student" && (
            <>
              <Separator />
              
              {/* NFC Check-In Component */}
              <NFCCheckIn 
                event={event}
                onCheckIn={handlePrimaryCheckIn}
                isCheckedIn={!!existingCheckIn || checkInSuccess}
              />
              
              {/* Show check-in confirmation if already checked in */}
              {existingCheckIn && (
                <Alert className="bg-green-50 border-green-200 mt-4">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    You checked in to this event on{" "}
                    {format(new Date(existingCheckIn.timestamp), "MMM d, yyyy 'at' h:mm a")}
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}