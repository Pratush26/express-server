import type { Request, Response } from "express";
import { authService } from "./auth.service";
import config from "../../config";
import sendResponse from "../../utils/sendResponse";

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      sendResponse(false, 400, res, { message: "Creadentials are missing!!" });
    }
    const result = await authService.loginUserByDB({ email, password});

    const {refreshToken} = result
    res.cookie("refreshToken", refreshToken, {
      secure: config.node_env.toLowerCase() == "production",
      httpOnly: true,  // prevent XSS attack
      sameSite: "none",  // prevent CSRF attack
      // maxAge:
      path: "/",
      // domain: 
    })
    sendResponse(true, 200, res, {
      message: "User login successfully!",
      data: result.user,
      token: result.accessToken,
    });
  } catch (err) {
    sendResponse(false, 500, res, {
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
};
const generateToken = async (req: Request, res: Response) => {
  try {
    const result = await authService.generateAccessToken(req.cookies.refreshToken);

    sendResponse(true, 200, res, {
      message: "Access token generated successfully!",
      data: result,
    });
  } catch (err) {
    sendResponse(false, 500, res, {
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
};

export const authController = {
  loginUser,
  generateToken
};
