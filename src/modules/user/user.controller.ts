import type { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, age } = req.body;
    if (!name || !email || !password || !age) {
      res.status(400).json({
        success: false,
        message: "Some data are missing!!",
      });
    }
    const result = await userService.createUserIntoDB({
      name,
      email,
      password,
      age,
    });

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Users not found!!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Users retrived successfully!",
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

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsersFromDB();

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Users not found!!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Users retrived successfully!",
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

const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await userService.getUserFromDB(id as string | number);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Users not found!!",
      });
    }
    res.status(200).json({
      success: true,
      message: "Users retrived successfully!",
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

const updateUser = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    res.status(500).json({
      success: false,
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
