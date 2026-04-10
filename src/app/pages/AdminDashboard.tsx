import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { Event } from "../types/models";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Alert, AlertDescription } from "../components/ui/alert";
import { ScrollArea } from "../components/ui/scroll-area";
import { Calendar, MapPin, DollarSign, Award, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { eventService, approvalService, refreshEvents } = useApp();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [approvedEvents, setApprovedEvents] = useState<Event[]>([]);
  const [rejectedEvents, setRejectedEvents] = useState<Event[]>([]);

  // Redirect if not administrator
  useEffect(() => {
    if (user?.role !== "administrator") {
      navigate("/events");
    }
  }, [user, navigate]);

  useEffect(() => {
    loadEvents();
  }, [eventService]);

  const loadEvents = () => {
    setPendingEvents(eventService.getEventsByStatus("pending"));
    setApprovedEvents(eventService.getEventsByStatus("approved"));
    setRejectedEvents(eventService.getEventsByStatus("rejected"));
  };

  const handleApprove = (eventId: string) => {
    const success = approvalService.approveEvent(eventId);
    if (success) {
      toast.success("Event approved successfully");
      loadEvents();
      refreshEvents();
    } else {
      toast.error("Failed to approve event");
    }
  };

  const handleReject = (eventId: string) => {
    const success = approvalService.rejectEvent(eventId);
    if (success) {
      toast.success("Event rejected");
      loadEvents();
      refreshEvents();
    } else {
      toast.error("Failed to reject event");
    }
  };

  const EventCard = ({ event, showActions = false }: { event: Event; showActions?: boolean }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{event.title}</CardTitle>
              {event.creditEligible && (
                <Award className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            <CardDescription className="text-sm">
              Hosted by {event.hostName}
            </CardDescription>
          </div>
          <Badge variant={
            event.status === "pending" ? "default" :
            event.status === "approved" ? "secondary" :
            "destructive"
          }>
            {event.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">
              {format(new Date(event.datetime), "MMM d, yyyy")}
            </span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{format(new Date(event.datetime), "h:mm a")}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{event.location.name}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{event.cost === 0 ? "Free" : `$${event.cost}`}</span>
          </div>
        </div>

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {event.tags.map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => handleApprove(event.id)}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleReject(event.id)}
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Reject
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500 pt-2 border-t">
          Created: {format(new Date(event.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Administrator Dashboard</h1>
        <p className="text-gray-600">Review and manage event approvals</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Approval Queue</CardTitle>
          <CardDescription>
            Review pending events and manage approved/rejected events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pending ({pendingEvents.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedEvents.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({rejectedEvents.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-4">
              {pendingEvents.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No events pending approval at this time.
                  </AlertDescription>
                </Alert>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  {pendingEvents.map((event) => (
                    <EventCard key={event.id} event={event} showActions />
                  ))}
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="approved" className="mt-4">
              {approvedEvents.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No approved events to display.
                  </AlertDescription>
                </Alert>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  {approvedEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="mt-4">
              {rejectedEvents.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No rejected events to display.
                  </AlertDescription>
                </Alert>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  {rejectedEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}