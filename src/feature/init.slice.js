import { createSlice } from "@reduxjs/toolkit";

export const initSlice = createSlice({
    name: 'init',
    initialState: {
        presentation: false,
        welcome: false,
        stopped: false,
    },
    reducers: {
        setPresentation: (state, action) => {
            state.presentation = action.payload
        },
        setWelcome: (state, action) => {
            state.welcome = action.payload
        },
        setStopped: (state, action) => {
            state.stopped = action.payload
        },
        resetInit: (state) => {
            state.presentation = false;
            state.welcome = false;
            state.stopped = false;
        }
    }
})

export default initSlice.reducer;
export const { setPresentation, setWelcome, setStopped, resetInit } = initSlice.actions