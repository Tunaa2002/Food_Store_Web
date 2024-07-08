// components/authProductsManage.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const authProductsManage = (WrappedComponent: React.ComponentType) => {
    return (props: any) => {
        const [isLoading, setIsLoading] = useState(true);
        const router = useRouter();

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    const response = await axios.get('/', {
                        withCredentials: true,
                    });

                    if (response.data.role !== 'admin') {
                        router.push('/sign-in');
                    } else {
                        setIsLoading(false);
                    }
                } catch (error) {
                    router.push('/sign-in');
                }
            };

            checkAuth();
        }, [router]);

        if (isLoading) {
            return <div>Loading...</div>;
        }

        return <WrappedComponent {...props} />;
    };
};

export default authProductsManage;
