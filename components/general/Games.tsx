"use client";
import { useState } from "react";
import GameCard from "./GameCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Createnewgame } from "@/app/Gamecardcreate";
import { useSession } from "next-auth/react";

interface Game {
  id: string;
  title: string;
  content: string;
  createdat: Date;
  updatedat: Date;
  genre: string;
  rating: number;
  downloadurl: string;
}

interface iappProps {
  games: Game[];
}

export default function Gamespage({ games }: iappProps) {
  const { data: session } = useSession();
  const user = session?.user?.id;

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");

  // Extract unique values for filtering options
  const uniqueTitles = Array.from(new Set(games.map((game) => game.title)));
  const uniqueGenres = Array.from(new Set(games.map((game) => game.genre)));
  const uniqueRatings = Array.from(new Set(games.map((game) => game.rating)));

  // Filter games based on selected criteria
  const filteredGames = games.filter((game) => {
    const matchesTitle = selectedTitle
      ? game.title.toLowerCase().includes(selectedTitle.toLowerCase())
      : true;
    const matchesGenre = selectedGenre ? game.genre === selectedGenre : true;
    const matchesRating =
      selectedRating === "above-5"
        ? game.rating > 5
        : selectedRating === "above-7"
        ? game.rating > 7
        : selectedRating === "above-9"
        ? game.rating > 9
        : true;

    return matchesTitle && matchesGenre && matchesRating;
  });

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-8 space-y-8 relative">
      {/* Expandable Button */}
      {user && user === "cmak8m28w0000ugg8epcmn5ll" && (
        <div className="absolute top-4 right-4 z-10">
          <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Close Form" : "Add a Game"}
          </Button>
        </div>
      )}

      <div
        className={`w-full max-w-lg mx-auto mb-4 transition-all duration-300 ease-in-out`}
      >
        {isExpanded && (
          <Card className="shadow-lg rounded-lg border-2 border-white bg-white/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Add game</CardTitle>
              <CardDescription>Add a new Game</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="max-w-lg mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-lg flex flex-col gap-4"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  await Createnewgame(formData);
                }}
              >
                <h2 className="text-2xl font-bold text-center mb-4">
                  Create a New Game
                </h2>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold">Game Title</span>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter game title..."
                    className="p-2 border border-gray-600 rounded bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold">Description</span>
                  <textarea
                    name="content"
                    placeholder="Game description..."
                    className="p-2 border border-gray-600 rounded bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    required
                  ></textarea>
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold">Genre</span>
                  <input
                    type="text"
                    name="genre"
                    placeholder="Enter game genre..."
                    className="p-2 border border-gray-600 rounded bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold">Rating (1-10)</span>
                  <input
                    type="number"
                    name="rating"
                    placeholder="Enter game rating..."
                    className="p-2 border border-gray-600 rounded bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="10"
                    required
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold">Download URL</span>
                  <input
                    type="url"
                    name="downloadurl"
                    placeholder="Enter download link..."
                    className="p-2 border border-gray-600 rounded bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </label>

                {/* Four Image URL inputs */}
                {Array.from({ length: 4 }, (_, i) => (
                  <label key={i} className="flex flex-col gap-2">
                    <span className="text-sm font-semibold">
                      Image URL {i + 1}
                    </span>
                    <input
                      type="url"
                      name={`image-${i}`} // This matches formData.get("image-0"), "image-1", etc.
                      placeholder={`Enter image URL ${i + 1}...`}
                      className="p-2 border border-gray-600 rounded bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </label>
                ))}

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 mt-4"
                >
                  Create New Game
                </button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4">
        {/* Title Search Filter */}
        <input
          type="text"
          value={selectedTitle}
          onChange={(e) => setSelectedTitle(e.target.value)}
          placeholder="Search or Select Title..."
          className="p-2 rounded bg-white border border-gray-300"
          list="title-options"
        />

        <datalist id="title-options">
          {uniqueTitles.map((title) => (
            <option key={title} value={title} />
          ))}
        </datalist>

        {/* Genre Filter */}
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="p-2 rounded bg-white"
        >
          <option value="">All Genres</option>
          {uniqueGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        {/* Rating Filter */}
        <select
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          className="p-2 rounded bg-white"
        >
          <option value="">All Ratings</option>
          <option value="above-5">Above 5</option>
          <option value="above-7">Above 7</option>
          <option value="above-9">Above 9</option>
        </select>
      </div>

      {/* Display Filtered Games */}
      <div className="flex flex-wrap justify-center gap-8">
        {filteredGames.length > 0 ? (
          filteredGames.map((game) => (
            <GameCard key={game.id} GameCards={game} />
          ))
        ) : (
          <p className="text-white">No games match the selected filters.</p>
        )}
      </div>
    </div>
  );
}
