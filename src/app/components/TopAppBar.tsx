import { ArrowLeft, Menu, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router";

interface TopAppBarProps {
  title?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showMore?: boolean;
  onBack?: () => void;
}

export function TopAppBar({
  title,
  showBack = false,
  showMenu = false,
  showMore = false,
  onBack,
}: TopAppBarProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center h-14 px-4 border-b border-gray-300 bg-white">
      <div className="flex items-center gap-3 flex-1">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 tap-target"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        {showMenu && (
          <button className="p-2 -ml-2 tap-target" aria-label="Menu">
            <Menu className="w-6 h-6" />
          </button>
        )}
        {title && <h1 className="font-semibold text-lg">{title}</h1>}
      </div>
      {showMore && (
        <button className="p-2 -mr-2 tap-target" aria-label="More options">
          <MoreVertical className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
