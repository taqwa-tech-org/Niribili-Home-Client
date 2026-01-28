import { axiosSecure } from '@/hooks/useAxiosSecure';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

// 👉 import types
import type {
  User,
  UserProfile,
  UserProfileResponse,
} from '@/Types/Type';

// ====================
// Context Types
// ====================
interface UserContextType {
  user: User | null;
  userProfile: UserProfile | null;
  userLoading: boolean;
  profileLoading: boolean;
  error: string | null;
  refetchUser: () => Promise<void>;
  refetchUserProfile: () => Promise<void>;
}

// ====================
// Create Context
// ====================
const UserContext = createContext<UserContextType | undefined>(undefined);

// ====================
// Provider
// ====================
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [profileLoading, setProfileLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  // ====================
  // Fetch logged-in user
  // ====================
  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      setUserLoading(true);
      setError(null);

      const res = await axiosSecure.get('/user/me');
      setUser(res.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
      setUser(null);
      console.error('Error fetching user:', err);
    } finally {
      setUserLoading(false);
    }
  }, []);

  // ====================
  // Fetch user profile
  // ====================
  const fetchUserProfile = useCallback(async (): Promise<void> => {
    try {
      setProfileLoading(true);
      setError(null);

      const res = await axiosSecure.get<UserProfileResponse>(
        '/profile/userId'
      );
      // console.log(res.data.data)
      setUserProfile(res.data.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch user profile'
      );
      setUserProfile(null);
      console.error('Error fetching profile:', err);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // ====================
  // Auto fetch user on app load (only if token exists)
  // ====================
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchUser();
    } else {
      setUserLoading(false);
      setProfileLoading(false);
    }
  }, [fetchUser]);

  // ====================
  // Fetch profile after user is available
  // ====================
  useEffect(() => {
    if (user?._id) {
      fetchUserProfile();
    }
  }, [user?._id, fetchUserProfile]);

  // ====================
  // Provider value
  // ====================
  return (
    <UserContext.Provider
      value={{
        user,
        userProfile,
        userLoading,
        profileLoading,
        error,
        refetchUser: fetchUser,
        refetchUserProfile: fetchUserProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// ====================
// Custom Hook
// ====================
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
