import axios from "axios";

const API_URL = "/api/auth";
//get userbu token
const getUserByToken = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/user`, config);
  sessionStorage.setItem("authToken", response.data.token);
  return response.data;
};

// Register User
const register = async (userData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post(`${API_URL}/register`, userData, config);
  sessionStorage.setItem("authToken", response.data.token);

  return response.data;
};

// Login User
const login = async (userData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post(`${API_URL}/login`, userData, config);
  sessionStorage.setItem("authToken", response.data.token);
  return response.data;
};

// Forgot Password
const forgotPassword = async (userData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post(
    `${API_URL}/forgotPassword`,
    userData,
    config
  );
  return response.data;
};

// Reset Password
const resetPassword = async (userData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.put(
    `${API_URL}/resetPassword/${userData.resetToken}`,
    { password: userData.password },
    config
  );
  return response.data;
};
//fetch users
const fetchUsers = async (authToken) => {
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
  const response = await axios.get(`${API_URL}/users`, config);
  return response.data;
};
// Verify a user
const verifyUser = async (userId, authToken) => {
  const config = {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
  const response = await axios.put(
    `${API_URL}/users/${userId}/verify`,
    {},
    config
  );
  return response.data;
};
const authService = {
  register,
  login,
  forgotPassword,
  resetPassword,
  fetchUsers,
  verifyUser,
  getUserByToken,
};

export default authService;
