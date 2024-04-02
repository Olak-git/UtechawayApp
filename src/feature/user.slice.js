import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        data: {}
    },
    reducers: {
        setUser: (state, action) => {
            // Object.assign(state.data, action.payload);
            for(let index in action.payload) {
                state.data[index] = action.payload[index];
            }
        },
        setUserIndex: (state, action) => {
            Object.assign(state.data, action.payload);
        },
        deleteIndex: (state, action) => {
            delete(state.data[action.payload]);
        },
        deleteUser: (state) => {
            state.data = {};
        }
    }
})

export default userSlice.reducer;
export const { setUser, setUserIndex, deleteIndex, deleteUser } = userSlice.actions