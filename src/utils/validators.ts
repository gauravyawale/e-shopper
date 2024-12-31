import { Request } from "express";

export const isSessionActive = (req: Request): boolean => {
  return !!(req.session as any).user;
};
