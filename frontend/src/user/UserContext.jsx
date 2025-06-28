import React, { createContext, useState, useContext, useEffect } from "react";
import { io } from 'socket.io-client';

const UserContext = createContext();
const API_BASE = "http://localhost:5000/api/users";

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  const parseResponse = async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Server response is not JSON:\n${text}`);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) {
        const errorData = await parseResponse(res);
        throw new Error(errorData.error || "Failed to fetch users");
      }
      const data = await res.json();

      const normalizedUsers = data.map((user) => ({
        ...user,
        id: user._id,
      }));

      setUsers(normalizedUsers);
    } catch (err) {
      console.error("Fetch users failed:", err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    console.log('🔌 WebSocket connecting...');

    newSocket.on('userStatusChanged', (data) => {
      console.log('🔄 User status changed:', data);
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === data.userId 
            ? { ...user, loginStatus: data.status }
            : user
        )
      );
    });

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (currentUser && socket) {
      console.log('👤 Emitting login event for:', currentUser.username);
      socket.emit('userLogin', {
        userId: currentUser.id,
        username: currentUser.username
      });
    }
  }, [currentUser, socket]);

  useEffect(() => {
    if (currentUser && socket) {
      const interval = setInterval(() => {
        socket.emit('userActivity', { userId: currentUser.id });
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [currentUser, socket]);

  const addUser = async (user) => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await parseResponse(res);

      if (!res.ok) throw new Error(data.error || "Add user failed");

      await fetchUsers();
      alert("User added successfully");
    } catch (err) {
      alert("Error adding user: " + err.message);
    }
  };

  const updateUser = async (id, updatedData) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await parseResponse(res);

      if (!res.ok) throw new Error(data.error || "Update failed");

      await fetchUsers();
      alert("User updated successfully");
    } catch (err) {
      alert("Error updating user: " + err.message);
    }
  };

  const deleteUser = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await parseResponse(res);
        throw new Error(errorData.error || "Delete failed");
      }

      await fetchUsers();
      alert("User deleted successfully");
    } catch (err) {
      alert("Error deleting user: " + err.message);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userGroup', user.userGroup);
      setCurrentUser(user);
      
      if (socket) {
        socket.emit('userLogin', {
          userId: user.id,
          username: user.username
        });
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const logout = () => {
    if (currentUser && socket) {
      socket.emit('userLogout', {
        userId: currentUser.id,
        username: currentUser.username
      });
    }

    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        users,
        addUser,
        updateUser,
        deleteUser,
        refreshUsers: fetchUsers,
        login,
        logout,
        currentUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
