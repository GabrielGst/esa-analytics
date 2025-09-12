"use client"
import { signIn } from "next-auth/react"
import { Button } from "@mantine/core"

export default function SignIn() {
  return (
    <Button
      // className="p-4"
      // size="xl"
      // bg='black'
      // className="border-2 border-solid border-white"
      onClick={() => signIn("microsoft-entra-id", { redirectTo: "/" })} // , { redirectTo: "/" }
    >
      Signin
    </Button>
  )
}