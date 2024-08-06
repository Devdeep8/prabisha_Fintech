"use server";
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function checkUserRole(): Promise<'admin' | 'user'> {
  // Retrieve the token from cookies
  const token = cookies().get('token')?.value;

  if (!token) {
    console.error('Token not found in cookies');
    throw new Error('Token not found in cookies');
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    // console.log(payload)

    if (!payload || typeof payload.role !== 'string') {
      throw new Error('Invalid token payload');
    }

    const userRole = payload.role as 'admin' | 'user';
    // console.log(userRole);
    return userRole;
  } catch (error) {
    console.error('Error checking user role:', error);
    throw error;
  }
}
 