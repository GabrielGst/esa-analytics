"use client"
import SubMenu from './subMenu';
import LoginButton from './login-button';
import SignIn from './sign-in';
import SignOut from './sign-out';
import { SessionProvider } from 'next-auth/react';

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
    href: "http://esa.webagab.fr/tools/success-story/activities",
    description:
      "Browse, select activities and start your story.",
  },
  {
    title: "View Stories",
    href: "http://esa.webagab.fr/tools/success-story/stories",
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
    title: "News",
    href: "/home/news",
    description: "News from dev team : features, updates",
  },
  {
    title: "Contact",
    href: "/home/contact",
    description: "If you ran into an issue, we welcome any feedback !",    
  },
]

const docModule: modules[] = [
  {
    // icon: IconBook,
    title: "Doc - Developpers",
    href: "/documentation/developpers/",
    description: "Implementing new tools, fixing bugs in existing ones",    
  },
  {
    // icon: IconBook,
    title: "Doc - Training Material",
    href: "/documentation/training/",
    description: "External/Delegation focused taining material",    
  },
  {
    // icon: IconBook,
    title: "Doc - Automated Tools Manual",
    href: "/documentation/training-tools/",
    description: "Learn how to use current tools to your advantage",    
  },
]

const arapModule: modules[] = [
  {
    title: "Annual Review Tracking",
    href: "http://esa.webagab.fr/tools/activity-tracking",
    description: "Generate draft annual review reports."
  }
]

const menu: menuType = {
  "Home": {
    "Home": homeModule,
    "Documentations": docModule,
  },
  "Success Story App": ssapModules,
  "Annual Review Tracking": arapModule,
  "Applications": applications
}


export function TopNavBar() {

  return (
    <SessionProvider>
      <div className='flex justify-around content-center'>
        {
          Object.entries(menu).map(([key, value]) => {
            return(
              <SubMenu key={key} target={key} subMenu={value} />
            )
          })
        }
        <LoginButton />
        {/* <SignIn />
        <SignOut /> */}
      </div>
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
