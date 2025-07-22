import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export const verifyToken = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authorization header missing or malformed', status: 401 };
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return { error: 'Token not provided', status: 401 };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    return { userId: decoded.userId, email: decoded.email };
  } catch (error) {
    console.error('Token verification error:', error);
    return { error: 'Invalid or expired token', status: 403 };
  }
};