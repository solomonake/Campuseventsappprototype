import { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole } from "../types/models";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  ssoLogin: (role: UserRole) => { success: boolean; message?: string };
  signup: (name: string, email: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  updateProfile: (name: string, email: string) => { success: boolean; message?: string };
  updateUserRole: (newRole: UserRole) => void;
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean; message?: string };
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for prototype
const mockUsers: { email: string; password: string; role: UserRole; name: string }[] = [
  { email: "student@uvawise.edu", password: "student123", role: "student", name: "Alex Student" },
  { email: "staff@uvawise.edu", password: "staff123", role: "staff", name: "Jordan Staff" },
  { email: "admin@uvawise.edu", password: "admin123", role: "administrator", name: "Sam Admin" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for persisted user
    try {
      const stored = localStorage.getItem("cecs-user");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
      return null;
    }
  });

  const login = (email: string, password: string, role: UserRole): boolean => {
    // Mock authentication
    const mockUser = mockUsers.find(
      (u) => u.email === email && u.password === password && u.role === role
    );

    if (mockUser) {
      const newUser: User = {
        id: `user-${role}-${Date.now()}`,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
      };
      setUser(newUser);
      localStorage.setItem("cecs-user", JSON.stringify(newUser));
      return true;
    }

    return false;
  };

  const ssoLogin = (role: UserRole): { success: boolean; message?: string } => {
    // Mock SSO authentication
    const mockUser = mockUsers.find((u) => u.role === role);

    if (mockUser) {
      const newUser: User = {
        id: `user-${role}-${Date.now()}`,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
      };
      setUser(newUser);
      localStorage.setItem("cecs-user", JSON.stringify(newUser));
      return { success: true };
    }

    return { success: false, message: "SSO login failed." };
  };

  const signup = (name: string, email: string, password: string): { success: boolean; message?: string } => {
    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email);

    if (existingUser) {
      return { success: false, message: "An account with this email already exists." };
    }

    // Create new user
    const newMockUser = {
      email,
      password,
      role: "student", // Default role for new users
      name,
    };
    mockUsers.push(newMockUser);

    // Automatically log in the user after signup
    const newUser: User = {
      id: `user-student-${Date.now()}`,
      name: name,
      email: email,
      role: "student",
    };
    setUser(newUser);
    localStorage.setItem("cecs-user", JSON.stringify(newUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cecs-user");
  };

  const updateProfile = (name: string, email: string): { success: boolean; message?: string } => {
    if (!user) {
      return { success: false, message: "User not logged in." };
    }

    // Check if email is already taken
    const existingUser = mockUsers.find((u) => u.email === email && u.email !== user.email);
    if (existingUser) {
      return { success: false, message: "An account with this email already exists." };
    }

    // Find the current user's password
    const mockUser = mockUsers.find((u) => u.email === user.email);
    const userPassword = mockUser?.password || "";

    // Update user in mockUsers
    const mockUserIndex = mockUsers.findIndex((u) => u.email === user.email);
    if (mockUserIndex !== -1) {
      mockUsers[mockUserIndex] = {
        email,
        password: userPassword,
        role: user.role,
        name,
      };
    }

    // Update user in state and localStorage
    const newUser: User = {
      id: user.id,
      name: name,
      email: email,
      role: user.role,
    };
    setUser(newUser);
    localStorage.setItem("cecs-user", JSON.stringify(newUser));

    return { success: true };
  };

  const updateUserRole = (newRole: UserRole) => {
    if (!user) {
      return;
    }

    // Find current user's password
    const mockUser = mockUsers.find((u) => u.email === user.email);
    const userPassword = mockUser?.password || "";

    // Update user in mockUsers
    const mockUserIndex = mockUsers.findIndex((u) => u.email === user.email);
    if (mockUserIndex !== -1) {
      mockUsers[mockUserIndex] = {
        email: user.email,
        password: userPassword,
        role: newRole,
        name: user.name,
      };
    }

    // Update user in state and localStorage
    const newUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: newRole,
    };
    setUser(newUser);
    localStorage.setItem("cecs-user", JSON.stringify(newUser));
  };

  const changePassword = (currentPassword: string, newPassword: string): { success: boolean; message?: string } => {
    if (!user) {
      return { success: false, message: "User not logged in." };
    }

    // Check if current password is correct
    const mockUser = mockUsers.find((u) => u.email === user.email && u.password === currentPassword);
    if (!mockUser) {
      return { success: false, message: "Current password is incorrect." };
    }

    // Update user in mockUsers
    const mockUserIndex = mockUsers.findIndex((u) => u.email === user.email);
    if (mockUserIndex !== -1) {
      mockUsers[mockUserIndex] = {
        email: user.email,
        password: newPassword,
        role: user.role,
        name: user.name,
      };
    }

    // Update user in state and localStorage
    const newUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    setUser(newUser);
    localStorage.setItem("cecs-user", JSON.stringify(newUser));

    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        ssoLogin,
        signup,
        logout,
        updateProfile,
        updateUserRole,
        changePassword,
        isAuthenticated: user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}