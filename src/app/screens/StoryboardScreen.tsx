import { useNavigate } from "react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StoryboardFrame {
  number: number;
  label: string;
  screen: string;
  userAction: string;
  userThought: string;
  transition: string;
}

const storyboardFrames: StoryboardFrame[] = [
  {
    number: 1,
    label: "L1 - Login",
    screen: "Welcome/Login Screen",
    userAction: "Alex opens the app and taps 'Login with UVA SSO'",
    userThought: "Great, I don't need another password. This should be quick.",
    transition: "SSO authentication completes → Onboarding (first-time) or Home Feed",
  },
  {
    number: 2,
    label: "H1 - Events Feed",
    screen: "Home Events Feed",
    userAction: "Alex scrolls through upcoming events, notices a 'Free' and 'Tonight' badge on a concert",
    userThought: "A free concert tonight? Perfect! But I wonder what else is free this weekend...",
    transition: "Alex taps the Filter icon → Opens Filter Panel",
  },
  {
    number: 3,
    label: "F1 - Filters",
    screen: "Filter Panel (Sheet)",
    userAction: "Alex selects 'Free' and 'This Weekend' filters, then taps 'Apply'",
    userThought: "I'm broke and have free time Saturday. Let me see what's available.",
    transition: "Filter panel closes → Home Feed updates with filtered results",
  },
  {
    number: 4,
    label: "E1 - Event Detail",
    screen: "Event Detail Page",
    userAction: "Alex taps on 'International Food Festival', reads description, sees Cultural Credit badge",
    userThought: "Free food AND cultural credit? I need to go. But where exactly is the Quad Lawn?",
    transition: "Alex taps 'Get Directions' button → Opens Map View",
  },
  {
    number: 5,
    label: "M1 - Map",
    screen: "Map View",
    userAction: "Alex views the event location on map, sees it's 0.3 mi away (5 min walk)",
    userThought: "Oh that's super close to my dorm! I can walk there easily.",
    transition: "Alex taps 'Save Event' → Returns to Event Detail, event is saved",
  },
  {
    number: 6,
    label: "E1 - Check-in Info",
    screen: "Event Detail (Cultural Credit Section)",
    userAction: "Alex scrolls to cultural credit information, notes the check-in QR code requirement",
    userThought: "I need to scan the QR code when I arrive to get credit. Easy enough!",
    transition: "Alex taps 'Share' to invite friends → Share sheet opens",
  },
];

export function StoryboardScreen() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to User Stories
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Student Journey Storyboard
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Following Alex, a UVA Wise student looking for free weekend events
          </p>
          
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            View Interactive Wireframes
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-8">
          {storyboardFrames.map((frame, index) => (
            <div key={frame.number}>
              <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                <div className="bg-blue-600 text-white px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">
                      {frame.number}
                    </span>
                    <div>
                      <h3 className="font-bold text-lg">{frame.label}</h3>
                      <p className="text-blue-100 text-sm">{frame.screen}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm uppercase text-gray-500">
                        User Action
                      </h4>
                      <p className="text-gray-900 mb-4">{frame.userAction}</p>

                      <h4 className="font-semibold mb-2 text-sm uppercase text-gray-500">
                        User Thought
                      </h4>
                      <p className="text-gray-700 italic bg-gray-50 p-3 rounded-lg border border-gray-200">
                        "{frame.userThought}"
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold mb-2 text-sm uppercase text-blue-900">
                        Transition
                      </h4>
                      <p className="text-blue-900">{frame.transition}</p>
                    </div>
                  </div>
                </div>
              </div>

              {index < storyboardFrames.length - 1 && (
                <div className="flex justify-center py-4">
                  <ArrowRight className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-4">Journey Insights</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-green-600">Pain Points Solved</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• No need to create new account (SSO)</li>
                <li>• Quick discovery of free events</li>
                <li>• Clear distance/location info</li>
                <li>• Cultural credit visibility</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-blue-600">Key Interactions</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Badge-based scanning (visual cues)</li>
                <li>• Filter-driven discovery</li>
                <li>• Map integration for wayfinding</li>
                <li>• Social sharing capability</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-purple-600">Engagement Drivers</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Real-time "Tonight" indicators</li>
                <li>• Free event prominence</li>
                <li>• Academic benefit (credit)</li>
                <li>• Low-friction save/share</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
