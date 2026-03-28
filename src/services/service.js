import axios from "axios"

const BASE_URL = "https://mes-ioa3.onrender.com"

export const registerService = async (user) => {
  console.log(user);
  
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, user,{
      headers:{
        "Content-Type":"multipart/form-data"
      }
    })
    return response.data
  } catch (error) {
    console.log("Register Error:", error)
    throw error
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

export const getMeService = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.log("Get Me Error:", error)
    throw error
  }
}

export const getAllUsersService = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/auth/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    console.log("Get All Users Error:", error)
    throw error
  }
}