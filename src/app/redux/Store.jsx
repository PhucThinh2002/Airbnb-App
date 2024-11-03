'use client';
import { configureStore } from "@reduxjs/toolkit";
import userReducer from './reducer/userReducer';
import adminReducer from './reducer/adminReducer/adminReducer';
import locationReducer from './reducer/locationReducer';
import roomReducer from './reducer/adminReducer/roomreducer';
import locationApiReducer from './reducer/adminReducer/locationApiReducer';
import BookingReducer from './reducer/adminReducer/BookingReducer';


export const Store = configureStore({
    reducer: {
        userReducer,
        adminReducer,
        locationReducer,
        roomReducer,
        locationApiReducer,
        BookingReducer
    },
});
