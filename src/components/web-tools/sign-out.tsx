"use client"
import { Button } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { signOut } from "next-auth/react"
 
export default function SignOut() {

  function delayRefresh(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async function handleclick() {
    notifications.show({
      id: 'sign-out',
      color: 'orange',
      title: "Signin Out",
      message: "Successfully Signed Out",
      autoClose: 2000,
    })
    await delayRefresh(2000)
    signOut()
  }

  return <Button
    // size="xl"
    // bg='white'
    // className="border-2 border-solid border-white"
    onClick={() => handleclick()}
    >
      Sign Out
    </Button>
}