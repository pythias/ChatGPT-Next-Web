import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

interface LoginResponse {
  token?: string;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  const { username, password } = req.body;

  // Dummy user for example purposes
  const user = {
    id: 1,
    username: 'user',
    password: '\$2a\$12$...hashedPassword...' // This should be a hashed password
  };

  // Check if user exists and password is correct
  if (username === user.username && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id }, process.env.MY_SECRET_KEY as string, {
      expiresIn: '1h',
    });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
}
