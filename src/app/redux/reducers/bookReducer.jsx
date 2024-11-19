import { http } from '@/app/setting/setting';
import { createSlice } from '@reduxjs/toolkit'
import { message } from 'antd';

const initialState = {
    apiUserBook: [{}],
    apiFindBook: {}
}

const bookReducer = createSlice({
  name: "bookReducer",
  initialState,
  reducers: {
    setDatPhongAction: (state,action) => {
        state.apiUserBook = action.payload
    },
    setRoomForUserAction: (state,action) => {
        state.apiUserBook = action.payload
    },
    setFindBookAction: (state,action) => {
        state.apiFindBook = action.payload
    }
  }
});

export const {setDatPhongAction, setRoomForUserAction, setFindBookAction} = bookReducer.actions

export default bookReducer.reducer

export const datPhongActionAsync = (id = 0, maPhong, ngayDen, ngayDi, soLuongKhach, maNguoiDung) => {
    return async (dispatch) => {
        try {
            const payload = {
                id,
                maPhong,
                ngayDen,
                ngayDi,
                soLuongKhach,
                maNguoiDung
            };
            const res = await http.post("/api/dat-phong", payload);
            const action = setDatPhongAction(res.data.content);
            dispatch(action);
        } catch (err) {
            message.error("Bạn cần đăng nhập để có thể đặt phòng");
        }
    };
};

export const getApiRoomForUserActionAsync = (id) => {
    return async(dispatch) => {
        const res = await http.get(`/api/dat-phong/lay-theo-nguoi-dung/${id}`)
        const action = setDatPhongAction(res.data.content)
        dispatch(action)
    }
}
// Lấy thông tin search về location, thời gian và số lượng khách của người dùng 
export const getFindBookActionAsync = (id, date, count) => {
    return async(dispatch) => {
      try {
        const action = setFindBookAction(id, date, count);
        dispatch(action);
        console.log("FindBookAction dispatched: ", { id, date, count });
      } catch (error) {
        console.error("Error fetching booking data: ", error);
      }
    }
  }
  