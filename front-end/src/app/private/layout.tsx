// PrivateLayout.tsx
'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import jwtDecode from 'jsonwebtoken';

interface PrivateLayoutProps {
    children: ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps ) {
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
                const decodedToken: any = jwtDecode.decode(accessToken);
                const { role } = decodedToken;

                if (role !== 'admin') {
                    alert('Bạn không có quyền truy cập vào trang này!');
                    router.replace('/');
                }
            } catch (error: any) {
                console.error('Error during token verification:', error.message);
                alert('Đã xảy ra lỗi, vui lòng thử lại sau');
                router.replace('/sign-in');
            }
        };
        if (typeof window !== 'undefined') {
            checkAuth();
        }
    }, [router]);

    return (
        <>
            {children}
        </>
    );
}
