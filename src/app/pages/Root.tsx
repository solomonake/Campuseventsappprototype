import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { LogOut, Calendar, Map, PlusCircle, Shield, Settings } from "lucide-react";

export default function Root() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if not authenticated (except on login and signup pages)
  useEffect(() => {
    if (!isAuthenticated && location.pathname !== "/" && location.pathname !== "/signup") {
      navigate("/");
    }
  }, [isAuthenticated, location.pathname, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Don't show navigation on login or signup pages
  if (location.pathname === "/" || location.pathname === "/signup") {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-blue-600">CECS</h1>
              <nav className="hidden md:flex space-x-4">
                <Button
                  variant={location.pathname === "/events" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate("/events")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Events
                </Button>
                <Button
                  variant={location.pathname === "/map" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate("/map")}
                >
                  <Map className="w-4 h-4 mr-2" />
                  Map
                </Button>
                {user?.role === "staff" && (
                  <Button
                    variant={location.pathname === "/create-event" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => navigate("/create-event")}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                )}
                {user?.role === "administrator" && (
                  <Button
                    variant={location.pathname === "/admin" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => navigate("/admin")}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                )}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/settings")}
                title="Account Settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <div className="text-sm">
                <p className="font-medium">{user?.name}</p>
                <p className="text-gray-500 capitalize">{user?.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}