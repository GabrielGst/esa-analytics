
"use client";

import { TopNavBar } from "@/components/web-tools/customNavBar";

import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { SessionProvider } from "next-auth/react";

import { usePathname } from "next/navigation";

export default function AppLayout({
  children,
  // session
}: {
  children: React.ReactNode,
  // session: Session,
}) {

  const path = usePathname()
  // console.log(path)

  if (['/login', '/logout'].includes(path)) {
    return (
      <MantineProvider>
          <Notifications />
          <SessionProvider>
            <div className="w-full grid grid-cols-1 grid-rows-[80px_1fr_80px] gap-4 bg-transparent" >
              <div id='row-1' className="w-full grid grid-cols-3 md:grid-cols-5 grid-rows-1 gap-4 bg-black ">
                <div className="order-2 md:order-1 flex justify-center items-center">
                  <p className="text-white text-sm font-semibold whitespace-nowrap">CIC-IC Analytics</p>
                </div>

                <div className="order-3 md:order-2 col-span-1 md:col-span-3 content-center">
                    <TopNavBar />
                </div>

                <div className="order-1 md:order-3 flex">
                  <img className="object-scale-down self-center scale-75 xl:scale-60" src="/ESA_logo_2020_White.png"></img>
                </div>
              </div>

              <div id='row-2' className="w-full grid grid-cols-1 md:grid-cols-5 grid-rows-1 gap-4 pr-4 pl-4">
                <div className="col-span-1 md:col-span-5 row-span-1 p-4 h-screen flex justify-center">
                  {/* <SessionProvider> */}
                    {children}
                  {/* </SessionProvider> */}
                </div>
              </div>

              

              <div id='row-3' className="w-full grid grid-cols-5 gap-4 ">
                <div className=""></div>
                <div className="col-span-3"></div>
                <div className=""></div>
              </div>
            </div>
          </SessionProvider>
      </MantineProvider>
    )
  } else {
    return (
      <MantineProvider>
          <Notifications />
            <div className="w-full grid grid-cols-1 grid-rows-[80px_1fr_80px] gap-4">
              <div id='row-1' className="w-full grid grid-cols-3 md:grid-cols-5 grid-rows-1 gap-4 bg-black ">
                <div className="order-2 md:order-1 flex justify-center items-center">
                  <p className="text-white text-sm font-semibold whitespace-nowrap">CIC-IC Analytics</p>
                </div>

                <div className="order-3 md:order-2 col-span-1 md:col-span-3 content-center">
                  <TopNavBar />
                </div>

                <div className="order-1 md:order-3 flex">
                  <img className="object-scale-down self-center scale-75 xl:scale-60" src="/ESA_logo_2020_White.png"></img>
                </div>
              </div>

              <div id='row-2' className="w-full grid grid-cols-1 md:grid-cols-5 grid-rows-1 gap-4 pr-4 pl-4 bg-white">
                <div className="col-span-1 md:col-span-5 row-span-1 p-4">
                  <SessionProvider>
                    {children}
                  </SessionProvider>
                </div>
              </div>

              <div id='row-3' className="w-full flex items-center justify-center bg-black px-4">
                <p className="text-white text-sm whitespace-nowrap">
                  © Powered by <a href="mailto:gabriel.gostiaux@insead.edu" className="text-white underline">Gabriel Gostiaux</a>.
                </p>
              </div>
            </div>
      </MantineProvider>
    )
  }
}