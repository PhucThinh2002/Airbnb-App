"use client"
import { Email, getCookie, http, setCookie, TOKEN, USER_ID, USER_LOGIN } from '@/app/setting/setting';
import { createSlice } from '@reduxjs/toolkit'
import { message } from 'antd';

let getUserLoginDefault = () => {
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem(USER_LOGIN);
    if (storedUser) {
      return JSON.parse(storedUser);
    }
  }
  return null; 
};
export const getUserIdFromLocalStorage = () => {
  if (typeof window !== 'undefined') { 
    const storedUser = localStorage.getItem(USER_LOGIN);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.id; // Trả về id của user
    }
  }
  return null; 
};

const initialState = {
    userLogin: getUserLoginDefault() || {},
    userRegister: {},
    userProfile: {}

}

const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    setUserLogicAction: (state, action) => {
        state.userLogin = action.payload;
      },
    setUserRegisterAction: (state, action) => {
        state.userRegister = action.payload
    },
    setProfileAction: (state, action) => {
      state.userProfile = action.payload;
    },
    setAvatarAction: (state,action) => {
      state.userProfile = action.payload
      
    }
  }
});

export const {setUserLogicAction,setUserRegisterAction,setProfileAction,setAvatarAction} = userReducer.actions

export default userReducer.reducer

export const loginActionAsync = (userLoginModel) => {
  return async (dispatch) => {
    try {
      const res = await http.post("/api/auth/signin", userLoginModel);

      const token = res.data.content.token; 
      const userEmail = res.data.content.user.email; 
      const userLogin = JSON.stringify(res.data.content.user); 

      // Lưu vào localStorage và cookie
      localStorage.setItem(Email, userEmail);
      localStorage.setItem(TOKEN, token);
      localStorage.setItem(USER_LOGIN, userLogin);
      setCookie(USER_LOGIN, userLogin, 7);


 
      const action = setUserLogicAction(res.data.content.user);
      dispatch(action);

    } catch (error) {
      if (error.response && error.response.data) {
        console.log('API Error Response:', error.response.data);
        throw error.response.data; 
      } else {
        console.log('Error:', error.message);
        throw new Error('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    }
  };
};


export const registerActionAsync = (userRegisterModel) => {
  return async (dispatch) => {
    try {
      const res = await http.post("/api/auth/signup", userRegisterModel);
      const action = setUserRegisterAction(res.data.content);
      dispatch(action);
      return res.data; 
    } catch (error) {
      if (error.response && error.response.data) {
        console.log('API Error Response:', error.response.data);
        throw error.response.data;  
      } else {
        console.log('Error:', error.message);
        throw new Error('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    }
  }
};


export const setProfileActionAsync = () => {
  return async (dispatch) => {
    try {
      const userId = getUserIdFromLocalStorage(); 
      if (!userId) {
        alert("Không tìm thấy ID người dùng.");
        return;
      }
      const res = await http.get(`/api/users/${userId}`);
      dispatch(setProfileAction(res.data.content)); 
    } catch (error) {
      console.error('Lỗi khi tải thông tin người dùng:', error);
    }
  };
};

export const uploadAvatarActionAsync = (file) => {
  return async (dispatch, getState) => {
    try {
      const res = await http.post("/api/users/upload-avatar", file);
      const newAvatarUrl = res.data.content.avatar;  
      const { userProfile, userLogin } = getState().userReducer;
      const updatedProfile = { ...userProfile, avatar: newAvatarUrl };
      const updatedUserLogin = { ...userLogin, avatar: newAvatarUrl };
      dispatch(setProfileAction(updatedProfile));
      dispatch(setUserLogicAction(updatedUserLogin));
      localStorage.setItem(USER_LOGIN, JSON.stringify(updatedUserLogin));
      setCookie(USER_LOGIN, JSON.stringify(updatedUserLogin));
      alert("Cập nhật avatar thành công");
    } catch (err) {
      alert("Cập nhật avatar thất bại");
      console.error("Error uploading avatar:", err);
    }
  };
};

export const updateProfileActionAsync = (updatedProfileData) => {
  return async (dispatch, getState) => {
    try {
      const userId = getUserIdFromLocalStorage();
      if (!userId) {
        message.error("Không tìm thấy ID người dùng.");
        return;
      }

      const res = await http.put(`/api/users/${userId}`, updatedProfileData);

      // Cập nhật state trong Redux
      dispatch(setProfileAction(res.data.content));

      // Cập nhật userLogin trong localStorage
      const updatedUserLogin = { ...getState().userReducer.userLogin, ...res.data.content };
      localStorage.setItem(USER_LOGIN, JSON.stringify(updatedUserLogin));
      setCookie(USER_LOGIN, JSON.stringify(updatedUserLogin));

      message.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      message.error("Cập nhật thất bại. Vui lòng thử lại!");
    }
  };
};




