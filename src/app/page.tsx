"use client";

import { useState } from "react";

export default function Home() {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "1",
      watched: false,
      link: "https://www.netflix.com",
      image: "/shrek.jpg",
      type: "Film",
    },
    {
      id: 2,
      title: "2",
      watched: true,
      link: "https://www.primevideo.com",
      image: "/shrek.jpg",
      type: "Film",
    },
    {
      id: 3,
      title: "3",
      watched: false,
      link: "https://www.hulu.com",
      image: "/shrek.jpg",
      type: "Series",
    },
  ]);

  const [newMovie, setNewMovie] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newType, setNewType] = useState("Film");
  const [filter, setFilter] = useState("All");

  const toggleWatched = (id: number) => {
    setMovies((prev) =>
        prev.map((movie) =>
            movie.id === id ? { ...movie, watched: !movie.watched } : movie
        )
    );
  };

  const addMovie = () => {
    if (
        newMovie.trim() !== "" &&
        newLink.trim() !== "" &&
        newImage.trim() !== ""
    ) {
      setMovies((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: newMovie,
          watched: false,
          link: newLink,
          image: newImage,
          type: newType,
        },
      ]);
      setNewMovie("");
      setNewLink("");
      setNewImage("");
      setNewType("Film");
    }
  };

  const filteredMovies =
      filter === "All"
          ? movies
          : movies.filter((movie) => movie.type === filter);

  return (
      <div className="min-h-screen bg-gradient-to-r from-[#f9f9f9] to-[#eef2ff] text-gray-800 p-6">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            🎥 Movie/Series Watchlist Coloc 🎬
          </h1>
          <div className="mt-6 flex justify-center gap-4">
            <button
                onClick={() => setFilter("All")}
                className={`px-4 py-2 rounded-md font-semibold ${
                    filter === "All"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-300 text-gray-700"
                }`}
            >
              All
            </button>
            <button
                onClick={() => setFilter("Film")}
                className={`px-4 py-2 rounded-md font-semibold ${
                    filter === "Film"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-300 text-gray-700"
                }`}
            >
              Films
            </button>
            <button
                onClick={() => setFilter("Series")}
                className={`px-4 py-2 rounded-md font-semibold ${
                    filter === "Series"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-300 text-gray-700"
                }`}
            >
              Series
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto space-y-8">
          {/* Movie/Series List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMovies.map((movie) => (
                <div
                    key={movie.id}
                    className={`flex flex-col bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 ${
                        movie.watched ? "ring-2 ring-green-500" : "ring-2 ring-red-500"
                    }`}
                >
                  <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-56 object-cover"
                  />
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <h2 className="text-lg font-semibold text-gray-700">
                      {movie.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Type: {movie.type}</p>
                    <a
                        href={movie.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-400 text-sm mt-2"
                    >
                      Watch on Streaming →
                    </a>
                    <button
                        onClick={() => toggleWatched(movie.id)}
                        className={`mt-4 px-4 py-2 text-sm rounded-md font-semibold ${
                            movie.watched
                                ? "bg-green-500 text-white hover:bg-green-400"
                                : "bg-red-500 text-white hover:bg-red-400"
                        }`}
                    >
                      {movie.watched ? "Watched" : "Not Watched"}
                    </button>
                  </div>
                </div>
            ))}
          </div>

          {/* Add Movie Form */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-700">Add a Movie/Series</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <input
                  type="text"
                  value={newMovie}
                  onChange={(e) => setNewMovie(e.target.value)}
                  placeholder="Title"
                  className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                  type="text"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="Streaming Link"
                  className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Image URL"
                  className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Film">Film</option>
                <option value="Series">Series</option>
              </select>
            </div>
            <button
                onClick={addMovie}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md font-semibold hover:opacity-90"
            >
              Add
            </button>
          </div>
        </main>
      </div>
  );
}
