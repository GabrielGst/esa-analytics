// app/api/auth/[...nextauth]/route.ts

import { handlers } from "../../../../auth" // "@/auth"

// console.log("AUTH_URL =", process.env.AUTH_URL);
// console.log("AUTH_TRUST_HOST =", process.env.AUTH_TRUST_HOST);

export const { GET, POST } = handlers




// import NextAuth from "next-auth";
// import authConfig from "@/lib/auth.ts";

// const handler = NextAuth(authConfig);

// export { handler as GET, handler as POST };





// import NextAuth from "next-auth";
// import AzureADProvider from "next-auth/providers/azure-ad";
// import { NextAuthOptions } from "next-auth";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     AzureADProvider({
//       clientId: process.env.AZURE_AD_CLIENT_ID!,
//       clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
//       tenantId: process.env.AZURE_AD_TENANT_ID!,
//     }),
//   ],
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: "/login", // Optional: custom login page
//   },
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
