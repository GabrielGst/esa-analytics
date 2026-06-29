"use client"
import { useState } from 'react';
import SubMenu from './subMenu';
import LoginButton from './login-button';
import SignIn from './sign-in';
import SignOut from './sign-out';
import { SessionProvider } from 'next-auth/react';
import { Burger, Drawer, NavLink } from '@mantine/core';

export type modules = {
  title: string;
  href: string;
  description: string;
}

export type menuType = {
  [title: string]: modules[] | menuType
}

const applications: modules[] = [
  {
    title: "Documents",
    href: "",
    description:
      "Sharepoint NMS-AM-PECS documents",
  },
  {
    title: "Automation App - AMAP",
    href: "",
    description:
      "Helps CIC-IC throughout tender opening to tender evaluation.",
  },
  {
    title: "Power BI report dashboard",
    href: "",
    description:
      "CIC-IC Reporting.",
  },
  {
    title: "Annual Review App - ARPP Portal",
    href: "",
    description:
      "Performs the annual review of all activities.",
  },
]

const ssapModules: modules[] = [
  {
    title: "Create Story",
    href: "/tools/success-story/activities",
    description:
      "Browse, select activities and start your story.",
  },
  {
    title: "View Stories",
    href: "/tools/success-story/stories",
    description:
      "Browse stories, check status, select for edition and create powerpoint.",
  },
]

const homeModule: modules[] = [
  {
    title: "Home",
    href: "/",
    description: "This is the homecenter of automation application of CIC-IC division.",
  },
  {
    title: "Contact",
    href: "/home/contact",
    description: "If you ran into an issue, we welcome any feedback !",
  },
]

const arapModule: modules[] = [
  {
    title: "Annual Review Tracking",
    href: "/tools/activity-tracking",
    description: "Generate draft annual review reports."
  }
]

const menu: menuType = {
  "Home": homeModule,
  "Success Story App": ssapModules,
  "Annual Review Tracking": arapModule,
}

export const isModulesArray = (val: any): val is modules[] => {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === 'object' &&
    'title' in val[0] &&
    'href' in val[0] &&
    'description' in val[0]
  );
};


export function TopNavBar() {
  const [drawerOpened, setDrawerOpened] = useState(false);

  return (
    <SessionProvider>
      {/* Desktop nav — hidden on small screens */}
      <div className='hidden md:flex justify-around content-center'>
        {Object.entries(menu).map(([key, value]) => (
          <SubMenu key={key} target={key} subMenu={value} />
        ))}
        <LoginButton />
      </div>

      {/* Mobile burger — hidden on md+ */}
      <div className='flex md:hidden justify-end items-center px-2'>
        <Burger
          opened={drawerOpened}
          onClick={() => setDrawerOpened(o => !o)}
          color="white"
          aria-label="Toggle navigation"
        />
      </div>

      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title="Navigation"
        size="xs"
        padding="md"
      >
        <div className="flex flex-col">
          {Object.entries(menu).map(([key, value]) => (
            <div key={key} className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-3 py-1">{key}</p>
              {isModulesArray(value)
                ? value.map((item) => (
                    <a key={item.href} href={item.href} onClick={() => setDrawerOpened(false)}>
                      <NavLink label={item.title} description={item.description} />
                    </a>
                  ))
                : Object.entries(value).map(([subKey, subValue]) => (
                    <div key={subKey} className="ml-2">
                      <p className="text-xs text-gray-400 px-3 py-0.5">{subKey}</p>
                      {isModulesArray(subValue) && subValue.map((item) => (
                        <a key={item.href} href={item.href} onClick={() => setDrawerOpened(false)}>
                          <NavLink label={item.title} description={item.description} />
                        </a>
                      ))}
                    </div>
                  ))
              }
            </div>
          ))}
          <div className="mt-4 px-3">
            <LoginButton />
          </div>
        </div>
      </Drawer>
    </SessionProvider>
  );
}








