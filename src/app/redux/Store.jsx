'use client';
import { configureStore } from "@reduxjs/toolkit";
import userReducer from './reducer/userReducer';
import adminReducer from './reducer/admin/adminReducer';
import locationReducer from './reducer/locationReducer';
import roomReducer from './reducer/admin/roomReducer';
import locationApiReducer from './reducer/admin/locationApiReducer';
import BookingReducer from './reducer/admin/BookingReducer';
import bookreducer from './reducer/bookreducer'
export const Store = configureStore({
    reducer: {
        userReducer,
        adminReducer,
        locationReducer,
        locationApiReducer,
        BookingReducer,
        roomReducer,
        bookreducer
    },
});
