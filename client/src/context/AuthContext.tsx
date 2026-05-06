'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '@/types';
import { authApi } from '@/lib/api-client';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface AuthContextType {
   user: User | null;
   isAuthenticated: boolean;
   isLoading: boolean;
   login: (data: Record<string, string>) => Promise<void>;
   register: (data: Record<string, string>) => Promise<void>;
   logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
   const [user, setUser] = useState<User | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const router = useRouter();

   useEffect(() => {
      const initAuth = async () => {
         try {
            const { token } = await authApi.refresh();
            localStorage.setItem('volt-edge-token', token);

            const userData = await authApi.getMe();
            setUser(userData);
         } catch {
            const token = localStorage.getItem('volt-edge-token');
            if (token) {
               try {
                  const userData = await authApi.getMe();
                  setUser(userData);
               } catch {
                  localStorage.removeItem('volt-edge-token');
               }
            }
         } finally {
            setIsLoading(false);
         }
      };

      initAuth();
   }, []);

   const handleAuthSuccess = (data: AuthResponse) => {
      localStorage.setItem('volt-edge-token', data.token);
      setUser(data.user);
      router.push('/');
   };

   const login = async (data: Record<string, string>) => {
      try {
         setIsLoading(true);
         const response = await authApi.login(data);
         handleAuthSuccess(response);
         toast.success(`Welcome back, ${response.user.name}!`);
      } catch (error: unknown) {
         const message =
            error instanceof Error ? error.message : 'Login failed';
         toast.error(message);
         throw error;
      } finally {
         setIsLoading(false);
      }
   };

   const register = async (data: Record<string, string>) => {
      try {
         setIsLoading(true);
         const response = await authApi.register(data);
         handleAuthSuccess(response);
         toast.success(`Account created! Welcome, ${response.user.name}`);
      } catch (error: unknown) {
         const message =
            error instanceof Error ? error.message : 'Registration failed';
         toast.error(message);
         throw error;
      } finally {
         setIsLoading(false);
      }
   };

   const logout = async () => {
      try {
         await authApi.logout();
      } catch (err) {
         console.error('Logout error', err);
      } finally {
         localStorage.removeItem('volt-edge-token');
         setUser(null);
         toast.success('Logged out successfully');
         router.push('/login');
      }
   };

   return (
      <AuthContext.Provider
         value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            logout,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
}
