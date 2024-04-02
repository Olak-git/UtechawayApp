import { createSlice } from "@reduxjs/toolkit";

export const videosdkAuthtokenSlice = createSlice({
    name: 'videosdk',
    initialState: {
        token: '',
    },
    reducers: {
        setVideoSdkToken: (state, action) => {
            state.token = action.payload
        }
    }
})

export default videosdkAuthtokenSlice.reducer;
export const { setVideoSdkToken } = videosdkAuthtokenSlice.actions