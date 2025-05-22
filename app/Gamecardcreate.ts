"use server";
import { create } from "domain";
import { prisma } from "./utils/db";
import { redirect } from "next/navigation";

export async function Createnewgame(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const genre = formData.get("genre") as string;
  const rating = Number(formData.get("rating"));
  const mainimage = formData.get("image-0") as string;
  const image1 = formData.get("image-1") as string;
  const image2 = formData.get("image-2") as string;
  const image3 = formData.get("image-3") as string;
  const downloadurl = formData.get("downloadurl") as string;

  const newGame = await prisma.games.create({
    data: {
      title,
      content,
      genre,
      rating,
      downloadurl,
      imageurl: {
        create: [
          { title: "Main Image", imageurl: mainimage },
          { title: "Image 1", imageurl: image1 },
          { title: "Image 2", imageurl: image2 },
          { title: "Image 3", imageurl: image3 },
        ],
      },
    },
  });

  console.log(newGame);
  return redirect("/games");
}
