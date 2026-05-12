import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/axios';

export const fetchMyBookings = createAsyncThunk('bookings/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get('/bookings/my');
    return data.bookings;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch bookings');
  }
});

export const createBooking = createAsyncThunk('bookings/create', async (bookingData, { rejectWithValue }) => {
  try {
    const { data } = await API.post('/bookings', bookingData);
    return data.booking;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create booking');
  }
});

export const cancelBooking = createAsyncThunk('bookings/cancel', async ({ id, reason }, { rejectWithValue }) => {
  try {
    await API.put(`/bookings/${id}/cancel`, { reason });
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to cancel booking');
  }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchMyBookings.fulfilled, (state, action) => { state.list = action.payload; state.loading = false; })
      .addCase(fetchMyBookings.rejected, (state, action) => { state.error = action.payload; state.loading = false; })
      .addCase(createBooking.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const idx = state.list.findIndex(b => b._id === action.payload);
        if (idx !== -1) state.list[idx].status = 'cancelled';
      });
  },
});

export default bookingSlice.reducer;
