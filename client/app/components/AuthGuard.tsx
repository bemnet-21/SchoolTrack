'use client';

import { User } from '@/interface';
import { RootState } from '@/store';
import { logout, setCredentials, setLoading } from '@/store/slices/auth.slice';
import { jwtDecode } from 'jwt-decode';
import React, { use, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const AuthGuard = ({children} : { children: React.ReactNode }) => {
  
  const dispatch = useDispatch();
   
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth) 

  useEffect(() => { 
    dispatch(setLoading(true));
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {

      try {
        const user = jwtDecode<User>(token);

        const currentTime = Date.now() / 1000;
            if (user.exp && user.exp < currentTime) {
                throw new Error("Token expired");
            }

        dispatch(setCredentials({ user, token }));
      } catch(err) {
        dispatch(logout());
        localStorage.clear();
      }
      
    } else if (!token) {
        dispatch(logout());
    }

    dispatch(setLoading(false));
   }, [isAuthenticated, dispatch]);

   if(loading) return <div>Loading...</div>

   return (
        <>{children}</>
    )
}

export default AuthGuard
