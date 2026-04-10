import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import { Home } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate("/events")}>
          <Home className="w-4 h-4 mr-2" />
          Go to Events
        </Button>
      </div>
    </div>
  );
}
