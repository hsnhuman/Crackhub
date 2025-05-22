import { prisma } from "@/app/utils/db";
import { getVerifacationTokenbyEmail } from "@/data/Verefication-token";
import { v4 as uuidv4 } from "uuid";

export const genarateVereficationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date().getTime() + 1000 * 60 * 60 * 1;

  const exsitingToken = await getVerifacationTokenbyEmail(email);

  if (exsitingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: exsitingToken.id,
      },
    });
  }
  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires: new Date(expires),
    },
  });
  return verificationToken;
};
