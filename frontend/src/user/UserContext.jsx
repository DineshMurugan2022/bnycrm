import React, { createContext, useState, useContext, useEffect } from "react";

// Create UserContext
const UserContext = createContext();

// Default users
const initialUsers = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    userGroup: "admin",
    phone: "123-456-7890",
    loginStatus: "active",
  },
  {
    id: "2",
    username: "teamlead1",
    password: "team123",
    userGroup: "teamleader",
    phone: "123-456-7891",
    loginStatus: "active",
  },
  {
    id: "3",
    username: "bdm1",
    password: "bdm123",
    userGroup: "bdm",
    phone: "123-456-7892",
    loginStatus: "active",
  },
  {
    id: "4",
    username: "user1",
    password: "user123",
    userGroup: "user",
    phone: "123-456-7893",
    loginStatus: "active",
  },
];

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("users");
      return saved ? JSON.parse(saved) : initialUsers;
    } catch {
      return initialUsers;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("currentUser");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    localStorage.setItem("isAuthenticated", isAuthenticated.toString());
  }, [currentUser, isAuthenticated]);

  // Add new user
  const addUser = (user) => {
    const newUser = {
      ...user,
      id: Date.now().toString(),
      loginStatus: "active",
    };
    setUsers((prev) => [...prev, newUser]);
    alert(`User "${user.username}" added successfully`);
  };

  // Update user
  const updateUser = (id, updatedData) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, ...updatedData } : user
      )
    );
    alert("User updated successfully");
  };

  // Delete user
  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
    alert("User deleted successfully");
  };

  // Login
  const login = async (username, password) => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    const foundUser = users.find(
      (u) => u.username === trimmedUsername && u.password === trimmedPassword
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      setIsAuthenticated(true);
      return foundUser; // Return user object for role-based redirects
    }

    return null;
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("currentUser");
    localStorage.setItem("isAuthenticated", "false");
    alert("Logged out successfully");
  };

  return (
    <UserContext.Provider
      value={{
        users,
        currentUser,
        isAuthenticated,
        addUser,
        updateUser,
        deleteUser,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook for easy usage
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
