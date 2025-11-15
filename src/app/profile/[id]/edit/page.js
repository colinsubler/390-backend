import AddProfileForm from "@/components/AddProfileForm";
import DeleteButton from "@/components/DeleteButton";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const runtime = "nodejs";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const profile = await prisma.profiles.findUnique({
    where: { id: parseInt(id) },
  });

  return {
    title: `Edit Profile ${profile.name}`,
    description: `Edit the profile details of ${profile.name}.`,
  };
}

export default async function ProfileEditPage({ params }) {
  const { id } = await params;

  const profile = await prisma.profiles.findUnique({
    where: { id: parseInt(id) },
  });
    return (
    <>
      <h1>Edit Profile {profile.name}</h1>
      <AddProfileForm initialData={profile} />
      <DeleteButton profileId={profile.id} />
      
    </>
  );
}
