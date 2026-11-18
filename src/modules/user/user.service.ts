import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./user.interface";

const getAllUsersFromDB = async () => {
  const result = await pool.query(`
    SELECT * FROM users  
      `);
  return result;
};

const getUserFromDB = async (payload: string | number) => {
  const result = await pool.query(
    `
        SELECT * FROM users
        WHERE id::TEXT = $1 OR email = $1;
      `,
    [payload],
  );
  return result;
};
const createUserIntoDB = async ({payload}: {payload: IUser}) => {
    const { name, email, password, age } = payload
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `
        INSERT INTO users (name, email, password, age) VALUES ($1, $2, $3, $4)
        `,
      [name, email, password, age],
    );
    return result
}

export const userService = {
  getAllUsersFromDB,
  getUserFromDB,
  createUserIntoDB,
};
