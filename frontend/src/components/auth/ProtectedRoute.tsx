import React from "react";
import { useAuth } from "../auth/AuthProvider";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const auth = useAuth();

  if (!auth) {
    console.error("Auth context is not available");
    return null;
  }

  if (!auth.isAuthenticated) {
    return <div dangerouslySetInnerHTML={{ __html: auth.htmlContent }} />;
  }

  return children;
};

export default ProtectedRoute;
