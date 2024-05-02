import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthenticationContext } from "../../interfaces";
import { useLocation } from "react-router-dom";

const AuthContext = createContext<AuthenticationContext | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    const skipAuthRoutes = ["/", "/login", "/signup", "/testmessage"];
    if (skipAuthRoutes.includes(location.pathname)) {
      return;
    }

    const checkAuth = async () => {
      const response = await fetch("/api/users/check-auth");
      if (!response.ok) {
        const html = await response.text();
        setHtmlContent(html);
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, htmlContent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthenticationContext | null =>
  useContext(AuthContext);
