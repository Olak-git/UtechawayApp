import { createSlice } from "@reduxjs/toolkit";

export const meetingSlice = createSlice({
    name: 'meeting',
    initialState: {
        id: null,
        shared_screen: false
    },
    reducers: {
        setLiveMeetingId: (state, action) => {
            state.id = action.payload
        },
        setLiveSharedScreen: (state, action) => {
            state.shared_screen = action.payload
        },
        clearMeeting: (state) => {
            state.id = null;
            state.shared_screen = false
        }
    }
})

export default meetingSlice.reducer;
export const { setLiveMeetingId, setLiveSharedScreen, clearMeeting } = meetingSlice.actions