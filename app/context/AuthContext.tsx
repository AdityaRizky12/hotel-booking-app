"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebase.config";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type UserData = {
  uid?: string;
  name?: string;
  email?: string;
  photo?: string | null;
  provider?: string;
  role?: string;
  createdAt?: any;
};

type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  role: string | null;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  role: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);

          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data() as UserData;

            setUserData(data);
            setRole(data.role?.trim().toLowerCase() || "user");
          } else {
            setUserData(null);
            setRole("user");
          }
        } else {
          setUser(null);
          setUserData(null);
          setRole(null);
        }
      } catch (error) {
        console.error(error);
        setUserData(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userData, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);