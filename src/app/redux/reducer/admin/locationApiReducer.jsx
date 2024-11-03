import { http } from '@/app/setting/setting';
import { createSlice } from '@reduxjs/toolkit';
import { notification } from 'antd';

const initialState = {
  locations: [],
  locationDetails: {},
  paginatedLocations: [],
  uploadedLocationImage: null,
  loading: false,
};

const locationApiReducer = createSlice({
  name: 'locationApiReducer',
  initialState,
  reducers: {
    setLocations: (state, action) => {
      state.locations = action.payload;
    },
    setLocationDetails: (state, action) => {
      state.locationDetails = action.payload;
    },
    addLocation: (state, action) => {
      state.locations = [...state.locations, action.payload];
    },
    updateLocation: (state, action) => {
      const index = state.locations.findIndex(loc => loc.id === action.payload.id);
      if (index !== -1) {
        state.locations[index] = action.payload;
      }
    },
    deleteLocation: (state, action) => {
      state.locations = state.locations.filter(loc => loc.id !== action.payload);
    },
    setPaginatedLocations: (state, action) => {
      state.paginatedLocations = action.payload;
    },
    setUploadedLocationImage: (state, action) => {
      state.uploadedLocationImage = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLocations, setLocationDetails, addLocation, updateLocation, deleteLocation, setPaginatedLocations, setUploadedLocationImage, setLoading } = locationApiReducer.actions;

export default locationApiReducer.reducer;

export const fetchLocationsAsync = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await http.get("/api/vi-tri");
    dispatch(setLocations(res.data.content));
  } catch (error) {
    console.error('Error fetching locations:', error);
    notification.error({ message: 'Lỗi', description: 'Không thể tải vị trí.' });
  } finally {
    dispatch(setLoading(false));
  }
};

export const createLocationWithImageAsync = (locationData, imageFile, id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    // Xử lý tạo/cập nhật location
    const method = id ? 'put' : 'post';
    const url = id ? `/api/vi-tri/${id}` : '/api/vi-tri';

    const locationResponse = await http({
      method,
      url,
      data: locationData,
    });

    let newLocation = locationResponse.data.content;

    // Xử lý upload hình ảnh nếu có
    if (imageFile) {
      const formData = new FormData();
      formData.append('formFile', imageFile);

      try {
        const imageResponse = await http.post(
          `/api/vi-tri/upload-hinh-vitri?maViTri=${newLocation.id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" }
          }
        );
        newLocation = imageResponse.data.content;
      } catch (imageError) {
        console.error('Error uploading image:', imageError);
        notification.warning({
          message: 'Cảnh báo',
          description: 'Đã lưu thông tin nhưng tải ảnh thất bại'
        });
      }
    }

    // Cập nhật state
    if (id) {
      dispatch(updateLocation(newLocation));
    } else {
      dispatch(addLocation(newLocation));
    }

    notification.success({
      message: 'Thành công',
      description: id ? 'Cập nhật vị trí thành công!' : 'Thêm vị trí mới thành công!'
    });

    return newLocation;

  } catch (error) {
    console.error('Error in createLocationWithImageAsync:', error);
    notification.error({
      message: 'Lỗi',
      description: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại'
    });
    throw error;
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchLocationByIdAsync = (locationId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await http.get(`/api/vi-tri/${locationId}`);
    dispatch(setLocationDetails(res.data.content));
  } catch (error) {
    console.error('Error fetching location details:', error);
    notification.error({ message: 'Lỗi', description: 'Không thể tải chi tiết vị trí.' });
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteLocationAsync = (locationId) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await http.delete(`/api/vi-tri/${locationId}`);
    dispatch(deleteLocation(locationId));
    notification.success({ message: 'Thành công', description: 'Vị trí đã được xóa thành công!' });
  } catch (error) {
    console.error('Error deleting location:', error);
    notification.error({ message: 'Lỗi', description: 'Không thể xóa vị trí.' });
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchPaginatedLocationsAsync = (page = 1, pageSize = 10, keyword = '') => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await http.get(`/api/vi-tri/phan-trang-tim-kiem?page=${page}&pageSize=${pageSize}&keyword=${keyword}`);
    dispatch(setPaginatedLocations(res.data.content));
  } catch (error) {
    console.error('Error fetching paginated locations:', error);
    notification.error({ message: 'Lỗi', description: 'Không thể tải vị trí với phân trang.' });
  } finally {
    dispatch(setLoading(false));
  }
};