//     <NavigationMenu className="justify-around justify-self-center w-sm self-center">
//       <NavigationMenuList>
//         <NavigationMenuItem >
//           <NavigationMenuTrigger className="bg-stone-950 text-white">Home</NavigationMenuTrigger>
//           <NavigationMenuContent>
//             <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr_1fr]">
//               <li className="row-span-3 col-span-2">
//                 <NavigationMenuLink asChild>
//                   <a
//                     className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/10 to-muted/80 p-4 no-underline outline-none focus:shadow-md"
//                     href="/"
//                   >
//                     {/* <Icons.logo className="h-6 w-6" /> */}
//                     <div className="text-lg font-medium align-middle">
//                       CIC-IC Homecenter
//                     </div>
//                     <p className="text-sm leading-tight text-muted-foreground">
//                       This is the homecenter of automation application of CIC-IC division.
//                     </p>
//                   </a>
//                 </NavigationMenuLink>
//               </li>

//               {
//                 homeModule.map((item) => (

//                 <li key={item.href}  className="row-span-3">
//                   <NavigationMenuLink asChild>
//                     <a
//                       className="flex h-full w-full select-none flex-col justify-start rounded-md bg-gradient-to-b from-muted/10 to-muted/80 p-4 no-underline outline-none focus:shadow-md"
//                       href={item.href}
//                     >
//                       {/* <Icons.logo className="h-6 w-6" /> */}
//                       <div className="text-lg font-medium ">
//                         {item.title}
//                       </div>
//                       <p className="text-sm leading-tight text-muted-foreground">
//                         {item.description}
//                       </p>
//                     </a>
//                   </NavigationMenuLink>
//                 </li>

//                 ))
//               }

//             </ul>
//           </NavigationMenuContent>
//         </NavigationMenuItem>

//         <NavigationMenuItem>
//           <NavigationMenuTrigger className="bg-stone-950 text-white">Success Story App</NavigationMenuTrigger>
//           <NavigationMenuContent>
//             <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
//               {ssapModules.map((app) => (
//                 <ListItem
//                   className="bg-gradient-to-b from-muted/10 to-muted/80"
//                   key={app.title}
//                   title={app.title}
//                   href={app.href}
//                 >
//                   {app.description}
//                 </ListItem>
//               ))}
//             </ul>
//           </NavigationMenuContent>
//         </NavigationMenuItem>

//         <NavigationMenuItem>
//           <NavigationMenuTrigger className="bg-stone-950 text-white">Annual Review Tracking</NavigationMenuTrigger>
//           <NavigationMenuContent>
//             <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
//               <ListItem
//                 className="bg-gradient-to-b from-muted/10 to-muted/80"
//                 key="ART"
//                 title="Annual Review Tracking"
//                 href="http://industry-analytics-dev.go.esa.int/tools/activity-tracking"
//               >
//                 Tracking annual review inputs, bot triggering annual review process.
//               </ListItem>
//             </ul>
//           </NavigationMenuContent>
//         </NavigationMenuItem>

//         <NavigationMenuItem>
//           <NavigationMenuTrigger className="bg-stone-950 text-white">Automation Tools</NavigationMenuTrigger>
//           <NavigationMenuContent>
//             <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
//               {applications.map((app) => (
//                 <ListItem
//                   className="bg-gradient-to-b from-muted/10 to-muted/80"
//                   key={app.title}
//                   title={app.title}
//                   href={app.href}
//                 >
//                   {app.description}
//                 </ListItem>
//               ))}
//             </ul>
//           </NavigationMenuContent>
//         </NavigationMenuItem>
//       </NavigationMenuList>
//     </NavigationMenu>
//   )
// }

// const ListItem = React.forwardRef<
//   React.ElementRef<"a">,
//   React.ComponentPropsWithoutRef<"a">
// >(({ className, title, children, ...props }, ref) => {
//   return (
//     <li>
//       <NavigationMenuLink asChild>
//         <a
//           ref={ref}
//           className={cn(
//             "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
//             className
//           )}
//           {...props}
//         >
//           <div className="text-sm font-medium leading-none">{title}</div>
//           <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//             {children}
//           </p>
//         </a>
//       </NavigationMenuLink>
//     </li>
//   )
// })
// ListItem.displayName = "ListItem"
