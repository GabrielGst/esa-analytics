"use client";
import { Button } from "@mantine/core"
import { useSession, signIn, signOut } from "next-auth/react"
import SignIn from "./sign-in";

export default function LoginButton() {
  const { data: session, status } = useSession();
  if (session) {
    return (
      <>
        {/* Signed in as {session.user?.email} <br /> */}
        {
          <Button onClick={() => signOut()}>
            {session.user?.name ?? 'User'} - Sign Out
          </Button>
        }
      </>
    )
  }
  return (
    <>
      {/* Not signed in <br /> */}
      {/* <Button onClick={() => signIn()}>Sign in</Button> */}
      <SignIn />
    </>
  )
}