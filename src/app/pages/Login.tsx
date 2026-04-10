import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "../types/models";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Calendar, AlertCircle, Shield } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const { login, ssoLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate UVA-Wise email domain
    if (!email.endsWith("@uvawise.edu")) {
      setError("Please use your UVA-Wise email address (@uvawise.edu)");
      return;
    }

    const success = login(email, password, selectedRole);

    if (success) {
      navigate("/events");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleSSOLogin = () => {
    setError("");
    
    // Simulate SSO login - in production, this would redirect to UVA-Wise SSO portal
    const result = ssoLogin(selectedRole);
    
    if (result.success) {
      navigate("/events");
    } else {
      setError(result.message || "SSO authentication failed. Please try again.");
    }
  };

  const quickLogin = (role: UserRole) => {
    let credentials = { email: "", password: "" };
    
    switch (role) {
      case "student":
        credentials = { email: "student@uvawise.edu", password: "student123" };
        break;
      case "staff":
        credentials = { email: "staff@uvawise.edu", password: "staff123" };
        break;
      case "administrator":
        credentials = { email: "admin@uvawise.edu", password: "admin123" };
        break;
    }

    setEmail(credentials.email);
    setPassword(credentials.password);
    setSelectedRole(role);
    
    const success = login(credentials.email, credentials.password, role);
    if (success) {
      navigate("/events");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Campus Event Coordination System</CardTitle>
          <CardDescription>
            Sign in to discover and manage campus events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="administrator">Admin</TabsTrigger>
            </TabsList>

            <form onSubmit={handleLogin} className="space-y-4">
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
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full">
                Sign In as {selectedRole}
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleSSOLogin}
              >
                <Shield className="w-4 h-4 mr-2" />
                Sign in with UVA-Wise SSO
              </Button>
            </form>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 text-center mb-3">Quick login for demo:</p>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => quickLogin("student")}
              >
                Login as Student
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => quickLogin("staff")}
              >
                Login as Staff
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => quickLogin("administrator")}
              >
                Login as Administrator
              </Button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Demo Credentials:</strong><br />
              Student: student@uvawise.edu / student123<br />
              Staff: staff@uvawise.edu / staff123<br />
              Admin: admin@uvawise.edu / admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}