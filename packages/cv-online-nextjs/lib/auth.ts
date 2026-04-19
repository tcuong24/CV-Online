import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

// Shape response từ NestJS /auth/login
interface NestLoginResponse {
  access_token: string;
  user: {
    id:               string;
    email:            string;
    fullName:         string;
    avatarUrl:        string | null;
    subscriptionType: string;
  };
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },

  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(
            `${process.env.NEST_API_URL}/auth/login`,
            {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body:    JSON.stringify({
                email:    credentials.email,
                password: credentials.password,
              }),
            }
          );

          // NestJS trả 401/400 khi sai credentials
          if (!res.ok) return null;

          const data: NestLoginResponse = await res.json();

          // Trả về object — NextAuth sẽ đưa vào jwt callback
          return {
            id:               data.user.id,
            email:            data.user.email,
            name:             data.user.fullName,
            image:            data.user.avatarUrl ?? undefined,
            accessToken:      data.access_token,
            subscriptionType: data.user.subscriptionType,
          };
        } catch {
          // NestJS down hoặc network error
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // Chạy khi tạo/refresh JWT — lưu thêm data vào token
    async jwt({ token, user, account, trigger, session }) {
      // Lần đầu đăng nhập: user object có giá trị (từ authorize trả về)
      if (user) {
        token.userId           = user.id;
        token.accessToken      = (user as any).accessToken;
        token.subscriptionType = (user as any).subscriptionType;
      }

      // Google OAuth: gọi NestJS để đổi id_token → access_token của hệ thống
      if (account?.provider === 'google' && account.id_token) {
        try {
          const res = await fetch(
            `${process.env.NEST_API_URL}/auth/google`,
            {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body:    JSON.stringify({ idToken: account.id_token }),
            }
          );
          if (res.ok) {
            const data: NestLoginResponse = await res.json();
            token.userId           = data.user.id;
            token.accessToken      = data.access_token;
            token.subscriptionType = data.user.subscriptionType;
          }
        } catch {
          // Google OAuth lỗi — giữ token Google mặc định
        }
      }

      if (trigger === 'update' && session?.user?.image) {
        token.image = session.user.image;
      }

      return token;
    },
    // Chạy khi client gọi useSession() — expose data từ token ra ngoài
    async session({ session, token }) {
      session.user.id               = token.userId          as string;
      session.user.accessToken      = token.accessToken     as string;
      session.user.subscriptionType = token.subscriptionType as string;
      if (token.image) {
        session.user.image = token.image as string;
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth',
    error:  '/auth',
  },
};