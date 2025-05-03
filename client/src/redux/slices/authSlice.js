import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { handleGeoBlockError } from "../../utils/handleGeoBlockError";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const initialState = {
  userInfo: userInfoFromStorage,
  loading: false,
  error: null,
  success: false,
};

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${API_URL}/users/register`,
        { username, email, password },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));

      return data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        const geoBlockError = handleGeoBlockError(error);
        if (geoBlockError) return geoBlockError;

        return rejectWithValue(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
      }
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        `${API_URL}/users/login`,
        { email, password },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));

      return data;
    } catch (error) {
      const geoBlockError = handleGeoBlockError(error);
      if (geoBlockError) return geoBlockError;

      return rejectWithValue(
        error.response && error.response.data
          ? error.response.data
          : error.message
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/users/profile`,
        userData,
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));

      return data;
    } catch (error) {
      const geoBlockError = handleGeoBlockError(error);
      if (geoBlockError) return geoBlockError;

      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("userInfo");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.success = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.success = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        state.success = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
      });
  },
});

export const { resetAuthState } = authSlice.actions;

export default authSlice.reducer;
