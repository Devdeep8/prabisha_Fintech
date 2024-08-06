// lib/cookie.ts
import { jwtVerify } from 'jose';
import Cookies from 'js-cookie';

// Function to verify token and return formatted cookies
export const verifyTokenAndReturnCookies = async () => {
  const token = Cookies.get('token');
  const secret = 'SSBMb3ZlIFNvbXlh'; // Replace with your actual secret

  if (!token) {
    console.error('Token not found in cookies');
    return null; // Return null or handle as needed
  }

  if (!secret) {
    console.error('JWT_SECRET is not defined');
    return null; // Return null or handle as needed
  }

  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);

    // Ensure payload is returned as an object
    if (typeof payload === 'object') {
      return payload;
    } else {
      console.error('Invalid token payload format');
      return null;
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    return null; // Return null or handle error as needed
  }
};
