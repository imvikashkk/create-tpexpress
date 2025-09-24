import "express-session";

/* Type Decration For Sesstion */
/* eg. req.session.user */
declare module "express-session" {
  interface SessionData {
    user?: {
      id: number;
      email: string;
    };
  }
}
