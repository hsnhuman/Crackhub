import { prisma } from "@/app/utils/db";
import GameRoom from "@/components/general/GameRoom";

async function getData(gameid: string) {
  "use server";

  return await prisma.games.findUnique({
    where: { id: gameid }, // Corrected syntax
  });
}
async function getImage(gameid: string) {
  "use server";

  return await prisma.imageurl.findMany({
    where: { gameId: gameid }, // Corrected syntax
  });
}

export default async function GamePage({ params }: { params: { id: string } }) {
  const id = params.id; // No need to await params
  const gameData = await getData(id); // Renamed variable for clarity
  const imageData = await getImage(id);

  return <GameRoom gameData={gameData} imageData={imageData} />; // Display game name or fallback
}
