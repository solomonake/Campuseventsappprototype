import { useNavigate } from "react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface UserStory {
  id: string;
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
}

const userStories: UserStory[] = [
  {
    id: "US1",
    title: "Easy Login (SSO + NFC)",
    asA: "UVA Wise student",
    iWant: "to quickly log in using my university SSO or tap my student ID via NFC",
    soThat: "I can access the app instantly without creating a new account",
    acceptanceCriteria: [
      "SSO button integrates with UVA authentication system",
      "NFC option is available and clearly labeled for supported devices",
      "Login completes within 3 seconds for SSO",
      "User is redirected to home feed after successful authentication",
      "Error messages are clear if authentication fails",
    ],
  },
  {
    id: "US2",
    title: "Browse Upcoming Events",
    asA: "student looking for things to do",
    iWant: "to see a scrollable feed of upcoming campus events with key details visible at a glance",
    soThat: "I can quickly discover events that interest me without extensive searching",
    acceptanceCriteria: [
      "Events are displayed in chronological order by default",
      "Each event card shows: title, host, date/time, location, distance, and cost",
      "Event badges (Free, Cultural Credit, Tonight) are prominently displayed",
      "Feed loads within 2 seconds",
      "User can scroll through at least 10+ events",
      "Tapping an event card navigates to the event detail page",
    ],
  },
  {
    id: "US3",
    title: "Filter Events",
    asA: "student with specific preferences",
    iWant: "to filter events by criteria like free admission, distance from me, and cultural credit eligibility",
    soThat: "I can find events that fit my budget, location, and academic needs",
    acceptanceCriteria: [
      "Filter panel is accessible from the home feed via a clear button/icon",
      "Filters include: Free/Paid, Distance range, Cultural Credit, Event category",
      "Multiple filters can be applied simultaneously",
      "Filter results update in real-time as selections change",
      "Active filters are visually indicated on the home screen",
      "User can clear all filters with one tap",
    ],
  },
  {
    id: "US4",
    title: "View Event Details",
    asA: "student interested in a specific event",
    iWant: "to see comprehensive information including time, location, cultural credit status, and description",
    soThat: "I can decide if I want to attend and have all the information I need",
    acceptanceCriteria: [
      "Event detail page shows: full description, host/organizer, precise date/time, location name and address",
      "Cultural credit badge is clearly displayed if applicable",
      "Cost information is prominent",
      "Action buttons available: Save, Share, Get Directions",
      "Related events or similar events are suggested at the bottom",
      "Back button returns to previous screen",
    ],
  },
  {
    id: "US5",
    title: "Map & Directions",
    asA: "student who needs to find an event location",
    iWant: "to see the event location on a map and get walking/driving directions",
    soThat: "I can easily navigate to the event without getting lost",
    acceptanceCriteria: [
      "Map view displays event location with a clear pin/marker",
      "Map shows user's current location (with permission)",
      "Distance from current location is displayed",
      "\"Get Directions\" button opens preferred maps app (Google Maps/Apple Maps)",
      "Map is interactive (zoom, pan) but loads quickly",
      "Works in both standalone map view and event detail page",
    ],
  },
  {
    id: "US6",
    title: "Staff/Club Event Creation & Management",
    asA: "staff member or club organizer",
    iWant: "to create and manage event listings with all necessary details and publish them to students",
    soThat: "I can promote events to the student body and track engagement",
    acceptanceCriteria: [
      "Create event form includes: title, description, date/time picker, location picker, cost, category tags",
      "Cultural credit toggle is available for eligible events",
      "Draft events can be saved and edited before publishing",
      "Published events appear in student feed immediately",
      "Staff can view a list of their created events",
      "Edit/delete options available for event creators",
      "Form validates required fields before submission",
    ],
  },
];

export function UserStoriesScreen() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Campus Events @ UVA Wise
          </h1>
          <p className="text-gray-600 text-lg">
            User Story Board - Prototype Documentation
          </p>
          
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => navigate("/storyboard")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              View Storyboard Flow
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-900 transition-colors"
            >
              View Wireframes
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {userStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium mb-2">
                    {story.id}
                  </span>
                  <h3 className="text-xl font-bold">{story.title}</h3>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <p className="text-gray-700">
                  <span className="font-semibold">As a</span> {story.asA},
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">I want</span> {story.iWant},
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">So that</span> {story.soThat}.
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-semibold mb-3 text-gray-900">
                  Acceptance Criteria:
                </h4>
                <ul className="space-y-2">
                  {story.acceptanceCriteria.map((criteria, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg border-2 border-gray-200 p-6">
          <h2 className="text-2xl font-bold mb-4">Design Principles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-blue-600">Low Effort</h3>
              <p className="text-sm text-gray-700">
                Quick login, minimal taps to find events, clear information hierarchy
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-blue-600">Save Time & Money</h3>
              <p className="text-sm text-gray-700">
                Prominent free event badges, distance filters, cultural credit indicators
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-blue-600">Fun & Engaging</h3>
              <p className="text-sm text-gray-700">
                Visual event cards, tonight badges, easy sharing, map integration
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
