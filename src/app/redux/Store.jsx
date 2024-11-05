'use client';
import { configureStore } from "@reduxjs/toolkit";
import userReducer from './reducers/userReducer';
import adminReducer from './reducers/admin/adminReducer';
import locationReducer from './reducers/locationReducer';
import roomReducer from './reducers/admin/roomReducer';
import locationApiReducer from './reducers/admin/locationApiReducer';
import BookingReducer from './reducers/admin/BookingReducer';
import bookReducer from './reducers/bookreducer'
export const Store = configureStore({
    reducer: {
        userReducer,
        adminReducer,
        locationReducer,
        locationApiReducer,
        BookingReducer,
        roomReducer,
        bookReducer
    },
});
