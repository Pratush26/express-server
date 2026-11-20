import type { Response } from "express";

type TReponse<T> = {
  message: string;
  data?: T;
  error?: any;
  token?: string;
};

const sendResponse = <T>(success: boolean, status_code: number, res: Response, data: TReponse<T>) => {
  res.status(status_code).json({
    success: success,
    message: data.message,
    data: data.data,
    error: data.error,
    token: data.token,
  });
};

export default sendResponse;
