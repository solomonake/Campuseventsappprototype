import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { TopAppBar } from "@/app/components/TopAppBar";
import { Calendar, MapPin, DollarSign, Tag, Award, Save } from "lucide-react";
import { mockEvents } from "@/app/data/mockEvents";

export function CreateEventScreen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const existingEvent = id ? mockEvents.find((e) => e.id === id) : null;

  const [formData, setFormData] = useState({
    title: existingEvent?.title || "",
    host: existingEvent?.host || "",
    description: existingEvent?.description || "",
    date: "2026-02-15",
    time: existingEvent?.time || "14:00",
    location: existingEvent?.location || "",
    cost: existingEvent?.cost || "Free",
    isFree: existingEvent?.isFree ?? true,
    culturalCredit: existingEvent?.culturalCredit ?? false,
    category: existingEvent?.category || "Social",
  });

  const categories = [
    "Music",
    "Arts",
    "Sports",
    "Career",
    "Cultural",
    "Social",
    "Academic",
    "Outdoor",
    "Wellness",
  ];

  const handleSubmit = (status: "draft" | "publish") => {
    // Mock save
    console.log("Saving event:", { ...formData, status });
    navigate("/staff");
  };

  return (
    <div className="wireframe-container min-h-screen bg-gray-50">
      {/* Screen Label */}
      <div className="bg-gray-800 text-white px-4 py-2 text-sm font-mono">
        A2 - {isEditing ? "Edit" : "Create"} Event
      </div>

      <TopAppBar
        title={isEditing ? "Edit Event" : "Create Event"}
        showBack
        onBack={() => navigate("/staff")}
      />

      <div className="px-4 py-4 pb-20 space-y-4">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-300 p-4">
          <h3 className="font-semibold mb-4">Basic Information</h3>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Event Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g., Spring Concert Series"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="host" className="block text-sm font-medium mb-2">
                Host/Organizer *
              </label>
              <input
                id="host"
                type="text"
                value={formData.host}
                onChange={(e) =>
                  setFormData({ ...formData, host: e.target.value })
                }
                placeholder="e.g., Student Activities Board"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe the event, what to expect, what to bring..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-white rounded-xl border border-gray-300 p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Date & Time
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-2">
                Date *
              </label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium mb-2">
                Time *
              </label>
              <input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl border border-gray-300 p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Location
          </h3>

          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2">
              Venue/Building *
            </label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g., Student Center Auditorium"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-2">
              This will be shown on the campus map
            </p>
          </div>
        </div>

        {/* Cost */}
        <div className="bg-white rounded-xl border border-gray-300 p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Cost
          </h3>

          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setFormData({ ...formData, isFree: true })}
                className={`flex-1 py-3 px-4 rounded-lg font-medium tap-target transition-colors ${
                  formData.isFree
                    ? "bg-green-100 text-green-800 border-2 border-green-600"
                    : "bg-gray-100 text-gray-700 border border-gray-300"
                }`}
              >
                Free Event
              </button>
              <button
                onClick={() =>
                  setFormData({ ...formData, isFree: false, cost: "$5" })
                }
                className={`flex-1 py-3 px-4 rounded-lg font-medium tap-target transition-colors ${
                  !formData.isFree
                    ? "bg-blue-100 text-blue-800 border-2 border-blue-600"
                    : "bg-gray-100 text-gray-700 border border-gray-300"
                }`}
              >
                Paid Event
              </button>
            </div>

            {!formData.isFree && (
              <div>
                <label htmlFor="cost" className="block text-sm font-medium mb-2">
                  Ticket Price
                </label>
                <input
                  id="cost"
                  type="text"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
                  }
                  placeholder="e.g., $5 students, $10 general"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>

        {/* Category & Tags */}
        <div className="bg-white rounded-xl border border-gray-300 p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Category
          </h3>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFormData({ ...formData, category: cat })}
                className={`px-4 py-2 rounded-full text-sm font-medium tap-target transition-colors ${
                  formData.category === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 border border-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Cultural Credit */}
        <div className="bg-white rounded-xl border border-gray-300 p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Cultural Credit
          </h3>

          <button
            onClick={() =>
              setFormData({
                ...formData,
                culturalCredit: !formData.culturalCredit,
              })
            }
            className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-300 bg-gray-50 tap-target"
          >
            <div className="text-left">
              <p className="font-medium">
                This event qualifies for Cultural Credit
              </p>
              <p className="text-sm text-gray-600">
                QR code will be generated for check-in
              </p>
            </div>
            <div
              className={`w-12 h-7 rounded-full transition-colors ${
                formData.culturalCredit ? "bg-purple-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full mt-1 transition-transform ${
                  formData.culturalCredit ? "ml-6" : "ml-1"
                }`}
              />
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => handleSubmit("publish")}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold tap-target hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isEditing ? "Save Changes" : "Publish Event"}
          </button>
          <button
            onClick={() => handleSubmit("draft")}
            className="w-full bg-white text-gray-900 py-4 px-6 rounded-xl font-semibold tap-target border-2 border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Save as Draft
          </button>
          <button
            onClick={() => navigate("/staff")}
            className="w-full text-gray-600 py-3 text-sm tap-target"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
