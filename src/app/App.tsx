import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { LoginScreen } from "@/app/screens/LoginScreen";
import { OnboardingScreen } from "@/app/screens/OnboardingScreen";
import { HomeFeedScreen } from "@/app/screens/HomeFeedScreen";
import { EventDetailScreen } from "@/app/screens/EventDetailScreen";
import { MapScreen } from "@/app/screens/MapScreen";
import { SavedEventsScreen } from "@/app/screens/SavedEventsScreen";
import { StaffDashboardScreen } from "@/app/screens/StaffDashboardScreen";
import { CreateEventScreen } from "@/app/screens/CreateEventScreen";
import { UserStoriesScreen } from "@/app/screens/UserStoriesScreen";
import { StoryboardScreen } from "@/app/screens/StoryboardScreen";

function Root() {
  return <Outlet />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <UserStoriesScreen /> },
      { path: "storyboard", element: <StoryboardScreen /> },
      { path: "login", element: <LoginScreen /> },
      { path: "onboarding", element: <OnboardingScreen /> },
      { path: "home", element: <HomeFeedScreen /> },
      { path: "event/:id", element: <EventDetailScreen /> },
      { path: "map", element: <MapScreen /> },
      { path: "saved", element: <SavedEventsScreen /> },
      { path: "staff", element: <StaffDashboardScreen /> },
      { path: "staff/create", element: <CreateEventScreen /> },
      { path: "staff/edit/:id", element: <CreateEventScreen /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
