// React & React Native Imports
import React from "react";

// Component Imports
import LoginForm from "@/components/forms/LoginForm";

// Hook Imports
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const { user } = useAuth();
  return <LoginForm />;
}
