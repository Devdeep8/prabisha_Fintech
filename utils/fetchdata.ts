// utils/fetchUserData.ts
'use server'
import axios from 'axios';

export const fetchUserData = async (username: string) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_PORT}/api/user?username=${username}`);
    if (!response.data) {
      throw new Error('User not found');
    }

    const userData = response.data
    // console.log(userData);
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

