'use client';

import { AuthGuardProps, User } from '@/interface';
import { RootState } from '@/store';
import { logout, setCredentials } from '@/store/slices/auth.slice';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  
  const dispatch = useDispatch();
  const router = useRouter();
   
  const [isChecking, setIsChecking] = useState(true);

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => { 
    
    const checkAuth = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            dispatch(logout());
            router.replace('/login'); 
            return;
        }

        try {
            let currentUser = user; 
            if (!isAuthenticated || !currentUser) {
                const decodedUser = jwtDecode<User>(token);

                const currentTime = Date.now() / 1000;
                if ((decodedUser as any).exp < currentTime) {
                    throw new Error("Token expired");
                }

                dispatch(setCredentials({ user: decodedUser, token }));
                currentUser = decodedUser;
            }

            if (allowedRoles && currentUser) {
                const userRole = (currentUser.role || "").toLowerCase(); 
                
                const hasAccess = allowedRoles.some(r => r.toLowerCase() === userRole);

                if (!hasAccess) {
                    router.replace(`/${userRole}`);
                    return;
                }
            }

            setIsChecking(false);

        } catch(err) {
            console.error("Auth Guard Error", err);
            localStorage.clear();
            dispatch(logout());
            router.replace('/login');
        }
    };

    checkAuth();

   }, [isAuthenticated, user, dispatch, router, allowedRoles]);

   if(isChecking) {
       return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
   }

   return <>{children}</>;
}

export default AuthGuard;