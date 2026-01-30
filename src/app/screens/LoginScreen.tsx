import { ArrowRight, Smartphone } from "lucide-react";
import { useNavigate } from "react-router";

export function LoginScreen() {
  const navigate = useNavigate();

  return (
    <div className="wireframe-container min-h-screen bg-white flex flex-col">
      {/* Screen Label */}
      <div className="bg-gray-800 text-white px-4 py-2 text-sm font-mono">
        L1 - Login Screen
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <span className="text-white text-3xl">🎓</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Campus Events</h1>
          <p className="text-gray-600">@ UVA Wise</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={() => navigate("/onboarding")}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold tap-target hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Login with UVA SSO
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/onboarding")}
            className="w-full bg-white text-gray-900 py-4 px-6 rounded-xl font-semibold tap-target border-2 border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
          >
            <Smartphone className="w-5 h-5" />
            Tap Student ID (NFC)
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-12 max-w-xs">
          By logging in, you agree to the UVA Wise Student Technology Guidelines
        </p>
      </div>

      {/* Navigation helper */}
      <div className="border-t border-gray-300 p-4 bg-gray-50">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          ← Back to Documentation
        </button>
      </div>
    </div>
  );
}
