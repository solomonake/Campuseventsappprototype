import { useState } from "react";
import { useNavigate } from "react-router";
import { TopAppBar } from "@/app/components/TopAppBar";
import { BottomNav } from "@/app/components/BottomNav";
import { Plus, Edit2, Eye, BarChart3, Users, LogOut } from "lucide-react";
import { mockEvents } from "@/app/data/mockEvents";

export function StaffDashboardScreen() {
  const navigate = useNavigate();
  // Mock: staff has created first 3 events
  const myEvents = mockEvents.slice(0, 3);
  const [selectedTab, setSelectedTab] = useState<"active" | "draft">("active");

  const handleLogout = () => {
    // Clear any authentication state (localStorage, sessionStorage, etc.)
    // For this prototype, we'll just navigate to login
    localStorage.removeItem("userAuthenticated");
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="wireframe-container min-h-screen bg-gray-50">
      {/* Screen Label */}
      <div className="bg-gray-800 text-white px-4 py-2 text-sm font-mono">
        A1 - Staff Dashboard
      </div>

      <TopAppBar title="Event Management" />

      {/* Profile/Account Section */}
      <div className="bg-white border-b border-gray-300 px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-lg">Staff Account</h2>
            <p className="text-sm text-gray-600">Event Manager</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 py-3 px-4 rounded-lg font-medium tap-target hover:bg-red-100 transition-colors flex items-center justify-center gap-2 border border-red-200"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>

      {/* Stats Overview */}
      <div className="bg-white border-b border-gray-300 px-4 py-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{myEvents.length}</p>
            <p className="text-xs text-gray-600">Active Events</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">247</p>
            <p className="text-xs text-gray-600">Total Views</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">89</p>
            <p className="text-xs text-gray-600">Saved</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-4 py-4">
        <button
          onClick={() => navigate("/staff/create")}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold tap-target hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Event
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedTab("active")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium tap-target transition-colors ${
              selectedTab === "active"
                ? "bg-white border-2 border-blue-600 text-blue-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Active ({myEvents.length})
          </button>
          <button
            onClick={() => setSelectedTab("draft")}
            className={`flex-1 py-2 px-4 rounded-lg font-medium tap-target transition-colors ${
              selectedTab === "draft"
                ? "bg-white border-2 border-blue-600 text-blue-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Drafts (0)
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="screen-content px-4 space-y-3 pb-4">
        {selectedTab === "active" &&
          myEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl border border-gray-300 p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {event.date} at {event.time}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {event.isFree && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                        Free
                      </span>
                    )}
                    {event.culturalCredit && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                        Cultural Credit
                      </span>
                    )}
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                      Published
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-4 mb-3 py-3 border-y border-gray-200">
                <div className="flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">
                    {Math.floor(Math.random() * 100 + 20)}
                  </span>
                  <span className="text-gray-600">views</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">
                    {Math.floor(Math.random() * 50 + 10)}
                  </span>
                  <span className="text-gray-600">saved</span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate(`/staff/edit/${event.id}`)}
                  className="py-2 px-4 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium tap-target hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => navigate(`/event/${event.id}`)}
                  className="py-2 px-4 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium tap-target hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 border border-blue-200"
                >
                  <BarChart3 className="w-4 h-4" />
                  View Stats
                </button>
              </div>
            </div>
          ))}

        {selectedTab === "draft" && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-sm">No draft events</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}