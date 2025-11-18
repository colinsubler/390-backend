'use client';
import { signOut } from "next-auth/react";

export default function SignoutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <button onClick={handleSignOut}>
      Sign Out
    </button>
  );
}