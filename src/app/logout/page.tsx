'use client';
import LoginButton from "@/components/web-tools/login-button";
import SignIn from "@/components/web-tools/sign-in"
import SignOut from "@/components/web-tools/sign-out";
import { Button } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const { data: session, status } = useSession();

  return (
    <div className="p-10 self-center">
        <SignOut></SignOut>
    </div>
  );
}
