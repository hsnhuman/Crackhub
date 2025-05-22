import { prisma } from "../utils/db";
import Gamespage from "@/components/general/Games";
async function getData() {
  "use server";
  const data = await prisma.games.findMany();
  return data;
}
export default async function Games() {
  const games = await getData();
  console.log("Fetched Games:", games);

  return <Gamespage games={games} />;
}
