"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebase.config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); // 🔥 TAMBAHAN
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // 🔥 ambil data dari Firestore
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          setUserData(data);     // 🔥 SIMPAN SEMUA DATA
        setRole(data.role?.trim().toLowerCase());  // 🔥 tetap pakai role
        console.log("USER DATA:", data);
        console.log("ROLE:", data.role);
        } else {
          setUserData(null);
          setRole("user");
        }
      } else {
        setUser(null);
        setUserData(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // logout global
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userData, role, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);