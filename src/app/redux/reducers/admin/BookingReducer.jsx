import { createSlice } from '@reduxjs/toolkit';
import { http } from '@/app/setting/setting';
import { notification, Modal } from 'antd';

const initialState = {
  bookings: [],
  bookingDetails: {},
  userBookings: [],
  loading: false,
};

const BookingReducer = createSlice({
  name: 'BookingReducer',
  initialState,
  reducers: {
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
    setBookingDetails: (state, action) => {
      state.bookingDetails = action.payload;
    },
    addBooking: (state, action) => {
      state.bookings = [...state.bookings, action.payload];
    },
    updateBooking: (state, action) => {
      const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    },
    deleteBooking: (state, action) => {
      state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
    },
    setUserBookings: (state, action) => {
      state.userBookings = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setBookings,
  setBookingDetails,
  addBooking,
  updateBooking,
  deleteBooking,
  setUserBookings,
  setLoading,
} = BookingReducer.actions;

export default BookingReducer.reducer;

const SUCCESS_KEY = 'success';

export const fetchBookingsAsync = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await http.get("/api/dat-phong");
    dispatch(setBookings(res.data.content));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    notification.error({ message: 'Lỗi', description: 'Không thể tải danh sách đặt phòng.' });
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchBookingByIdAsync = (bookingId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await http.get(`/api/dat-phong/${bookingId}`);
    dispatch(setBookingDetails(res.data.content));
  } catch (error) {
    console.error('Error fetching booking details:', error);
    notification.error({ message: 'Lỗi', description: 'Không thể tải chi tiết đặt phòng.' });
  } finally {
    dispatch(setLoading(false));
  }
};

export const createBookingAsync = (bookingData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await http.post("/api/dat-phong", bookingData);
    dispatch(addBooking(res.data.content));
    notification.success({
      message: 'Thành công',
      description: 'Đặt phòng thành công!',
      key: SUCCESS_KEY
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    notification.error({ message: 'Lỗi', description: 'Không thể tạo đặt phòng.' });
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateBookingAsync = (bookingId, bookingData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await http.put(`/api/dat-phong/${bookingId}`, bookingData);
    dispatch(updateBooking(res.data.content));
    notification.success({
      message: 'Thành công',
      description: 'Cập nhật đặt phòng thành công!',
      key: SUCCESS_KEY
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    notification.error({ message: 'Lỗi', description: 'Không thể cập nhật đặt phòng.' });
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteBookingAsync = (bookingId) => async (dispatch) => {
  Modal.confirm({
    title: 'xác nhận',
    content: 'Bạn chắc chắn muốn xóa đặt phòng này',
    okText: 'Ok',
    cancelText: 'Hủy',
    onOk: async () => {
      dispatch(setLoading(true));
      try {
        await http.delete(`/api/dat-phong/${bookingId}`);
        dispatch(deleteBooking(bookingId));
        notification.success({
          message: 'Thành công',
          description: 'Đã xóa đặt phòng thành công!',
          key: SUCCESS_KEY
        });
      } catch (error) {
        console.error('Error deleting booking:', error);
        notification.error({ message: 'Lỗi', description: 'Không thể xóa đặt phòng.' });
      } finally {
        dispatch(setLoading(false));
      }
    }
  })
};

export const fetchUserBookingsAsync = (userId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await http.get(`/api/dat-phong/lay-theo-nguoi-dung/${userId}`);
    dispatch(setUserBookings(res.data.content));
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    notification.error({ message: 'Lỗi', description: 'Không thể tải danh sách đặt phòng của người dùng.' });
  } finally {
    dispatch(setLoading(false));
  }
};
