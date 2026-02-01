'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type User = Record<string, unknown> | null;

type UserContextType = {
  user: User;
  setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'leave-tracker-user';

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User>(null);

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem(USER_STORAGE_KEY) : null;
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        setUserState(parsed);
      }
    } catch {
      setUserState(null);
    }
  }, []);

  const setUser = useCallback((newUser: User) => {
    setUserState(newUser);
    try {
      if (typeof window !== 'undefined') {
        if (newUser === null) {
          localStorage.removeItem(USER_STORAGE_KEY);
        } else {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
        }
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (ctx === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
}
