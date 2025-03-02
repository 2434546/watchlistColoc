"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import { auth, db } from "../../../firebase";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";

/** Structure de données pour un film/série */
type MediaItem = {
    id: number;
    title: string;
    watched: boolean;
    rating: number;
    link: string;
    image: string;
    type: "Film" | "Série";
    seasons?: number;
    episodes?: number;
    trailerKey?: string; // Clé YouTube de la bande-annonce
};

interface Video {
    site: string;
    type: string;
    key: string;
}

export default function Catalog() {
    const [items, setItems] = useState<MediaItem[]>([]);
    const [filter, setFilter] = useState<"All" | "Film" | "Série">("All");
    const [openTrailerId, setOpenTrailerId] = useState<number | null>(null);

    const API_KEY = "f54cb9e8900a1adc9beccb4d9ed2d5a3";

    const wantedItems = [
        { id: 157336, type: "Film" },  // Interstellar
        { id: 490132, type: "Film" },  // Green Book
        { id: 129552, type: "Série" }, // The Night Agent
        { id: 2288,   type: "Série" }, // Prison Break
        { id: 67026,  type: "Série" }, // Designated Survivor
        { id: 1396,   type: "Série" }, // Breaking Bad
        { id: 60574,  type: "Série" }, // Peaky Blinders
        { id: 96677,  type: "Série" }, // Lupin
        { id: 429351, type: "Film" },  // 12 Strong
        { id: 530915, type: "Film" },  // 1917
        { id: 228150, type: "Film" },  // Fury
        { id: 274855, type: "Film" },  // Geostorming
        { id: 19995,  type: "Film" },  // Avatar
        { id: 567748, type: "Film" },  // The Guilty
        { id: 198184, type: "Film" },  // Chappie
        { id: 872585, type: "Film" },  // The Batman
        { id: 122917, type: "Film" },  // The Hobbit: The Battle of the Five Armies
        { id: 7485,   type: "Film" },  // The Lord of the Rings: The Fellowship of the Ring
        { id: 281957, type: "Film" },  // The Revenant
        { id: 68718,  type: "Film" },  // Django Unchained
        { id: 77338,  type: "Film" },  // The Great Gatsby
        { id: 57158,  type: "Film" },  // The Hobbit: The Desolation of Smaug
        { id: 324786, type: "Film" },  // Hacksaw Ridge
        { id: 14574,  type: "Film" },  // The Social Network
        { id: 37799,  type: "Film" },  // The Wolf of Wall Street
        { id: 57214,  type: "Film" },  // The Dark Knight Rises
        { id: 57165,  type: "Film" },  // The Hunger Games: Catching Fire
        { id: 934632, type: "Film" },  // The Gray Man
        { id: 932420, type: "Film" },  // The Adam Project
        { id: 72105,  type: "Film" },  // The Tomorrow War
        { id: 676,    type: "Film" },  // The Lord of the Rings: The Two Towers
        { id: 399361, type: "Film" },  // The Founder
        { id: 18823,  type: "Film" },  // The Avengers
        { id: 278924, type: "Film" },  // The Martian
        { id: 48866,  type: "Série" }, // The 100
        { id: 71694,  type: "Série" },  // The Lincoln Lawyer
        { id: 60708,  type: "Série" },  // The Amazing Spider-Man
        { id: 415842, type: "Film" },  // American Assassin
        { id: 49051,  type: "Film" },  // The Hobbit: An Unexpected Journey

        // Nouveaux ajouts
        { id: 296524, type: "Film" },  // Deepwater Horizon
        // Ajouts supplémentaires
        { id: 108978, type: "Série" },  // The Grand Budapest Hotel (déjà présent)
        { id: 66857,  type: "Série" },  // The Impossible
        { id: 461130, type: "Film" },  // The Outpost
        { id: 82452,  type: "Série" },  // The Impossible (doublon potentiel)
        { id: 37680,  type: "Série" },  // The Town (doublon potentiel)
        { id: 34524,  type: "Série" },  // The Town (déjà présent)
        { id: 388399,  type: "Film" },
        { id: 1852,  type: "Film" },
        { id: 890825,  type: "Film" },
        { id: 848326,  type: "Film" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (!auth.currentUser) return;

            const userUID = auth.currentUser.uid;
            const watchlistRef = collection(db, "user_watchlist", userUID, "watchlist");
            try {
                const watchlistSnapshot = await getDocs(watchlistRef);
                const watchedMap = new Map();
                const ratingMap = new Map();

                watchlistSnapshot.forEach((doc) => {
                    const data = doc.data();
                    watchedMap.set(parseInt(doc.id.replace("Movie_", "")), data.watched);
                    ratingMap.set(parseInt(doc.id.replace("Movie_", "")), data.rating || 0);
                });

                const fetchPromises = wantedItems.map(async (item) => {
                    const endpoint = item.type === "Film" ? "movie" : "tv";
                    const res = await fetch(
                        `https://api.themoviedb.org/3/${endpoint}/${item.id}?api_key=${API_KEY}&language=fr`
                    );
                    const data = await res.json();

                    //const title = item.type === "Film" ? data.title : data.name;

                    let seasons: number | undefined;
                    let episodes: number | undefined;
                    if (item.type === "Série") {
                        seasons = data.number_of_seasons;
                        episodes = data.number_of_episodes;
                    }

                    // Récupération de la bande-annonce
                    let trailerKey: string | undefined;
                    try {
                        const videoRes = await fetch(
                            `https://api.themoviedb.org/3/${endpoint}/${item.id}/videos?api_key=${API_KEY}&language=fr`
                        );
                        const videoData = await videoRes.json();
                        const youtubeTrailer = videoData.results?.find(
                            (vid: Video) => vid.site === "YouTube" && vid.type === "Trailer"
                        );
                        if (youtubeTrailer) {
                            trailerKey = youtubeTrailer.key;
                        }
                    } catch (err) {
                        console.error("Erreur fetch videos :", err);
                    }

                    return {
                        id: item.id,
                        title: item.type === "Film" ? data.title : data.name,
                        watched: watchedMap.get(item.id) || false,
                        rating: ratingMap.get(item.id) || 0,
                        link: `https://www.themoviedb.org/${endpoint}/${item.id}`,
                        image: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
                        type: item.type,
                        seasons,
                        episodes,
                        trailerKey,
                    } as MediaItem;
                });

                const results = await Promise.all(fetchPromises);
                setItems(results);
            } catch (error) {
                console.error("Erreur lors de la récupération :", error);
            }
        };

        fetchData();
    }, [wantedItems]); // Ajoutez `wantedItems` ici

    const openTrailer = (id: number) => {
        setOpenTrailerId(id);
    };

    const closeTrailer = () => {
        setOpenTrailerId(null);
    };

    const toggleWatched = async (id: number) => {
        if (!auth.currentUser) return;
        const userUID = auth.currentUser.uid;
        const watchlistRef = doc(db, "user_watchlist", userUID, "watchlist", `Movie_${id}`);

        const mediaItem = items.find((media) => media.id === id);
        if (!mediaItem) return;

        const newWatchedState = !mediaItem.watched;

        try {
            const docSnap = await getDoc(watchlistRef);
            if (!docSnap.exists()) {
                await setDoc(watchlistRef, {
                    title: mediaItem.title,
                    type: mediaItem.type,
                    watched: newWatchedState,
                    rating: mediaItem.rating,
                    createdAt: new Date(),
                });
            } else {
                await updateDoc(watchlistRef, { watched: newWatchedState });
            }

            setItems((prev) =>
                prev.map((media) =>
                    media.id === id ? { ...media, watched: newWatchedState } : media
                )
            );
        } catch (error) {
            console.error("Erreur lors de la mise à jour Firestore :", error);
        }
    };

    const setRating = async (id: number, rating: number) => {
        if (!auth.currentUser) return;
        const userUID = auth.currentUser.uid;
        const watchlistRef = doc(db, "user_watchlist", userUID, "watchlist", `Movie_${id}`);

        try {
            await updateDoc(watchlistRef, { rating: rating });
            setItems((prev) =>
                prev.map((media) =>
                    media.id === id ? { ...media, rating: rating } : media
                )
            );
        } catch (error) {
            console.error("Erreur lors de la mise à jour de Firestore :", error);
        }
    };

    const filteredItems =
        filter === "All"
            ? items
            : items.filter((media) => media.type === filter);

    const currentTrailerItem = filteredItems.find((m) => m.id === openTrailerId);

    return (
        <div className="px-6 py-10 relative">
            {/* Boutons de filtre */}
            <div className="flex justify-center gap-4 mb-10">
                <button
                    onClick={() => setFilter("All")}
                    className={`
            px-4 py-2 rounded-full border-2 font-semibold text-sm transition-colors
            ${filter === "All" ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"}
          `}
                >
                    Tous
                </button>
                <button
                    onClick={() => setFilter("Film")}
                    className={`
            px-4 py-2 rounded-full border-2 font-semibold text-sm transition-colors
            ${filter === "Film" ? "bg-purple-600 border-purple-600 text-white" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"}
          `}
                >
                    Films
                </button>
                <button
                    onClick={() => setFilter("Série")}
                    className={`
            px-4 py-2 rounded-full border-2 font-semibold text-sm transition-colors
            ${filter === "Série" ? "bg-pink-600 border-pink-600 text-white" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"}
          `}
                >
                    Séries
                </button>
            </div>

            {/* Grille */}
            <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredItems.map((media) => (
                    <div
                        key={media.id}
                        className={`
              relative flex flex-col rounded-lg shadow-sm overflow-hidden
              bg-white border transition-transform transform hover:scale-[1.01]
              ${
                            media.watched
                                ? "border-green-400"
                                : "border-gray-200 hover:shadow-md"
                        }
            `}
                    >
                        {/* Badge Film ou Série */}
                        <span
                            className={`
                absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded text-white
                ${media.type === "Film" ? "bg-purple-600" : "bg-pink-600"}
              `}
                        >
              {media.type}
            </span>

                        {/* Image / Poster */}
                        <div className="relative w-full aspect-[2/3]">
                            <Image
                                src={media.image}
                                alt={media.title}
                                width={500}
                                height={750}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            {media.watched && (
                                <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  Vu
                </span>
                            )}
                        </div>

                        {/* Contenu */}
                        <div className="p-4 flex flex-col flex-1">
                            <h2 className="text-md md:text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                                {media.title}
                            </h2>

                            {media.type === "Série" && (
                                <div className="bg-pink-50 text-pink-800 text-xs rounded-md p-2 mb-2 flex flex-col gap-1">
                                    <span className="font-medium">{media.seasons} saisons</span>
                                    <span className="font-medium">{media.episodes} épisodes</span>
                                </div>
                            )}

                            <a
                                href={media.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 text-xs mb-2 hover:underline"
                            >
                                Infos
                            </a>

                            {/* Bouton "Bande-annonce" si on a trailerKey */}
                            {media.trailerKey && (
                                <button
                                    onClick={() => openTrailer(media.id)}
                                    className="
                    inline-block px-3 py-1 text-xs font-semibold
                    text-red-500 border border-red-500 rounded
                    hover:bg-red-500 hover:text-white transition-colors mb-2
                  "
                                >
                                    Bande-annonce
                                </button>
                            )}

                            <div className="flex space-x-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} onClick={() => setRating(media.id, star)}>
                                        <span className={star <= media.rating ? "text-yellow-400 text-2xl" : "text-gray-300 text-2xl"}>★</span>
                                    </button>
                                ))}
                            </div>

                            {/* Bouton "Watch/Unwatch" */}
                            <button
                                onClick={() => toggleWatched(media.id)}
                                className={`
                  mt-auto px-4 py-2 rounded-md font-semibold text-sm transition-colors
                  ${
                                    media.watched
                                        ? "bg-green-500 hover:bg-green-400 text-white"
                                        : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:to-purple-400 text-white"
                                }
                `}
                            >
                                {media.watched ? "Marquer comme non vu" : "Marquer comme vu"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Overlay pour la bande-annonce */}
            {openTrailerId !== null && currentTrailerItem?.trailerKey && (
                <div
                    className="
            fixed inset-0
            flex items-center justify-center
            bg-black bg-opacity-60
            z-50
          "
                    onClick={closeTrailer}
                >
                    <div
                        className="relative bg-black p-4 rounded shadow-lg"
                        style={{ width: "80%", maxWidth: "800px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={closeTrailer}
                            className="
                absolute top-2 right-2
                text-white bg-gray-700
                hover:bg-gray-800
                rounded-full p-1
                transition-colors
              "
                        >
                            ✕
                        </button>
                        <div className="aspect-video">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${currentTrailerItem.trailerKey}?autoplay=1`}
                                allowFullScreen
                                title="Bande-annonce"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}