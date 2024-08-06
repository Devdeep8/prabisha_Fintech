import axios from "axios";

export const verificationByPan = async (userId : any) => {
    try {
      // Assuming verifyTokenAndReturnCookies is correctly implemented and returns user info      
      // Extract userId from user object (assuming user object contains userId)
      // Make API request to fetch pancard data using userId
      const response = await axios.get(`${process.env.NEXT_PUBLIC_PORT}/api/kyc/pancard/${userId}`);
      // Return or process response.data as needed
      return response.data;
    } catch (error) {
      console.error('Error fetching pancard data:', error);
      // Handle errors gracefully
      throw error;
    }
  };
  