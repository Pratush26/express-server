import { Router, type Request, type Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Welcome to express server!");
});
export const rootRoute = router;