"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { motion } from "framer-motion";

export default function Home() {
    const [user, setUser] = useState<null | { displayName: string | null }>(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({ displayName: currentUser.displayName || "User" });
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleExploreClick = () => {
        if (user) {
            router.push("/catalog");
        } else {
            router.push("/login");
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
            {/* --- GRADIENT BACKGROUND --- */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 -z-10" />

            {/* --- DECORATIVE SHAPES --- */}
            <div className="absolute w-[30rem] h-[30rem] bg-purple-100 rounded-full top-[-5rem] left-[-10rem] opacity-60 blur-3xl -z-10" />
            <div className="absolute w-[25rem] h-[25rem] bg-pink-100 rounded-full bottom-[-5rem] right-[-8rem] opacity-60 blur-2xl -z-10" />

            {/* --- MAIN CONTENT --- */}
            <motion.div
                className="z-10 max-w-xl text-center px-6"
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
            >
                <motion.h1
                    className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-tight drop-shadow-sm"
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    Watchlist de{" "}
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            séries
          </span>{" "}
                    &{" "}
                    <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
            films
          </span>{" "}

                </motion.h1>

                <motion.p
                    className="text-gray-600 text-base md:text-lg mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                >

                </motion.p>

                <motion.button
                    onClick={handleExploreClick}
                    className="px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:to-purple-500 transition-colors drop-shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Explorer
                </motion.button>
            </motion.div>
        </div>
    );
}
