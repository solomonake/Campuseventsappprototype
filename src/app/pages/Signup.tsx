import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Calendar, AlertCircle, CheckCircle2, Info } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Calculate password strength
  const getPasswordStrength = (pwd: string): { strength: 'weak' | 'medium' | 'strong'; label: string; color: string; barWidth: string } => {
    if (pwd.length === 0) {
      return { strength: 'weak', label: '', color: '', barWidth: '0%' };
    }

    let score = 0;
    
    // Length check
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(pwd)) score += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(pwd)) score += 1;
    
    // Contains number
    if (/[0-9]/.test(pwd)) score += 1;
    
    // Contains special character
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

    if (score <= 2) {
      return { 
        strength: 'weak', 
        label: 'Weak Password', 
        color: 'bg-red-500',
        barWidth: '33%'
      };
    } else if (score <= 4) {
      return { 
        strength: 'medium', 
        label: 'Medium Password', 
        color: 'bg-yellow-500',
        barWidth: '66%'
      };
    } else {
      return { 
        strength: 'strong', 
        label: 'Strong Password', 
        color: 'bg-green-500',
        barWidth: '100%'
      };
    }
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    setError("");
    setSuccess(false);

    console.log("Signup button clicked");
    console.log("Form data:", { name, email, password, confirmPassword });

    // Validation
    if (!name.trim()) {
      console.log("Validation failed: name is empty");
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      console.log("Validation failed: email is empty");
      setError("Please enter your email address.");
      return;
    }

    if (!email.endsWith("@uvawise.edu")) {
      console.log("Validation failed: email not UVA-Wise domain");
      setError("Please use your UVA-Wise email address (@uvawise.edu)");
      return;
    }

    if (password.length < 8) {
      console.log("Validation failed: password too short");
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      console.log("Validation failed: passwords don't match");
      setError("Passwords do not match.");
      return;
    }

    console.log("All validation passed! Calling signup function...");
    
    try {
      const result = signup(name, email, password);
      console.log("Signup result:", result);

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/events");
        }, 1500);
      } else {
        setError(result.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>
            Join the Campus Event Coordination System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">UVA-Wise Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="yourname@uvawise.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              
              {password.length > 0 && (
                <>
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all duration-300`} 
                        style={{ width: passwordStrength.barWidth }}
                      ></div>
                    </div>
                    {passwordStrength.label && (
                      <p className={`text-xs font-medium ${
                        passwordStrength.strength === 'weak' ? 'text-red-600' :
                        passwordStrength.strength === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {passwordStrength.label}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p className="font-medium">Password requirements:</p>
                    <ul className="space-y-0.5 ml-3">
                      <li className={password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                        ✓ At least 8 characters
                      </li>
                      <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                        ✓ One uppercase letter
                      </li>
                      <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                        ✓ One lowercase letter
                      </li>
                      <li className={/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                        ✓ One number
                      </li>
                      <li className={/[^a-zA-Z0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                        ✓ One special character (!@#$%^&*)
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Account created successfully! Redirecting...
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={success}>
              {success ? "Account Created!" : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/" className="text-blue-600 hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-700">
                <strong>All new accounts start as Student role.</strong><br />
                If you're a club leader or staff member who needs to create events, you can request a role upgrade after signing up through Account Settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}