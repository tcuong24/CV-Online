import { DefaultSession } from 'next-auth';
import { DefaultJWT }    from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id:               string;
      accessToken:      string;  // JWT của NestJS — dùng để gọi API
      subscriptionType: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    userId?:           string;
    accessToken?:      string;
    subscriptionType?: string;
  }
}