import { prisma } from "@/app/utils/db";
export const getVerifacationTokenbyEmail = async (email: string) => {
  try {
    const Verifacationtoken = await prisma.verificationToken.findFirst({
      where: {
        email: email,
      },
    });
    return Verifacationtoken;
  } catch (error) {
    console.log(error);
  }
};

export const getVerifacationTokenbyToken = async (token: string) => {
  try {
    const Verifacationtoken = await prisma.verificationToken.findFirst({
      where: {
        token: token,
      },
    });
    return Verifacationtoken;
  } catch (error) {
    console.log(error);
  }
};
