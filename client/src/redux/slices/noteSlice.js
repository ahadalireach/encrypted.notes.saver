import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { handleGeoBlockError } from "../../utils/handleGeoBlockError";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const initialState = {
  notes: [],
  note: null,
  loading: false,
  error: null,
  success: false,
};

export const getNotes = createAsyncThunk(
  "notes/getNotes",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/notes`, config);

      return data.notes;
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

export const getNoteById = createAsyncThunk(
  "notes/getNoteById",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/notes/${id}`, config);

      return data.note;
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

export const createNote = createAsyncThunk(
  "notes/createNote",
  async (noteData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.post(`${API_URL}/notes`, noteData, config);

      return data.note;
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

export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async ({ id, noteData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/notes/${id}`,
        noteData,
        config
      );

      return data.note;
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

export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${auth.userInfo.token}`,
        },
      };

      await axios.delete(`${API_URL}/notes/${id}`, config);

      return id;
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

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    resetNoteState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearNote: (state) => {
      state.note = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getNoteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNoteById.fulfilled, (state, action) => {
        state.loading = false;
        state.note = action.payload;
      })
      .addCase(getNoteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createNote.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.notes = [...state.notes, action.payload];
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.note = action.payload;
        state.notes = state.notes.map((note) =>
          note._id === action.payload._id ? action.payload : note
        );
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.notes = state.notes.filter((note) => note._id !== action.payload);
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetNoteState, clearNote } = noteSlice.actions;
export default noteSlice.reducer;
