import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchDashboard = createAsyncThunk('admin/dashboard', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/admin/dashboard');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const fetchAllUsers = createAsyncThunk('admin/users', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/admin/users');
    return data.users;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const fetchAllBookings = createAsyncThunk('admin/bookings', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/admin/bookings');
    return data.bookings;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const fetchAllPayments = createAsyncThunk('admin/payments', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/admin/payments');
    return data.payments;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const fetchAllReviews = createAsyncThunk('admin/reviews', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/admin/reviews');
    return data.reviews;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

export const fetchReports = createAsyncThunk('admin/reports', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/admin/reports');
    return data.reports;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed');
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    recentBookings: [],
    users: [],
    bookings: [],
    payments: [],
    reviews: [],
    reports: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => { state.loading = true; })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.stats = action.payload.stats;
        state.recentBookings = action.payload.recentBookings;
        state.loading = false;
      })
      .addCase(fetchDashboard.rejected, (state) => { state.loading = false; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => { state.users = action.payload; })
      .addCase(fetchAllBookings.fulfilled, (state, action) => { state.bookings = action.payload; })
      .addCase(fetchAllPayments.fulfilled, (state, action) => { state.payments = action.payload; })
      .addCase(fetchAllReviews.fulfilled, (state, action) => { state.reviews = action.payload; })
      .addCase(fetchReports.fulfilled, (state, action) => { state.reports = action.payload; });
  },
});

export default adminSlice.reducer;
