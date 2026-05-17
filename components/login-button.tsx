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

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userEmail = user.email || "";
      const username = userEmail.split("@")[0] || "User";

      const formattedName =
        username.charAt(0).toUpperCase() + username.slice(1);

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: formattedName,
          email: userEmail,
          photo: user.photoURL,
          provider: "google",
          role: "user",
          createdAt: new Date(),
        },
        { merge: true }
      );

      toast.success("Login with Google successful!");
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Login with Google failed");
      }
    }
  };

  const handleRegister = async () => {
    try {
      if (!email || !password) {
        toast.error("Please fill email and password");
        return;
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      const userEmail = user.email || email;
      const username = userEmail.split("@")[0] || "User";

      const formattedName =
        username.charAt(0).toUpperCase() + username.slice(1);

      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          name: formattedName,
          email: userEmail,
          photo: null,
          provider: "email",
          role: "user",
          createdAt: new Date(),
        },
        { merge: true }
      );

      toast.success("Account created successfully!");
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Register failed");
      }
    }
  };

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        toast.error("Please fill email and password");
        return;
      }

      await signInWithEmailAndPassword(auth, email, password);

      toast.success("Login successful!");
      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Login failed");
      }
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        type="button"
        onClick={loginWithGoogle}
        className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded"
      >
        <FaG className="size-6" />
        Sign In with Google
      </button>

      <p className="text-center text-gray-400">OR</p>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {isRegister ? (
        <button
          type="button"
          onClick={handleRegister}
          className="bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Register
        </button>
      ) : (
        <button
          type="button"
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>
      )}

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