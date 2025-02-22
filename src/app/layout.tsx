"use client";

import Link from "next/link";
import "./globals.css";
import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<null | { email: string | null }>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser({ email: currentUser.email });
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <html lang="fr">
        <body className="bg-gradient-to-t from-white to-gray-50 text-gray-900 min-h-screen">
        {/* HEADER */}
        <header className="fixed top-0 left-0 w-full z-50">
            <nav
                className="
              mx-auto max-w-7xl px-6 py-3
              flex items-center justify-between
              bg-white/70 backdrop-blur-md
              border-b border-gray-200
              shadow-sm
            "
            >
                {/* Logo */}
                <Link href="/">
              <span
                  className="
                  text-xl md:text-2xl font-extrabold
                  bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                  bg-clip-text text-transparent
                  hover:opacity-90 transition-opacity
                "
              >
                Watchlist
              </span>
                </Link>

                {/* Espace utilisateur */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                  <span className="text-sm text-gray-700">
                    {user.email || "Anonymous"}
                  </span>
                            <button
                                onClick={handleLogout}
                                className="
                      px-4 py-2
                      bg-gradient-to-r from-red-500 to-pink-500
                      hover:to-pink-400
                      text-white text-sm font-semibold
                      rounded-md transition-colors
                    "
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="
                    px-4 py-2
                    bg-gradient-to-r from-blue-500 to-indigo-500
                    hover:to-indigo-400
                    text-white text-sm font-semibold
                    rounded-md transition-colors
                  "
                        >
                            Login
                        </Link>
                    )}
                </div>
            </nav>
        </header>

        {/* MAIN CONTENT */}
        {/* On ajoute un padding-top pour que le contenu ne passe pas sous le header */}
        <main className="pt-20 min-h-screen">{children}</main>
        </body>
        </html>
    );
}
