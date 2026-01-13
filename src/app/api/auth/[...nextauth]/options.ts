import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import bcrypt from 'bcrypt';
import {dbConnect} from '@/lib/dbConnect';
import UserModel from '@/model/User.model';

export const authConfig: NextAuthConfig = {
  debug: true,
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();
        if (!credentials?.identifier || !credentials?.password) return null;

        const user = await UserModel.findOne({
          $or: [
            { email: (credentials.identifier as string).toLowerCase() },
            { username: credentials.identifier as string},
          ],
        }).select('+password');

        if (!user || !user.isverified) return null;
        const isValid = await bcrypt.compare(credentials?.password  as string, user.password);
        if (!isValid) throw new Error('Incorrect Password');

        return {
          _id: user._id?.toString(), 
          username: user.username,
          isAcceptingMessages: user.isAcceptingMessages,
          isverified: user.isverified,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.username = user.username;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.isverified = user.isverified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id as string;
        session.user.username = token.username as string;
        session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
        session.user.isverified = token.isverified as boolean;
      }
      console.log('[SESSION CALLBACK]', session);
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

