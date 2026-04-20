import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchPackages = createAsyncThunk('packages/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/packages', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch packages');
  }
});

export const fetchPackageById = createAsyncThunk('packages/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await API.get(`/packages/${id}`);
    return data.package;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch package');
  }
});

const packageSlice = createSlice({
  name: 'packages',
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    total: 0,
  },
  reducers: {
    clearCurrentPackage: (state) => { state.current = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackages.pending, (state) => { state.loading = true; })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.list = action.payload.packages;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchPackages.rejected, (state, action) => { state.error = action.payload; state.loading = false; })
      .addCase(fetchPackageById.pending, (state) => { state.loading = true; })
      .addCase(fetchPackageById.fulfilled, (state, action) => { state.current = action.payload; state.loading = false; })
      .addCase(fetchPackageById.rejected, (state, action) => { state.error = action.payload; state.loading = false; });
  },
});

export const { clearCurrentPackage } = packageSlice.actions;
export default packageSlice.reducer;
