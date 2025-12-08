import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState({});
  const [loadingUser, setLoadingUser] = useState(true);
  useEffect(() => {
    // Load user from localStorage if it exists
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setLoadingUser(false);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        setUser({});
      }
    } else {
      setUser({});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
    // Only save to localStorage if user is not null/undefined
    if (user && Object.keys(user).length > 0) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
