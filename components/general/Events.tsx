"use client";
import { useState, useEffect } from "react";
import BlogpostCard from "@/components/general/BlogpostCard";
import { handleSubmition } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


interface BlogPost {
  id: string;
  title: string;
  content: string;
}

interface Game {
  id: string;
  title: string;
}

interface EventsProps {
  blogPosts: BlogPost[];
  games: Game[];
}

export default function Events({ blogPosts, games }: EventsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // For filtering games
  const [selectedGame, setSelectedGame] = useState(""); // Track selected game

  const filteredGames = games.filter((game) =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-500 to-purple-600 px-4 relative">
      {/* Expandable Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Close Form" : "Create Post"}
        </Button>
      </div>

      {/* Collapsible Form Card */}
      <div
        className={`w-full max-w-lg mx-auto mb-4 transition-all duration-300 ease-in-out`}
      >
        {isExpanded && (
          <Card className="shadow-lg rounded-lg border-2 border-white bg-white/80 backdrop-blur-md">
            <CardHeader>
              <CardTitle>Create Post</CardTitle>
              <CardDescription>Create a new post</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="flex flex-col gap-4"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  await handleSubmition(formData);
                }}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="private"
                    name="private"
                    className="w-5 h-5"
                  />
                  <label htmlFor="private">Private</label>
                </div>
                <div className="flex flex-col gap-2">
                  <label>Title</label>
                  <Input
                    required
                    type="text"
                    name="title"
                    placeholder="Title"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label>Description</label>
                  <Textarea required name="content" placeholder="Content" />
                </div>
                <div className="flex flex-col gap-2">
                  <label>Game</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for a game..."
                    className="border rounded px-2 py-1"
                  />
                  <select
                    required
                    name="game"
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    {filteredGames.map((game) => (
                      <option key={game.id} value={game.title}>
                        {game.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label>Scheduled Date & Time</label>
                  <Input
                    required
                    type="datetime-local"
                    name="scheduled_at"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <Button type="submit">Create Post</Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Events Section */}
      <div
        className="flex-1 overflow-y-auto mt-4 px-4 pt-4"
        style={{
          paddingTop: isExpanded ? "0" : "1rem",
          transition: "padding-top 0.3s ease",
        }}
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Events
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {blogPosts
            .filter((post) => !post.private)
            .map((post) => (
              <BlogpostCard key={post.id} post={post} />
            ))}
        </div>
      </div>
    </div>
  );
}
