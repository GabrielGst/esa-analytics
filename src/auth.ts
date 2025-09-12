// ./auth.ts
import NextAuth from "next-auth"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"
import Google from "next-auth/providers/google"

// import AzureActiveDirectoryB2C from "next-auth/providers/azure-ad-b2c"
 
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    // MicrosoftEntraID({
    //   clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
    //   clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
    //   issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER!,
    //   // checks: ['none'],
    // }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    async session({ session, token }) {
      // session.user = token as any;
      session.user.email = token.email ?? '';
      session.user.name = token.name ?? '';
      session.user.group_membership = token.group_membership ?? '';
      session.user.role = token.role ?? '';

      // console.log('\n\nSESSION\n')
      // console.log('session')
      // Object.entries(session).forEach((key) => console.log(`${key}`))
      // Object.entries(session.user).forEach((key) => console.log(`${key}`))
      // console.log('token')
      // Object.entries(token).forEach((key, value) => console.log(`${key}: ${value}`))

      return session;
    },
    async jwt({ token, account, profile, user }) {
      token.group_membership = 'authorized';
      token.role = 'admin';
      // if (profile?.groups) {
      //   // console.log("Profile" + profile.groups)
      //   // token.groups = profile.groups;
      //   token.group_membership = Object.values(profile.groups).includes(process.env.CIC_IC_NMS_AM_PECS_MEMBERS) ? 'authorized' : 'denied'; // 'denied'; for test purpose da61ffd8-865c-48be-ae44-03382ca88b9b
      //   // console.log("Email" + token.email)
      //   token.role = ['philippe.schweiger@esa.int', 'gabriel.gostiaux@ext.esa.int'].includes(token.email!) ? 'admin' : 'member';

      //   // console.log('\n\nJWT\n')
      //   // console.log('token')
      //   // Object.entries(token).forEach((key, value) => console.log(`${key}: ${value}`))
      //   // console.log('profile')
      //   // Object.entries(profile).forEach((key, value) => console.log(`${key}: ${value}`))
      //   // console.log('user')
      //   // Object.entries(user).forEach((key, value) => console.log(`${key}: ${value}`))
      // }
      return { ...user, ...token } //{ ...token, ...user }
    }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  // pages: {
  //   signIn: "/login", // Optional: custom login page
  // },
})
