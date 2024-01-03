import NextAuth, { DefaultUser, RequestInternal } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient, users } from "@prisma/client"

const prisma = new PrismaClient();

const handler = NextAuth({
  secret: "secret",
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials: Record<"username" | "password", string> | undefined, req: Pick<RequestInternal, "query" | "body" | "headers" | "method">): Promise<DefaultUser | null> {
        const prisma = new PrismaClient();
      
        const matchUser = await prisma.users.findFirst({
          where: {
            username: credentials?.username,
          },
          include: {
            user_loket: {
              include: {
                loket: true,
              },
            },
          },
        });
      
        if (!matchUser) {
          return null;
        }
      
        const passwordCorrect = await compare(credentials?.password || '', matchUser.password);
      
        if (passwordCorrect) {
          const userLoketsData = matchUser.user_loket.map((userLoket) => {
            return {
              id: userLoket.id,
              user_id: userLoket.user_id,
              loket_id: userLoket.loket_id,
              aktif: userLoket.aktif,
              loket: {
                id: userLoket.loket.id,
                kodeloket: userLoket.loket.kodeloket,
                loket: userLoket.loket.loket,
                aktif: userLoket.loket.aktif,
              },
            };
          });
          
          const returnedUserData = {
            id: matchUser.id,
            name: matchUser.nama,
            jabatan: matchUser.jabatan,
            role: matchUser.role,
            is_akses_bacameter: matchUser.is_akses_bacameter,
            is_user_ppob: matchUser.is_user_ppob,
            list_authorized_page: matchUser.list_authorized_page,
            ppob_token: matchUser.ppob_token,
            api_version: matchUser.api_version,
            is_active: matchUser.is_active,
            deleted_at: matchUser.deleted_at,
            user_lokets: userLoketsData,
          };

          console.log("returnedUserData", returnedUserData);
      
          return returnedUserData as any;
        }
      
        return null;
      }
      
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          jabatan: user.jabatan,
          role: user.role,
          is_akses_bacameter: user.is_akses_bacameter,
          is_user_ppob: user.is_user_ppob,
          list_authorized_page: user.list_authorized_page,
          ppob_token: user.ppob_token,
          api_version: user.api_version,
          is_active: user.is_active,
          deleted_at: user.deleted_at,
          user_lokets: user.user_lokets,
        };
        // console.log("token data:", token);
      }
      return token;
    },
    async session({ session, user, token }) {
      session.user = token.user as any;
      // console.log("token passed to session", token);
      return session
    },
  }
});

export { handler as GET, handler as POST };