"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
interface iappProps {
  GameCards: {
    id: string;
    title: string;
    content: string;
    createdat: Date;
    updatedat: Date;
    genre: string;
    rating: number;
    downloadurl: string;
  };
}

export default function GameCard({ GameCards }: iappProps) {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      const response = await fetch(`/api/getImage?gameId=${GameCards.id}`);
      const data = await response.json();
      if (data && data.url) {
        setImage(data.url);
      }
    }
    fetchImage();
  }, [GameCards.id]);

  return (
    <div
      className="group relative overflow-hidden rounded-b-lg border-gray-200
        bg-white shadow-md transition-all hover:shadow-lg "
    >
      <Link href={`/Game/${GameCards.id}`} className="block w-full h-full">
        <div className="p-4">
          {image ? (
            <img src={image} alt="gameimage" />
          ) : (
            <p>No image available</p>
          )}

          <h3 className="mb-2 text-lg font-semibold text-gray-600">
            {GameCards.title}
          </h3>
          <p className="mb-4 text-sm font-semibold text-gray-400 line-clamp-3">
            {GameCards.content}
          </p>
        </div>
      </Link>
    </div>
  );
}
