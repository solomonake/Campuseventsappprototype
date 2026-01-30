import { Home, Map, Bookmark, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Map, label: "Map", path: "/map" },
    { icon: Bookmark, label: "Saved", path: "/saved" },
    { icon: User, label: "Profile", path: "/staff" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-300 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center gap-1 tap-target flex-1 h-full"
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon
              className={`w-6 h-6 ${isActive ? "text-blue-600" : "text-gray-600"}`}
            />
            <span
              className={`text-xs ${isActive ? "text-blue-600 font-medium" : "text-gray-600"}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
