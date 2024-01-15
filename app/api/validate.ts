import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

interface ValidateResponse {
  valid: boolean;
  userId?: number;
  message?: string;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ValidateResponse>
) {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ valid: false, message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.MY_SECRET_KEY as string) as jwt.JwtPayload;
    res.status(200).json({ valid: true, userId: decoded.id });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
}
