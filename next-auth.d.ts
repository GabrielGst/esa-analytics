import "next-auth";
import "next-auth/jwt"

declare module "next-auth" {
  interface User {
    email: string;
    name: string;
    access_token: string;
    refresh_token: string;
    expires_on: number;
    exp:number;
    iat:number;
    jti:string;
    group_membership: string;
    role: string;
  }

  interface Session extends DefaultSession {
    user: User;
    expires_in: string;
    error: string;
  }

  // interface JWT extends DefaultJWT {
  //   name?: string;
  //   email?: string;
  //   role?: string;
  //   group_membership?: string;
  // }
}


declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    name: string;
    email: string;
    role: string;
    group_membership: string;
  }
}

export type AuthenticatedRequest = NextRequest & {
  auth?: Session | null;
};