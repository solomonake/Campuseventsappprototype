import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { Event, Tag } from "../types/models";
import { mockLocations, mockTags } from "../data/mockData";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import { Alert, AlertDescription } from "../components/ui/alert";
import { ArrowLeft, Save, Send, AlertCircle } from "lucide-react";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { eventService, refreshEvents } = useApp();
  const { user } = useAuth();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [datetime, setDatetime] = useState("");
  const [locationId, setLocationId] = useState("");
  const [cost, setCost] = useState("0");
  const [capacity, setCapacity] = useState("");
  const [creditEligible, setCreditEligible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  // Redirect if not staff
  useEffect(() => {
    if (user?.role !== "staff") {
      navigate("/events");
    }
  }, [user, navigate]);

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const validate = (): boolean => {
    const newErrors: string[] = [];

    if (!title.trim()) newErrors.push("Event title is required");
    if (!description.trim()) newErrors.push("Event description is required");
    if (!datetime) newErrors.push("Event date and time is required");
    if (!locationId) newErrors.push("Event location is required");
    if (isNaN(parseFloat(cost)) || parseFloat(cost) < 0) newErrors.push("Valid cost is required");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (status: "draft" | "pending") => {
    if (!validate()) return;
    setSuccess(false);

    const selectedLocation = mockLocations.find((l) => l.id === locationId);
    if (!selectedLocation) return;

    const selectedTagObjects: Tag[] = selectedTags
      .map((tagName) => mockTags.find((t) => t.name === tagName))
      .filter((tag): tag is Tag => tag !== undefined);

    const newEvent: Event = {
      id: `evt-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      datetime,
      location: selectedLocation,
      cost: parseFloat(cost),
      creditEligible,
      status,
      hostUserId: user!.id,
      hostName: user!.name,
      tags: selectedTagObjects,
      capacity: capacity ? parseInt(capacity) : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    eventService.createEvent(newEvent);
    refreshEvents();
    setSuccess(true);

    if (status === "pending") {
      setTimeout(() => {
        navigate("/events");
      }, 1500);
    }
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
          <CardTitle className="text-2xl">Create New Event</CardTitle>
          <CardDescription>
            Fill out the details below to create a new campus event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  Event created successfully and submitted for approval!
                </AlertDescription>
              </Alert>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Spring Concert"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of the event..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            {/* Date and Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="datetime">Date & Time *</Label>
                <Input
                  id="datetime"
                  type="datetime-local"
                  value={datetime}
                  onChange={(e) => setDatetime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Select value={locationId} onValueChange={setLocationId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLocations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Cost and Capacity */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Cost ($) *</Label>
                <Input
                  id="cost"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
                <p className="text-xs text-gray-500">Enter 0 for free events</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (Optional)</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  placeholder="e.g., 100"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>
            </div>

            {/* Cultural Credit */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="credit"
                checked={creditEligible}
                onCheckedChange={(checked) => setCreditEligible(checked as boolean)}
              />
              <Label htmlFor="credit" className="cursor-pointer">
                This event is eligible for cultural credit
              </Label>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <p className="text-sm text-gray-500 mb-2">
                Select all tags that apply to this event
              </p>
              <div className="flex flex-wrap gap-2">
                {mockTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag.name)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmit("draft")}
              >
                <Save className="w-4 h-4 mr-2" />
                Save as Draft
              </Button>
              <Button
                type="button"
                onClick={() => handleSubmit("pending")}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit for Approval
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              * Required fields. Events must be approved by an administrator before appearing in the public feed.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}