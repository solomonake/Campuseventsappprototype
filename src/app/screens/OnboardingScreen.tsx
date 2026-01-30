import { useState } from "react";
import { useNavigate } from "react-router";
import { Bell, BellOff, Music, Palette, Users, Briefcase, Heart, Dumbbell } from "lucide-react";

const interestOptions = [
  { id: "music", label: "Music & Concerts", icon: Music },
  { id: "arts", label: "Arts & Culture", icon: Palette },
  { id: "social", label: "Social Events", icon: Users },
  { id: "career", label: "Career & Professional", icon: Briefcase },
  { id: "wellness", label: "Health & Wellness", icon: Heart },
  { id: "sports", label: "Sports & Recreation", icon: Dumbbell },
];

export function OnboardingScreen() {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [notifications, setNotifications] = useState(true);
  const [culturalCredit, setCulturalCredit] = useState(true);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="wireframe-container min-h-screen bg-white flex flex-col">
      {/* Screen Label */}
      <div className="bg-gray-800 text-white px-4 py-2 text-sm font-mono">
        Onboarding - Preferences
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Personalize Your Feed</h1>
          <p className="text-gray-600">
            Help us show you the most relevant events
          </p>
        </div>

        {/* Interests */}
        <div className="mb-8">
          <h2 className="font-semibold mb-3">What interests you?</h2>
          <p className="text-sm text-gray-600 mb-4">Select all that apply</p>
          <div className="grid grid-cols-2 gap-3">
            {interestOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedInterests.includes(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => toggleInterest(option.id)}
                  className={`p-4 rounded-xl border-2 tap-target text-left transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 mb-2 ${isSelected ? "text-blue-600" : "text-gray-600"}`}
                  />
                  <p className="text-sm font-medium">{option.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="mb-8">
          <h2 className="font-semibold mb-3">Preferences</h2>
          <div className="space-y-3">
            <button
              onClick={() => setNotifications(!notifications)}
              className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-300 bg-white tap-target"
            >
              <div className="flex items-center gap-3">
                {notifications ? (
                  <Bell className="w-5 h-5 text-blue-600" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-400" />
                )}
                <div className="text-left">
                  <p className="font-medium">Event Notifications</p>
                  <p className="text-sm text-gray-600">
                    Get notified about new events
                  </p>
                </div>
              </div>
              <div
                className={`w-12 h-7 rounded-full transition-colors ${
                  notifications ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full mt-1 transition-transform ${
                    notifications ? "ml-6" : "ml-1"
                  }`}
                />
              </div>
            </button>

            <button
              onClick={() => setCulturalCredit(!culturalCredit)}
              className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-300 bg-white tap-target"
            >
              <div className="text-left">
                <p className="font-medium">Highlight Cultural Credit Events</p>
                <p className="text-sm text-gray-600">
                  Show badge for eligible events
                </p>
              </div>
              <div
                className={`w-12 h-7 rounded-full transition-colors ${
                  culturalCredit ? "bg-purple-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full mt-1 transition-transform ${
                    culturalCredit ? "ml-6" : "ml-1"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate("/home")}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold tap-target hover:bg-blue-700 transition-colors"
        >
          Get Started
        </button>

        <button
          onClick={() => navigate("/home")}
          className="w-full text-gray-600 py-3 text-sm mt-3 tap-target"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
