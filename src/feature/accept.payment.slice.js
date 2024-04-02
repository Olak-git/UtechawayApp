const { createSlice } = require("@reduxjs/toolkit");

export const acceptPaymentSlice = createSlice({
    name: 'accept_payment',
    initialState: {
        value: false
    },
    reducers: {
        setAcceptPayment: (state, action) => {
            state.value = action.payload
        }
    }
})

export default acceptPaymentSlice.reducer
export const { setAcceptPayment } = acceptPaymentSlice.actions
