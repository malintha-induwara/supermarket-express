import { configureStore } from '@reduxjs/toolkit'
import customerReducer from '../reducers/customer-reducer'
import itemReducer from '../reducers/item-reducer'
import orderReducer from '../reducers/order-reducer'

export const store = configureStore({
  reducer: {
    customer: customerReducer,
    item: itemReducer,
    order:orderReducer
  },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch