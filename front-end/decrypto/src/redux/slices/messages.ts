import { createSlice } from "@reduxjs/toolkit";
import Message from "../../interfaces/Message";

export interface MessagesState {
  messages: Message[];
  loading: boolean;
  error?: string;
}

const initialState: MessagesState = {
  messages: [],
  loading: false,
  error: undefined,
};

const messagesSlice = createSlice({
  name:"posts",
  initialState,
  reducers:{},

})

export const messagesReducer = messagesSlice.reducer