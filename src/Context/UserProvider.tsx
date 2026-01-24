import { axiosSecure } from '@/hooks/useAxiosSecure';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Define User type
interface User {
  id: string;
  email: string;
  name: string;
  [key: string]: string | number | boolean | null;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
}

// Create Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider Component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wrap fetchUser in useCallback to maintain stable reference
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosSecure.get('/user/me');
      
      setUser(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
      // setUser(null);
      console.log("we got our culpit",err)
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  // Effect with proper dependency
  // useEffect(() => {
  //   fetchUser();
  // }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, loading, error, refetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};