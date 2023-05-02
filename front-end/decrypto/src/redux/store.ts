import { configureStore } from "@reduxjs/toolkit";
import { messagesReducer } from "./slices/messages";



const store = configureStore({
    reducer: {
      messages: messagesReducer,
    },
  });

export default store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>