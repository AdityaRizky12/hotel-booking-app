"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { FaG } from "react-icons/fa6";
import { auth, db } from "@/firebase/firebase.config";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

const LoginButton = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const router = useRouter();

  // 🔥 GOOGLE LOGIN
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 🔥 format nama dari email (biar konsisten)
      const username = user.email.split("@")[0];
      const formattedName =
        username.charAt(0).toUpperCase() + username.slice(1);

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: formattedName, // 🔥 pakai ini
          email: user.email,
          photo: user.photoURL,
          provider: "google",
          role: "user",
          createdAt: new Date(),
        },
        { merge: true }
      );

       toast.success("Login with Google successful!");

      router.push("/");

    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // 🔥 REGISTER EMAIL
  const handleRegister = async () => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      const username = email.split("@")[0];
      const formattedName =
        username.charAt(0).toUpperCase() + username.slice(1);

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: formattedName, 
          email: user.email,
          photo: null,
          provider: "email",
          role: "user",
          createdAt: new Date(),
        },
        { merge: true }
      );

     toast.success("Account created successfully!");
      router.push("/");

    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // 🔥 LOGIN EMAIL
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);

    toast.success("Login successful!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* GOOGLE */}
      <button
        onClick={loginWithGoogle}
        className="flex items-center justify-center gap-2 w-full bg-red-500 text-white py-3 rounded"
      >
        <FaG className="size-6" />
        Sign In with Google
      </button>

      <p className="text-center text-gray-400">OR</p>

      {/* EMAIL */}
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* PASSWORD */}
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* BUTTON */}
      {isRegister ? (
        <button
          onClick={handleRegister}
          className="bg-green-500 text-white py-2 rounded"
        >
          Register
        </button>
      ) : (
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white py-2 rounded"
        >
          Login
        </button>
      )}

      {/* SWITCH */}
      <p className="text-sm text-center">
        {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}
        <span
          onClick={() => setIsRegister(!isRegister)}
          className="text-blue-500 cursor-pointer ml-2"
        >
          {isRegister ? "Login" : "Register"}
        </span>
      </p>

    </div>
  );
};

export default LoginButton;