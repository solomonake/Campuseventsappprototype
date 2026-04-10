import { RouterProvider, createBrowserRouter } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import { Toaster } from "./components/ui/sonner";
import Root from "./pages/Root";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EventFeed from "./pages/EventFeed";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import AdminDashboard from "./pages/AdminDashboard";
import MapView from "./pages/MapView";
import AccountSettings from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Login },
      { path: "signup", Component: Signup },
      { path: "events", Component: EventFeed },
      { path: "events/:id", Component: EventDetail },
      { path: "create-event", Component: CreateEvent },
      { path: "admin", Component: AdminDashboard },
      { path: "map", Component: MapView },
      { path: "settings", Component: AccountSettings },
      { path: "*", Component: NotFound },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </AppProvider>
    </AuthProvider>
  );
}