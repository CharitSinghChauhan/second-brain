import type { IUser } from "./usertype.js";

// TODO : Read the blog 
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      cookies?: Record<string, string>;
    }
  }
}
