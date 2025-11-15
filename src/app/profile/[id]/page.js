import Link from "next/link";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const runtime = "nodejs";

async function fetchProfileData(id) {
  const profile = await prisma.profiles.findUnique({
    where: { id: parseInt(id) },
  });
  if (!profile) {
    throw new Error("Profile not found");
  }
  return profile;
}

export async function generateMetadata({ params }) {
  const { id } = params;
  const profileData = await fetchProfileData(id);

  return {
    title: `${profileData.name} Profile`,
    description: `View the profile details of ${profileData.name}. ${profileData.bio || ""}`,
  };
}

export default async function ProfilePage({ params }) {
  const { id } = params;
  const profileData = await fetchProfileData(id);

  return (
    <>
      <h1>{`${profileData.name}'s Profile`}</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={profileData.image_url}
          alt={`Profile picture of ${profileData.name}`}
        />

        <p style={{ marginTop: "3rem" }}>Email: {profileData.email}</p>
        <p>Bio: {profileData.bio}</p>

        <div style={{ marginTop: "2rem" }}>
          <Link className="button" href={`/profile/${id}/edit`}>
            Edit Profile
          </Link>
        </div>
      </div>
    </>
  );
}
