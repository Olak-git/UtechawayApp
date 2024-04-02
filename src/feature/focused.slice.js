import { createSlice } from "@reduxjs/toolkit";

export const focusedSlice = createSlice({
    name: 'focused',
    initialState: {
        value: false
    },
    reducers: {
        setFocused: (state, action) => {
            console.log(action)
            state.value = action.payload
        }
    }
})

export default focusedSlice.reducer;
export const { setFocused } = focusedSlice.actions