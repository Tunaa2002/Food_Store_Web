'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwtDecode from 'jsonwebtoken';
import PrivateLayoutProps from '@/common/interfaces/privateLayout';
import axios from 'axios';

const PrivateLayout: React.FC<PrivateLayoutProps> = ({ children }) => {
    const router = useRouter();
  
    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem('user');
        if (!token) {
          router.replace('/sign-in');
          return;
        }
  
        try {
          const { accessToken } = JSON.parse(token);
  
          const response = await axios.post('http://localhost:5000/verify-token', {}, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
  
          if (response.data.valid) {
            const decodedToken: any = jwtDecode.decode(accessToken);
            const { role } = decodedToken;
            
            if (role !== 'admin') {
              router.replace('/');
            }
          } else {
            router.replace('/sign-in');
          }
        } catch (error: any) {
          console.error('Error during token verification:', error.message);
          router.replace('/sign-in');
        }
      };
  
      checkAuth(); 
    }, []);
  
    return <>{children}</>;
  };
  
  export default PrivateLayout;