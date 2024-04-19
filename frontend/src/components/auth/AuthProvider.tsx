import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthenticationContext } from "../../interfaces";

const AuthContext = createContext<AuthenticationContext | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
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
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, htmlContent }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthenticationContext | null =>
  useContext(AuthContext);
