import type { Request, Response } from "express";
import { userService } from "./user.service";
import sendResponse from "../../utils/sendResponse";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, age } = req.body;
    if (!name || !email || !password || !age) {
      sendResponse(false, 400, res, {  message: "Some data are missing!!" });
    }
    const result = await userService.createUserIntoDB({
      name,
      email,
      password,
      age,
    });

    if (result.rowCount === 0) {
      sendResponse(false, 404, res, { message: "Users not found!!" });
    }
    sendResponse(true, 200, res, {
      message: "Users retrived successfully!",
      data: result.rows,
    });
  } catch (err) {
    sendResponse(false, 500, res, {
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsersFromDB();

    if (result.rowCount === 0) {
      sendResponse(false, 404, res, { message: "Users not found!!" });
    }
    sendResponse(true, 200, res, {
      message: "Users retrived successfully!",
      data: result.rows,
    });
  } catch (err) {
    sendResponse(false, 500, res, {
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.getUserFromDB(id as string | number);

    if (result.rowCount === 0) {
      sendResponse(false, 404, res, { message: "Users not found!!" });
    }
    sendResponse(true, 200, res, {
      message: "Users retrived successfully!",
      data: result.rows,
    });
  } catch (err) {
    sendResponse(false, 500, res, {
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, age } = req.body;
    if (!id || typeof id !== "string" || typeof id !== "number") {
      return sendResponse(false, 400, res, { message: "Invalid user ID" });
    }
    const result = await userService.updateUserFromDB({
      id,
      payload: { name, email, password, age },
    });

    if (result.rowCount === 0) {
      return sendResponse(false, 404, res, { message: "User not found!" });
    }

    return sendResponse(true, 200, res, {
      message: "User updated successfully!",
      data: result.rows[0],
    });
  } catch (err) {
    return sendResponse(false, 500, res, {
      message: err instanceof Error ? err.message : "Something went wrong",
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUserFromDB(id as string | number);

    if (result.rowCount === 0) {
      sendResponse(false, 404, res, { message: "User not found for deleting!" });
    }
    sendResponse(true, 200, res, {
      message: "User deleted successfully!",
      data: result.rows,
    });
  } catch (err) {
    sendResponse(false, 500, res, {
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
