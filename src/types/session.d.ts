import 'express-session';
import { User } from 'src/modules/user/entities/user.entity';

declare module 'express-session' {
  interface SessionData {
    userInfo?: User;
  }
}
