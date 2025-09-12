'use client';
import LoginButton from "@/components/web-tools/login-button";
import SignIn from "@/components/web-tools/sign-in"
import { Button } from "@mantine/core";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const { data: session, status } = useSession();

  return (
    <div className="p-10 self-center">
      {
        session && (session.user?.group_membership !== 'authorized') && 
        <div className="flex flex-col justify-center">
          <div className="bg-black text-white p-2 mb-2 rounded-sm prose max-w-none">
            <p>
              Signed in as {session?.user?.email} with group membership {session?.user?.group_membership} since you are not member of the group CIC-IC NMS-AM-PECS.
            </p>
          </div>
          <div className="self-center">
            <Link href={'/home/contact'}>
              <Button>
                Please contact an administrator to add you to the group if relevant.
              </Button>
            </Link>
          </div>
        </div>
      }

      {
        !session && 
        <div className="flex flex-col justify-center">
          <div className="bg-black text-white p-2 mb-2 rounded-sm prose max-w-none">
            <p>
              Please sign in to access CIC-IC Automation Hub.
            </p>
          </div>
          <div className="self-center">
            <Link href={'/home/contact'}>
              <Button>
                Please contact an administrator to add you to the group if relevant.
              </Button>
            </Link>
          </div>
        </div>
      }

    </div>
  );
}
