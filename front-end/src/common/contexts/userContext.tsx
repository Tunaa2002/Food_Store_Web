'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import jwtDecode from 'jsonwebtoken';
import UserContextType from '../interfaces/userContext';
import axios from 'axios';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     try {
  //       const { accessToken, expiry } = JSON.parse(storedUser);
  //       const decodedToken: any = jwtDecode.decode(accessToken);
  //       const { username, role } = decodedToken;

  //       // Check token expiration
  //       if (new Date().getTime() < expiry) {
  //         setUsername(username);
  //         setRole(role);
  //         setIsLoggedIn(true);
  //       } else {
  //         localStorage.removeItem('user');
  //       }
  //     } catch (error: any) {
  //       console.error('Error decoding JWT token:', error.message);
  //       localStorage.removeItem('user');
  //     }
  //   }
  // }, []);
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const { accessToken, expiry } = JSON.parse(storedUser);
        
        // Kiểm tra token hết hạn
        if (new Date().getTime() >= expiry) {
          localStorage.removeItem('user');
          return;
        }
        
        // Xác thực token bằng API
        axios.post('http://localhost:5000/verify-token', {}, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
          .then(response => {
            if (response.data.valid) {
              const decodedToken: any = jwtDecode.decode(accessToken);
              const { username, role } = decodedToken;
              setUsername(username);
              setRole(role);
              setIsLoggedIn(true);
            } else {
              localStorage.removeItem('user');
            }
          })
          .catch(error => {
            console.error('Error verifying token:', error.message);
            localStorage.removeItem('user');
          });
      } catch (error: any) {
        console.error('Error parsing stored user data:', error.message);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const signOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('productDetail');
    setUsername(null);
    setRole(null);
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <UserContext.Provider value={{ username, role, isLoggedIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
