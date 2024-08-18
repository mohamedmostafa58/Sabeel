import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

const initialState = {
  authToken: sessionStorage.getItem("authToken"),
  user: {
    username: null,
    email: null,
    referralLink: null,
    wallet: 0,
    verified: "unverified",
  },
  users: [],
  isLoading: false,
  isSuccess: false,
  isLogoutSuccess: false,
  isError: false,
  message: "",
};

const errorMessageHandler = (error) => {
  const message = error.response.data.error || error.message;
  return message;
};
//get usr by token
export const fetchUserByToken = createAsyncThunk(
  "auth/fetchUserByToken",
  async (token, thunkAPI) => {
    try {
      return await authService.getUserByToken(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
// Fetch all users (admin only)
export const fetchUsers = createAsyncThunk(
  "auth/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const authToken = thunkAPI.getState().auth.authToken;
      return await authService.fetchUsers(authToken);
    } catch (error) {
      const message = errorMessageHandler(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);
// Verify a user (admin only)
export const verifyUser = createAsyncThunk(
  "auth/verifyUser",
  async (userId, thunkAPI) => {
    try {
      const authToken = thunkAPI.getState().auth.authToken;
      return await authService.verifyUser(userId, authToken);
    } catch (error) {
      const message = errorMessageHandler(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Register User
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      const message = errorMessageHandler(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login User
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await authService.login(userData);
    } catch (error) {
      const message = errorMessageHandler(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (userData, thunkAPI) => {
    try {
      return await authService.forgotPassword(userData);
    } catch (error) {
      const message = errorMessageHandler(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (userData, thunkAPI) => {
    try {
      return await authService.resetPassword(userData);
    } catch (error) {
      const message = errorMessageHandler(error);
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  sessionStorage.removeItem("authToken");
  return;
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.isLogoutSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.authToken = action.payload.token;
      state.user = {
        username: action.payload.user.username,
        email: action.payload.user.email,
        referralLink: action.payload.user.referralLink,
        wallet: action.payload.user.wallet,
        verified: action.payload.user.verified,
        role: action.payload.user.role,
      };
    });

    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      state.authToken = null;
    });

    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.authToken = action.payload.token;
      state.user = {
        username: action.payload.user.username,
        email: action.payload.user.email,
        referralLink: action.payload.user.referralLink,
        wallet: action.payload.user.wallet,
        verified: action.payload.user.verified,
        role: action.payload.user.role,
      };
    });

    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      state.authToken = null;
    });

    builder.addCase(forgotPassword.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.message = action.payload.message;
    });

    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    builder.addCase(resetPassword.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.message = action.payload.message;
    });

    builder.addCase(resetPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    builder.addCase(logoutUser.fulfilled, (state, action) => {
      state.authToken = null;
      state.user = {
        username: null,
        referralLink: null,
        wallet: 0,
        verified: false,
        role: null,
      };
      state.isLogoutSuccess = true;
    });
    builder.addCase(fetchUsers.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.users = action.payload; // Assuming you add users to the state
    });

    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    builder.addCase(verifyUser.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(verifyUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.message = action.payload.message;
      state.users = state.users.map((user) =>
        user._id === action.payload._id ? { ...user, verified: true } : user
      );
    });

    builder.addCase(verifyUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
    builder.addCase(fetchUserByToken.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUserByToken.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.authToken = action.payload.token;
      state.user = {
        username: action.payload.user.username,
        email: action.payload.user.email,
        referralLink: action.payload.user.referralLink,
        wallet: action.payload.user.wallet,
        verified: action.payload.user.verified,
        role: action.payload.user.role,
      };
    });
    builder.addCase(fetchUserByToken.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      state.authToken = null;
    });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
