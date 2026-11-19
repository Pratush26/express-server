import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserByDB = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;
  const result = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email],
  );
  const matchPassword = await bcrypt.compare(password, result.rows[0].password);

  if (!matchPassword) throw new Error("Invalid credentials!!");

  if (!result.rows[0].is_active) throw new Error("Access denied!!");

  const jwtPayload = {
    id: result.rows[0].id,
    name: result.rows[0].name,
    email: result.rows[0].email,
  };
  const accessToken = jwt.sign(jwtPayload, config.auth_secret, {
    expiresIn: "1d",
  });

  return { accessToken, user: result.rows[0] };
};
export const authService = {
  loginUserByDB,
};
