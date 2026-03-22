import axios from "axios"

const BASE_URL = "http://192.168.0.50:5000"

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