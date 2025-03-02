import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productId: '',
  categoryId: '',
  customerId: '',
  orderId: '',
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setProductId(state, action) {
      state.productId = action.payload;
    },
    setCategoryId(state, action) {
      state.categoryId = action.payload;
    },
    setCustomerId(state, action) {
      state.customerId = action.payload;
    },
    setOrderId(state, action) {
      state.orderId = action.payload;
    },
  },
});

export const { setCategoryId, setProductId, setCustomerId, setOrderId } = globalSlice.actions;
const globalReducer = globalSlice.reducer;

export default globalReducer;
