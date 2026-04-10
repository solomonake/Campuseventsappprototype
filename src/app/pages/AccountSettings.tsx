import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useApp } from "../contexts/AppContext";
import { UserRole } from "../types/models";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { AlertCircle, CheckCircle2, User, Lock, Mail, Shield, Clock, X } from "lucide-react";

export default function AccountSettings() {
  const { user, updateProfile, changePassword } = useAuth();
  const { roleRequestService } = useApp();
  
  // Profile update state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);
  
  // Role request state
  const [requestedRole, setRequestedRole] = useState<UserRole | "">("");
  const [roleReason, setRoleReason] = useState("");
  const [roleRequestError, setRoleRequestError] = useState("");
  const [roleRequestSuccess, setRoleRequestSuccess] = useState(false);
  const pendingRequest = user ? roleRequestService.getUserPendingRequest(user.id) : null;
  const userRequests = user ? roleRequestService.getUserRequests(user.id) : [];
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pwd: string): { strength: 'weak' | 'medium' | 'strong'; label: string; color: string; barWidth: string } => {
    if (pwd.length === 0) {
      return { strength: 'weak', label: '', color: '', barWidth: '0%' };
    }

    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

    if (score <= 2) {
      return { strength: 'weak', label: 'Weak Password', color: 'bg-red-500', barWidth: '33%' };
    } else if (score <= 4) {
      return { strength: 'medium', label: 'Medium Password', color: 'bg-yellow-500', barWidth: '66%' };
    } else {
      return { strength: 'strong', label: 'Strong Password', color: 'bg-green-500', barWidth: '100%' };
    }
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess(false);

    if (!name.trim()) {
      setProfileError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setProfileError("Please enter a valid email address.");
      return;
    }

    const result = updateProfile(name, email);
    
    if (result.success) {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } else {
      setProfileError(result.message || "An error occurred. Please try again.");
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    const result = changePassword(currentPassword, newPassword);
    
    if (result.success) {
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } else {
      setPasswordError(result.message || "An error occurred. Please try again.");
    }
  };

  const handleRoleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRoleRequestError("");
    setRoleRequestSuccess(false);

    if (!user) return;

    if (!requestedRole) {
      setRoleRequestError("Please select a role.");
      return;
    }

    if (requestedRole === user.role) {
      setRoleRequestError("You already have this role.");
      return;
    }

    if (!roleReason.trim() || roleReason.trim().length < 20) {
      setRoleRequestError("Please provide a detailed reason (at least 20 characters).");
      return;
    }

    try {
      roleRequestService.submitRequest(
        user.id,
        user.name,
        user.email,
        user.role,
        requestedRole,
        roleReason
      );
      setRoleRequestSuccess(true);
      setRequestedRole("");
      setRoleReason("");
      setTimeout(() => setRoleRequestSuccess(false), 5000);
    } catch (error) {
      setRoleRequestError(error instanceof Error ? error.message : "Failed to submit request.");
    }
  };

  const handleCancelRequest = () => {
    if (!user || !pendingRequest) return;
    
    roleRequestService.cancelRequest(pendingRequest.id, user.id);
    setRoleRequestSuccess(false);
    setRoleRequestError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account information and security</p>
        </div>

        {/* Profile Information */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <CardTitle>Profile Information</CardTitle>
            </div>
            <CardDescription>Update your name and email address</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex items-center space-x-2">
                  <div className="px-3 py-2 bg-gray-100 rounded-md text-sm font-medium capitalize">
                    {user?.role}
                  </div>
                  <p className="text-xs text-gray-500">Role cannot be changed</p>
                </div>
              </div>

              {profileError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{profileError}</AlertDescription>
                </Alert>
              )}

              {profileSuccess && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Profile updated successfully!
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Request Role Change */}
        {user?.role !== "administrator" && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <CardTitle>Request Role Change</CardTitle>
              </div>
              <CardDescription>
                Request elevated privileges to create and manage events
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequest ? (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">Pending Request</p>
                        <p className="text-sm mt-1">
                          Role: <span className="capitalize font-semibold">{pendingRequest.requestedRole}</span>
                        </p>
                        <p className="text-sm mt-1">
                          Submitted: {new Date(pendingRequest.requestedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm mt-2 text-gray-700">
                          <strong>Reason:</strong> {pendingRequest.reason}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelRequest}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              ) : (
                <form onSubmit={handleRoleRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestedRole">Requested Role</Label>
                    <Select value={requestedRole} onValueChange={(value) => setRequestedRole(value as UserRole)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="staff">Staff/Club Officer</SelectItem>
                        <SelectItem value="administrator">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      <strong>Staff/Club Officer:</strong> Create and manage events for your club or organization
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="roleReason">Reason for Request</Label>
                    <Textarea
                      id="roleReason"
                      value={roleReason}
                      onChange={(e) => setRoleReason(e.target.value)}
                      placeholder="Please explain why you need this role (e.g., 'I am the president of the Drama Club and need to post events for our upcoming performances.')"
                      rows={4}
                      required
                      minLength={20}
                    />
                    <p className="text-xs text-gray-500">
                      Minimum 20 characters. Be specific about your affiliation and responsibilities.
                    </p>
                  </div>

                  {roleRequestError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{roleRequestError}</AlertDescription>
                    </Alert>
                  )}

                  {roleRequestSuccess && (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        Role change request submitted! An administrator will review your request.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Submit Request
                  </Button>
                </form>
              )}

              {/* Request History */}
              {userRequests.length > 0 && !pendingRequest && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Request History</h4>
                    <div className="space-y-2">
                      {userRequests.slice(0, 3).map((request) => (
                        <div
                          key={request.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
                        >
                          <div className="flex-1">
                            <p className="font-medium capitalize">{request.requestedRole}</p>
                            <p className="text-xs text-gray-600">
                              {new Date(request.requestedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant={
                              request.status === "approved"
                                ? "default"
                                : request.status === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                            className="capitalize"
                          >
                            {request.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Change Password */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Lock className="w-5 h-5 text-blue-600" />
              <CardTitle>Change Password</CardTitle>
            </div>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                
                {newPassword.length > 0 && (
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
                        <li className={newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                          ✓ At least 8 characters
                        </li>
                        <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                          ✓ One uppercase letter
                        </li>
                        <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                          ✓ One lowercase letter
                        </li>
                        <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                          ✓ One number
                        </li>
                        <li className={/[^a-zA-Z0-9]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}>
                          ✓ One special character (!@#$%^&*)
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {passwordError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}

              {passwordSuccess && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Password changed successfully!
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}