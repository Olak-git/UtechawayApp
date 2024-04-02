import { createSlice } from "@reduxjs/toolkit";

export const messagesSlice = createSlice({
    name: 'messages',
    initialState: {
        data: []
    },
    reducers: {
        setMessages: (state, action) => {
            state.data = action.payload
        },
        addMessages: (state, action) => {
            state.data = action.payload.concat(state.data)
            // state.data = state.data.concat(action.payload)
        },
        addMessage: (state, action) => {
            state.data.unshift(action.payload)
            // state.data.push(action.payload)
        },
        clearMessages: (state) => {
            state.data = new Array();
        }
    }
})

export default messagesSlice.reducer;
export const { setMessages, addMessages, addMessage, clearMessages } = messagesSlice.actions