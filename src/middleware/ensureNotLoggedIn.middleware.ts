import {Request, Response, NextFunction} from "express";

export const ensureNotLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    return next();
  }

  // return res.redirect("/me");
  res.status(200).json({message: "Vous ete connecté"})
}