'use client';
import LoginButton from "@/components/web-tools/login-button";
import SignIn from "@/components/web-tools/sign-in"
import { Button } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const { data: session, status } = useSession();

  return (
    <div className="p-4 md:p-10 self-center w-full max-w-md mx-auto">
      {
        session && (session.user?.group_membership !== 'authorized') &&
        <div className="flex flex-col gap-3">
          <div className="bg-black text-white p-3 rounded-sm prose max-w-none">
            <p>
              Signed in as {session?.user?.email}. Your account is not part of the CIC-IC NMS-AM-PECS group.
            </p>
          </div>
          <Link href={'/home/contact'} className="self-center">
            <Button>Contact an administrator</Button>
          </Link>
        </div>
      }

      {
        !session &&
        <div className="flex flex-col gap-3">
          <div className="bg-black text-white p-3 rounded-sm prose max-w-none">
            <p>
              Please sign in to access CIC-IC Automation Hub.
            </p>
          </div>
          <div className="self-center">
            <SignIn />
          </div>
        </div>
      }
    </div>
  );
}
