import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { Event } from "../types/models";
import { mockTags, mockLocations } from "../data/mockData";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { Calendar, MapPin, DollarSign, Award, Search, Filter, X } from "lucide-react";
import { format } from "date-fns";

export default function EventFeed() {
  const { eventService, filterCriteria, setFilterCriteria } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  // Apply filters and sorting
  useEffect(() => {
    let events = eventService.getApprovedEvents();
    
    // Apply filter criteria
    events = eventService.applyFilters(filterCriteria);
    
    // Apply search query
    if (searchQuery.trim()) {
      events = events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.hostName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort chronologically (FR-03)
    events = eventService.sortChronologically(events);
    
    setFilteredEvents(events);
  }, [filterCriteria, searchQuery, eventService]);

  const toggleTag = (tagName: string) => {
    const newTags = filterCriteria.tags.includes(tagName)
      ? filterCriteria.tags.filter((t) => t !== tagName)
      : [...filterCriteria.tags, tagName];
    
    setFilterCriteria({ ...filterCriteria, tags: newTags });
  };

  const toggleLocation = (locationName: string) => {
    const newLocations = filterCriteria.locations.includes(locationName)
      ? filterCriteria.locations.filter((l) => l !== locationName)
      : [...filterCriteria.locations, locationName];
    
    setFilterCriteria({ ...filterCriteria, locations: newLocations });
  };

  const clearFilters = () => {
    setFilterCriteria({
      tags: [],
      locations: [],
      costFilter: "any",
      creditFilter: "any",
    });
    setSearchQuery("");
  };

  const hasActiveFilters =
    filterCriteria.tags.length > 0 ||
    filterCriteria.locations.length > 0 ||
    filterCriteria.costFilter !== "any" ||
    filterCriteria.creditFilter !== "any" ||
    searchQuery.trim() !== "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Campus Events</h1>
        <p className="text-gray-600">Discover and explore upcoming events on campus</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter Events</CardTitle>
              <CardDescription>
                Refine your search to find the perfect event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tags Filter */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {mockTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={filterCriteria.tags.includes(tag.name) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag.name)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Location Filter */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Locations</Label>
                <div className="space-y-2">
                  {mockLocations.map((location) => (
                    <div key={location.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={location.id}
                        checked={filterCriteria.locations.includes(location.name)}
                        onCheckedChange={() => toggleLocation(location.name)}
                      />
                      <Label htmlFor={location.id} className="cursor-pointer">
                        {location.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Cost Filter */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Cost</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cost-any"
                      checked={filterCriteria.costFilter === "any"}
                      onCheckedChange={() =>
                        setFilterCriteria({ ...filterCriteria, costFilter: "any" })
                      }
                    />
                    <Label htmlFor="cost-any" className="cursor-pointer">
                      All Events
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="cost-free"
                      checked={filterCriteria.costFilter === "free"}
                      onCheckedChange={() =>
                        setFilterCriteria({ ...filterCriteria, costFilter: "free" })
                      }
                    />
                    <Label htmlFor="cost-free" className="cursor-pointer">
                      Free Events Only
                    </Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Cultural Credit Filter */}
              <div>
                <Label className="text-sm font-semibold mb-3 block">Cultural Credit</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="credit-any"
                      checked={filterCriteria.creditFilter === "any"}
                      onCheckedChange={() =>
                        setFilterCriteria({ ...filterCriteria, creditFilter: "any" })
                      }
                    />
                    <Label htmlFor="credit-any" className="cursor-pointer">
                      All Events
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="credit-eligible"
                      checked={filterCriteria.creditFilter === "eligible"}
                      onCheckedChange={() =>
                        setFilterCriteria({ ...filterCriteria, creditFilter: "eligible" })
                      }
                    />
                    <Label htmlFor="credit-eligible" className="cursor-pointer">
                      Credit Eligible Only
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"}
        </p>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No events found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search query
          </p>
          {hasActiveFilters && (
            <Button onClick={clearFilters}>Clear all filters</Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                  {event.creditEligible && (
                    <Award className="w-5 h-5 text-yellow-500 flex-shrink-0 ml-2" />
                  )}
                </div>
                <CardDescription className="text-sm">{event.hostName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{format(new Date(event.datetime), "MMM d, yyyy 'at' h:mm a")}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{event.location.name}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{event.cost === 0 ? "Free" : `$${event.cost}`}</span>
                  </div>
                </div>

                {event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {event.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                    {event.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{event.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}