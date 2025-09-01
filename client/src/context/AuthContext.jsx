import { createContext, useContext, useState, useEffect } from "react";
import { refreshToken } from "../api/authApi";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null); // Logged-in user info
  const [loading, setLoading] = useState(true); // Loading state for refresh

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await refreshToken(); // backend sets tokens in cookies
        if (data?.user) {
          setAuth(data.user);
          console.log("AuthContext: refreshToken successful:", data.user);
        } else {
          setAuth(null); // guest user, no logging needed
        }
      } catch (err) {
        // Only log unexpected errors (not guest "no token" errors)
        console.error(
          "AuthContext: Refresh failed (unexpected):",
          err?.message
        );
        setAuth(null); // Clear auth on unexpected error
      } finally {
        setLoading(false); // stop loading after attempt
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
