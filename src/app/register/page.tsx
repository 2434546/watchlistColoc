"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import {auth, db} from "../../../firebase";
import { motion } from "framer-motion";
import Link from "next/link";
import { getFirestore, doc, setDoc } from "firebase/firestore";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
    const router = useRouter(); // Utilisation du hook pour la redirection

    const handleRegister = async () => {
        setError("");
        if (!firstName || !lastName) {
            setError("First name and last name are required.");
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Met à jour le profil Firebase Auth (affichage du nom)
            await updateProfile(user, { displayName: `${firstName} ${lastName}` });

            // Stocke les infos supplémentaires dans Firestore
            await setDoc(doc(db, "users", user.uid), {
                firstName: firstName,
                lastName: lastName,
                email: email,
                createdAt: new Date()
            });

            // Redirection vers /catalog après inscription réussie
            router.push("/catalog");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred.");
            }
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-teal-50">
            {/* Decorative shapes */}
            <div className="absolute w-[30rem] h-[30rem] bg-blue-100 rounded-full top-[-8rem] left-[-12rem] opacity-60 blur-3xl -z-10" />
            <div className="absolute w-[20rem] h-[20rem] bg-pink-100 rounded-full bottom-[-6rem] right-[-10rem] opacity-60 blur-2xl -z-10" />

            <motion.div
                className="w-full max-w-lg p-8 md:p-10 bg-white shadow-lg rounded-3xl relative z-10"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
            >
                {/* Logo / Header */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex justify-center items-center">
                            <span className="text-white font-bold text-lg">🎬</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Watchlist</h1>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-3xl font-extrabold text-gray-800">Create an Account</h2>
                    <p className="text-gray-500 mt-1">Rejoignez-nous et gérez votre watchlist</p>
                </div>

                {error && (
                    <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleRegister();
                    }}
                    className="space-y-6"
                >
                    {/* First Name */}
                    <div className="flex flex-col">
                        <label htmlFor="firstName" className="mb-1 text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="John"
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col">
                        <label htmlFor="lastName" className="mb-1 text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Doe"
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                        <label htmlFor="email" className="mb-1 text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="exemple@domain.com"
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col">
                        <label htmlFor="password" className="mb-1 text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg font-bold shadow-md hover:opacity-90 transition"
                    >
                        Register
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-teal-500 hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
