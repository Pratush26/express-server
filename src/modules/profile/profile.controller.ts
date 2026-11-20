import type { Request, Response } from "express";
import { profileService } from "./profile.service";
import sendResponse from "../../utils/sendResponse";

const createProfile = async (req: Request, res: Response) => {
  try {
    const { userId, bio, address, phone, links } = req.body;
    if (!userId || !bio || !address || !phone) {
      sendResponse(false, 400, res, { message: "Some data are missing!!" });
    }
    const result = await profileService.createProfileIntoDB({
      userId,
      bio,
      address,
      phone,
      links: links ?? [],
    });

    if (result.rowCount === 0) {
      sendResponse(false, 404, res, { message: "Profiles not found!!" });
    }
    sendResponse(true, 200, res, {
      message: "Profiles retrived successfully!",
      data: result.rows,
    });
  } catch (err) {
    sendResponse(false, 500, res, {
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
};

const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const result = await profileService.getAllProfilesFromDB();

    if (result.rowCount === 0) {
      sendResponse(false, 404, res, { message: "Profiles not found!!" });
    }
    sendResponse(true, 200, res, {
      message: "Profiles retrived successfully!",
      data: result.rows,
    });
  } catch (err) {
    sendResponse(false, 500, res, {
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
      sendResponse(false, 404, res, { message: "Profiles not found!!" });
    }
    sendResponse(true, 200, res, {
      message: "Profiles retrived successfully!",
      data: result.rows,
    });
  } catch (err) {
    sendResponse(false, 500, res, {
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, bio, address, phone, links } = req.body;
    if (!id || typeof id !== "string" || typeof id !== "number") {
      return sendResponse(false, 400, res, { message: "Invalid profile ID" });
    }
    const result = await profileService.updateProfileFromDB({
      id,
      payload: { userId, bio, address, phone, links },
    });

    if (result.rowCount === 0) {
      return sendResponse(false, 404, res, { message: "Profile not found!" });
    }

    return sendResponse(true, 200, res, {
      message: "Profile updated successfully!",
      data: result.rows[0],
    });
  } catch (err) {
    return sendResponse(false, 500, res, {
      message: err instanceof Error ? err.message : "Something went wrong",
    });
  }
};

const deleteProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await profileService.deleteProfileFromDB(id as string | number);

    if (result.rowCount === 0) {
      sendResponse(false, 404, res, { message: "Profile not found for deleting!" });
    }
    sendResponse(true, 200, res, {
      message: "Profile deleted successfully!",
      data: result.rows,
    });
  } catch (err) {
    sendResponse(false, 500, res, {
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
