'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
  username: string;
  role: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserContextType>({ username: '', role: '' });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const { username, role, expiry } = JSON.parse(userData);
      if (new Date().getTime() < expiry) {
        setUser({ username, role });
      } else {
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
