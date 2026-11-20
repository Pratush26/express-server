import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
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
    role: result.rows[0].role,
  };
  const accessToken = jwt.sign(jwtPayload, config.auth_secret, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(jwtPayload, config.auth_refresh_secret, {
    expiresIn: "1d",
  });


  return { accessToken, refreshToken, user: result.rows[0] };
};

const generateAccessToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized access!!");
  }
  const decode = jwt.verify(
    token as string,
    config.auth_refresh_secret,
  ) as JwtPayload;
  // console.log(decode);

  const user = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [decode.email],
  );
  //   console.log(user.rows[0]);
  if (user.rowCount === 0) {
    throw new Error("User not found!!");
  }
  if (!user.rows[0].is_active) {
    throw new Error("Forbidden!!");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.auth_secret, {
    expiresIn: "1h",
  });

  return { token: accessToken };
};

export const authService = {
  loginUserByDB,
  generateAccessToken
};