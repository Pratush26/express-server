import type { Request, Response } from "express";
import { authService } from "./auth.service";
import config from "../../config";

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Creadentials are missing!!",
      });
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
    res.status(200).json({
      success: true,
      message: "User login successfully!",
      data: result.user,
      token: result.accessToken,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
};
const generateToken = async (req: Request, res: Response) => {
  try {
    const result = await authService.generateAccessToken(req.cookies.refreshToken);

    res.status(200).json({
      success: true,
      message: "Access token generated successfully!",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
      error: err,
    });
  }
};

export const authController = {
  loginUser,
  generateToken
};
