"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../../../firebase";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/catalog");
        } catch {
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Decorative Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50 -z-10" />

            {/* Decorative shapes */}
            <div className="absolute w-[30rem] h-[30rem] bg-blue-100 rounded-full top-[-8rem] left-[-12rem] opacity-60 blur-3xl -z-10" />
            <div className="absolute w-[20rem] h-[20rem] bg-pink-100 rounded-full bottom-[-6rem] right-[-10rem] opacity-60 blur-2xl -z-10" />

            <motion.div
                className="w-full max-w-lg p-8 md:p-10 bg-white shadow-lg rounded-3xl relative z-10"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
            >
                {/* Logo / Title */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex justify-center items-center">
                            <span className="text-white font-bold text-lg">🎥</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Watchlist</h1>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-500 mt-1">Connectez-vous pour continuer</p>
                </div>

                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                    className="space-y-6"
                >
                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="exemple@domaine.com"
                            className="w-full px-4 py-2 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-2 text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-bold shadow-md hover:opacity-90 transition"
                    >
                        Login
                    </button>
                </form>

                <div className="my-6 flex items-center justify-center">
                    <span className="bg-gray-300 h-px flex-1"></span>
                    <span className="text-sm text-gray-500 px-4">ou</span>
                    <span className="bg-gray-300 h-px flex-1"></span>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-500">
                        Vous n’avez pas de compte ?{" "}
                        <Link href="/register" className="text-teal-500 hover:underline">
                            Inscrivez-vous
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
