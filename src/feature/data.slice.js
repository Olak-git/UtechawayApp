import { createSlice } from "@reduxjs/toolkit";

export const dataSlice = createSlice({
    name: 'data',
    initialState: {
        cdc: {}
    },
    reducers: {
        setCdc: (state, action) => {
            Object.assign(state.cdc, action.payload);
        },
        resetCdc: (state) => {
            state.cdc = {};
        }
    }
})

export default dataSlice.reducer;
export const { setCdc, resetCdc } = dataSlice.actions