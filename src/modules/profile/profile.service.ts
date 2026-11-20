import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IProfile } from "./profile.interface";

const getAllProfilesFromDB = async () => {
  const result = await pool.query(`
    SELECT bio, address, phone FROM profiles  
      `);
  return result;
};

const getProfileFromDB = async (payload: string | number) => {
  const result = await pool.query(
    `
        SELECT bio, address, phone, links FROM profiles
        WHERE userId::TEXT = $1;
      `,
    [payload],
  );
  return result;
};
const getMyProfileFromDB = async (payload: string | number) => {
  const result = await pool.query(
    `
        SELECT bio, address, phone, is_active, links FROM profiles
        WHERE userId::TEXT = $1;
      `,
    [payload],
  );
  return result;
};

const createProfileIntoDB = async (payload: IProfile) => {
  const { bio, address, phone, links } = payload;
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
        INSERT INTO profiles (bio, address, phone, links, is_active) VALUES ($1, $2, $3, $4, $5)
        `,
    [bio, address, phone, links, true],
  );
  return result;
};
const updateProfileFromDB = async ({
  id,
  payload,
}: {
  id: string | number;
  payload: Partial<IProfile>;
}) => {
  const { bio, address, phone, links } = payload;

  const result = await pool.query(
    `
      UPDATE profiles
      SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        password = COALESCE($3, password),
        age = COALESCE($4, age),
        updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `,
    [name ?? null, email ?? null, password ?? null, age ?? null, id],
  );

  return result;
};
const deleteProfileFromDB = async (payload: string | number) => {
  const result = await pool.query(
    `
        DELETE FROM profiles
        WHERE id::TEXT = $1 OR email = $1
        RETURNING *;
      `,
    [payload],
  );
  return result;
};

export const profileService = {
  getAllProfilesFromDB,
  getMyProfileFromDB,
  createProfileIntoDB,
  updateProfileFromDB,
  deleteProfileFromDB,
};
