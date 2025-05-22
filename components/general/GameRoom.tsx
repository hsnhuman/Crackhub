"use client";
import React, { useState } from "react";

interface iappProps {
  gameData: {
    id: string;
    title: string;
    content: string;
    createdat: Date;
    updatedat: Date;
    genre: string;
    rating: number;
    downloadurl: string;
  };
  imageData: { imageurl: string }[]; // Ensure this is an array
}

export default function GameRoom({ gameData, imageData }: iappProps) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 to-black text-white flex flex-col items-center p-8 space-y-8">
      {/* Game Title */}
      <h1 className="text-4xl font-bold text-center">
        {gameData?.title || "Not Found"}
      </h1>

      {/* Game Rating */}
      <p className="text-lg text-gray-300">
        ⭐ Rating: {gameData?.rating ?? "N/A"}/10
      </p>

      {/* Image Display */}
      <div className="w-full max-w-3xl bg-gray-700 rounded-lg p-6 flex flex-col items-center space-y-4">
        {/* Main Image */}
        {imageData?.length > 0 && (
          <img
            src={imageData[0].imageurl}
            alt="Main Game Image"
            className="w-full h-64 object-cover rounded-md"
          />
        )}

        {/* Image Slider */}
        <div className="w-full flex overflow-x-auto space-x-4">
          {imageData?.slice(1).map((img, index) => (
            <img
              key={index}
              src={img.imageurl}
              alt={`Game Image ${index + 1}`}
              className="w-40 h-40 object-cover rounded-md"
            />
          ))}
        </div>
      </div>

      {/* Game Content */}
      <div className="max-w-3xl bg-gray-700 rounded-lg p-6 text-lg leading-relaxed">
        <p>{gameData?.content || "No description available."}</p>
      </div>

      {/* Download Button */}
      <div className="mt-8">
        <a
          href={gameData?.downloadurl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition duration-300"
        >
          Download from here
        </a>
      </div>
    </div>
  );
}
