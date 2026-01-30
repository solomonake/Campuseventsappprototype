import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { BottomNav } from "@/app/components/BottomNav";
import { EventCard } from "@/app/components/EventCard";
import { mockEvents } from "@/app/data/mockEvents";

export function HomeFeedScreen() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    free: false,
    culturalCredit: false,
    nearby: false,
  });

  const tabs = [
    { id: "all", label: "All Events" },
    { id: "today", label: "Today" },
    { id: "weekend", label: "Weekend" },
    { id: "free", label: "Free" },
  ];

  // Apply filters
  let filteredEvents = mockEvents;
  if (filters.free) {
    filteredEvents = filteredEvents.filter((e) => e.isFree);
  }
  if (filters.culturalCredit) {
    filteredEvents = filteredEvents.filter((e) => e.culturalCredit);
  }
  if (searchQuery) {
    filteredEvents = filteredEvents.filter(
      (e) =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.host.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const activeFilterCount =
    Object.values(filters).filter(Boolean).length;

  return (
    <div className="wireframe-container min-h-screen bg-gray-50">
      {/* Screen Label */}
      <div className="bg-gray-800 text-white px-4 py-2 text-sm font-mono flex items-center justify-between">
        <span>H1 - Home Feed</span>
        {activeFilterCount > 0 && (
          <span className="bg-blue-600 px-2 py-0.5 rounded-full text-xs">
            {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Top Bar */}
      <div className="bg-white border-b border-gray-300 px-4 py-3">
        <h1 className="text-xl font-bold mb-3">Campus Events</h1>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 tap-target"
                aria-label="Clear search"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl border tap-target transition-colors ${
              activeFilterCount > 0
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white border-gray-300 text-gray-900"
            }`}
            aria-label="Filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Date Tabs */}
      <div className="bg-white border-b border-gray-300 px-4 overflow-x-auto">
        <div className="flex gap-2 py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors tap-target ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-blue-50 border-b-2 border-blue-200 px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Filters</h3>
            <button
              onClick={() =>
                setFilters({ free: false, culturalCredit: false, nearby: false })
              }
              className="text-sm text-blue-600 tap-target"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilters({ ...filters, free: !filters.free })}
              className={`px-4 py-2 rounded-full text-sm font-medium tap-target transition-colors ${
                filters.free
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-900 border border-gray-300"
              }`}
            >
              Free Events
            </button>
            <button
              onClick={() =>
                setFilters({
                  ...filters,
                  culturalCredit: !filters.culturalCredit,
                })
              }
              className={`px-4 py-2 rounded-full text-sm font-medium tap-target transition-colors ${
                filters.culturalCredit
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-900 border border-gray-300"
              }`}
            >
              Cultural Credit
            </button>
            <button
              onClick={() =>
                setFilters({ ...filters, nearby: !filters.nearby })
              }
              className={`px-4 py-2 rounded-full text-sm font-medium tap-target transition-colors ${
                filters.nearby
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-900 border border-gray-300"
              }`}
            >
              Near Me ({"<"}0.5 mi)
            </button>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="screen-content px-4 py-4 space-y-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No events found</p>
            <button
              onClick={() => {
                setFilters({ free: false, culturalCredit: false, nearby: false });
                setSearchQuery("");
              }}
              className="text-blue-600 mt-2 tap-target"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
