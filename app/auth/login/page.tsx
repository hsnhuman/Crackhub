import { prisma } from "@/app/utils/db";
import AuthCard from "@/components/general/AuthCard";

export default async function loginpage() {
  return <AuthCard />;
}
