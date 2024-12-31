import session from "express-session";

declare module "express-session" {
  interface SessionData {
    user: { userId: string } | null;
    resetDetails: { email: string; otp?: string | number } | null;
  }
}
