import "@/app/globals.css";

import AppLayout from "@/components/web-tools/AppLayout";



export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en" className="min-h-screen overflow-scroll scroll-smooth">
      <body className="bg-[url('SolarOrbiter_BG_Logo.jpg')] bg-no-repeat bg-cover bg-center bg-fixed">
        {/* Portal target for modal */}
        <div id="modal-root" className="h-0">
        </div>

        {/* Main app layout */}
        <div className="w-full 2xl:w-4/5 flex justify-self-center">
          <AppLayout>
            {children}
          </AppLayout>
        </div>

        {/* <Toaster /> */}
      </body>
    </html>
  );
}

export const metadata = {
  title: "CIC-IC Automation Hub",
  description: "Hosting automation tools and docs for the CIC-IC team.",
  icons: {
    icon: '/robot_flat.svg', // /public path
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};
