import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized access!",
      });
    }
    const decode = jwt.verify(token as string, config.auth_secret) as JwtPayload;
    const user = await pool.query(
      `
      SELECT * FROM users WHERE email=$1
      `,
      [decode.email],
    );
    if (user.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found!!",
      });
    }
    if (!user.rows[0].is_active) {
      return res.status(403).json({
        success: false,
        message: "Forbidden!!",
      });
    }

    // roles = ["admin", "agent", "user"]
    // user.role = "admin"
    if (roles.length && !roles.includes(user.rows[0].role)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access!!",
      });
    }

    //console.log(req);  req : { body : ""}
    req.user = decode;
    //console.log(req);  req : { body : "", user : ""}

    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
};
