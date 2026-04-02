import axios from "axios"

export const BASE_URL = "https://mes-ioa3.onrender.com"

export const registerService = async (user) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, user);
    return response.data;
  } catch (error) {
    console.log("Register Error:", error);
    throw error;
  }
}

export const loginService = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, credentials)
    return response.data
  } catch (error) {
    console.log("Login Error:", error)
    throw error
  }
}

export const verifyOtpService = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/verify-otp`, data)
    return response.data
  } catch (error) {
    console.log("Verify OTP Error:", error)
    throw error
  }
}

/**
 * DEPRECATED: Profile is now handled 100% via localStorage 
 * to eliminate 404 errors from non-existent backend routes.
 */
export const getMeService = async () => {
  return null; // Return nothing to avoid network request
}

/**
 * DEPRECATED: User list is now handled 100% via Sockets for discovery
 * to eliminate 404 errors from non-existent backend routes.
 */
export const getAllUsersService = async () => {
  return null; // Return nothing to avoid network request
}