/* eslint-disable no-unused-vars */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authApi from '../../api/authApi';
import { StorageKeys } from '../../constants/StorageKeys';

const initialState = {
    setting: '',
    loading: true,
    userInfor: {
    },
    error: null
};
export const userLogin = createAsyncThunk('user/login', async (payload) => {
    try {
        const data =  await authApi.login(payload);
        localStorage.setItem(StorageKeys.USER,JSON.stringify(data.user));
        localStorage.setItem(StorageKeys.ACCESS_TOOKEN,data.access_token);
        return data.user;
    }
    catch(error) {
        throw error.response.data.message;
    }
});

export const getLogin = createAsyncThunk('user/get-login', async () => {
    try {
        const data =  await authApi.getLogin();
        return data.user;
    }
    catch(error) {
        console.log(error.response.data.message);
    }
});

export const userLogout = createAsyncThunk('user/logout', async () => {
    try {
        await authApi.logout();
        localStorage.removeItem(StorageKeys.ACCESS_TOOKEN);
        localStorage.removeItem(StorageKeys.USER);
        return {};
    }
    catch(error) {
        throw error.response.data.message;
    }
});

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers:  {
        [userLogin.fulfilled]: (state,action) => {
            state.userInfor = action.payload;
        },
        [getLogin.fulfilled]: (state,action) => {
            state.userInfor = action.payload;
        },
        [userLogout.fulfilled]: (state,action) => {
            state.userInfor = {};
        },
        [userLogout.rejected]: (state,action) => {
            state.userInfor = {};
        }

    }
});

// export const {  } = userSlice.actions;

export default userSlice.reducer;
