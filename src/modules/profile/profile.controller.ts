import type { Request, Response } from "express";
import { profileService } from "./profile.service";

const createProfile = async (req: Request, res: Response) => {
  try {
    const { name, email, password, age } = req.body;
    if (!name || !email || !password || !age) {
      res.status(400).json({
        success: false,
        message: "Some data are missing!!",
      });
    }
    const result = await profileService.createProfileIntoDB({
      name,
      email,
      password,
      age,
    });

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Profiles not found!!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Profiles retrived successfully!",
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
};

const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const result = await profileService.getAllProfilesFromDB();

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Profiles not found!!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Profiles retrived successfully!",
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
};

const getMyProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await profileService.getMyProfileFromDB(id as string | number);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Profiles not found!!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Profiles retrived successfully!",
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, age } = req.body;
    if (!id || typeof id !== "string" || typeof id !== "number") {
      return res.status(400).json({
        success: false,
        message: "Invalid profile ID",
      });
    }
    const result = await profileService.updateProfileFromDB({
      id,
      payload: { name, email, password, age },
    });

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Profile not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      data: result.rows[0],
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    });
  }
};

const deleteProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await profileService.deleteProfileFromDB(id as string | number);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Profile not found for deleting!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Profile deleted successfully!",
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
};

export const profileController = {
  createProfile,
  getAllProfiles,
  getMyProfile,
  updateProfile,
  deleteProfile,
};
