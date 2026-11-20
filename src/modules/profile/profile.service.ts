import { pool } from "../../db";
import type { IProfile } from "./profile.interface";

const getAllProfilesFromDB = async () => {
  const result = await pool.query(`
    SELECT p.id, p.userId, p.bio, p.address, p.phone, p.links, p.is_active,
           u.name, u.email, u.age, u.role
    FROM profiles p
    LEFT JOIN users u ON u.id = p.userId
      `);
  return result;
};

const getProfileFromDB = async (payload: string | number) => {
  const result = await pool.query(
    `
        SELECT p.id, p.userId, p.bio, p.address, p.phone, p.links, p.is_active,
               u.name, u.email, u.age, u.role
        FROM profiles p
        LEFT JOIN users u ON u.id = p.userId
        WHERE p.userId::TEXT = $1;
      `,
    [payload],
  );
  return result;
};
const getMyProfileFromDB = async (payload: string | number) => {
  const result = await pool.query(
    `
        SELECT p.id, p.userId, p.bio, p.address, p.phone, p.links, p.is_active,
               u.name, u.email, u.age, u.role
        FROM profiles p
        LEFT JOIN users u ON u.id = p.userId
        WHERE p.userId::TEXT = $1;
      `,
    [payload],
  );
  return result;
};

const createProfileIntoDB = async (payload: IProfile) => {
  const { userId, bio, address, phone, links } = payload;
  const result = await pool.query(
    `
        INSERT INTO profiles (userId, bio, address, phone, links, is_active) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
    [userId, bio, address, phone, links ?? [], true],
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
  const { userId, bio, address, phone, links } = payload;

  const result = await pool.query(
    `
      UPDATE profiles
      SET
        userId = COALESCE($1, userId),
        bio = COALESCE($2, bio),
        address = COALESCE($3, address),
        phone = COALESCE($4, phone),
        links = COALESCE($5, links),
        updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `,
    [userId ?? null, bio ?? null, address ?? null, phone ?? null, links ?? null, id],
  );

  return result;
};
const deleteProfileFromDB = async (payload: string | number) => {
  const result = await pool.query(
    `
        DELETE FROM profiles
        WHERE id::TEXT = $1 OR userId::TEXT = $1
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
