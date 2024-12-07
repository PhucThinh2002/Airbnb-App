import { http } from '@/app/setting/setting';
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  apiRoom: [{}],
  roomUpdate: {}
}

const roomReducer = createSlice({
  name: "roomReducer",
  initialState,
  reducers: {
    getApiRoomAction: (state, action) => {
      state.apiRoom = action.payload
    },
    setRoomUpdateAction: (state, action) => {
      state.roomUpdate = action.payload
    },
    setRoomDeleteAction: (state, action) => {
      state.apiRoom = action.payload
    },
    setRoomAddAction: (state, action) => {
      state.apiRoom.push(action.payload)
    }
  }
});

export const { getApiRoomAction, setRoomUpdateAction,setRoomDeleteAction,setRoomAddAction } = roomReducer.actions

export default roomReducer.reducer

export const getApiRoomActionAsync = () => {
  return async (dispatch) => {
    const res = await http.get("/api/phong-thue")
    const actionthunk = getApiRoomAction(res.data.content)
    dispatch(actionthunk)
  }
}

export const updateRoomActionAsync = (roomID, roomForm) => {
  return async (dispatch) => {
    
    const resRoom = await http.get(`/api/phong-thue/${roomID}`)
    const dataRoom = resRoom.data.content
    const updateRoom = {
      ...dataRoom,
      ...roomForm
    }
    const res = await http.put(`/api/phong-thue/${roomID}`, updateRoom);
    const action = setRoomUpdateAction(res.data.content);
    dispatch(action);

  }
}


export const deleteRoomActionAsync = (roomID) => async (dispatch, getState) => {
  try {
    const res = await http.delete(`/api/phong-thue/${roomID}`);

    if (res.status === 200) {
      const apiRoom = getState().roomReducer.apiRoom;
      const updatedRooms = apiRoom.filter((room) => room.id !== roomID);
      dispatch(setRoomDeleteAction(updatedRooms));
      message.success("Xóa phòng thành công!");
    } else {
      message.error("Xóa phòng thất bại, thử lại sau!");
    }
  } catch (error) {
    console.error("Lỗi khi xóa phòng:", error);
  }
};


export const addRoomActionAsync = (roomForm) => {
  return async(dispatch)=> {
    try{
      const res = await http.post("/api/phong-thue", roomForm)
      const action = setRoomAddAction(res.data.content)
      dispatch(action)
      alert('Thêm thành công')
    }catch(err){
      alert('thêm thất bại')
    }
  }
}