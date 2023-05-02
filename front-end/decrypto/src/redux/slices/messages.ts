import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import Message, { CreateMessage, PatchMessage } from "../../interfaces/Message";
import axios from "../../axios";
import jwt_decode from 'jwt-decode';
import User from "../../interfaces/User";

const getUserId = (token:string|null)=>{
  if(!token){
    return false
  }
  const data:User = jwt_decode(token)
  return data.id
}

export const fetchUserMessages = createAsyncThunk('messages/fetchMessages',
async ():Promise<Message[]> =>{
  const {data} = await axios.get(`/users/${getUserId(localStorage.getItem('authToken'))}/messages`)
  return data
}
)

export const selectMessageById = createAsyncThunk('messages/fetchMessage',
async (id:string):Promise<Message> =>{
  const {data} = await axios.get(`/users/${getUserId(localStorage.getItem('authToken'))}/messages/${id}`)
  return data
}
)

export const saveMessageById = createAsyncThunk('messages/fetchMessage',
async (id:string,message):Promise<Message> =>{
  const {data} = await axios.get(`/users/${getUserId(localStorage.getItem('authToken'))}/messages/${id}`,message)
  return data
}
)

export const patchMessageById = createAsyncThunk('messages/patchMessage',
async (id:string,message):Promise<Message> =>{
  const {data} = await axios.patch(`/users/${getUserId(localStorage.getItem('authToken'))}/messages/${id}`,message)
  return data
}
)

export const addMessage = createAsyncThunk(
  'messages/addMessage',
  async (newMessage: CreateMessage = {
    message: "text",
    name: "New message",
    decodingKey:"12345"
  }):Promise<Message> => {
    const response = await axios.post(`/users/${getUserId(localStorage.getItem('authToken'))}/messages`, newMessage);
    return response.data;
  }
);

export const deleteMessage = createAsyncThunk(
  'messages/deleteMessage',
  async (id: string):Promise<Message> => {
    const response = await axios.delete(`/users/${getUserId(localStorage.getItem('authToken'))}/messages/${id}`);
    return response.data;
  }
);

export interface MessagesState {
    items: Message[],
    loading:boolean
}

const initialState: MessagesState = {
    items : [],
    loading: false,
}

const messagesSlice = createSlice({
  name:"messages",
  initialState,
  reducers:{
    addMessage(state, action: PayloadAction<Message>){
      state.items.push(action.payload);
    }
  },
  extraReducers:(builder) => {
    builder.addCase(fetchUserMessages.pending, (state) =>{
      state.loading = true
    })
    .addCase(fetchUserMessages.fulfilled, (state, action: PayloadAction<Message[]>) => {
      state.loading = false;
      state.items = action.payload;
    })
    .addCase(addMessage.fulfilled, (state, action: PayloadAction<Message>) => {
      state.items.push(action.payload);
    })
    
  }
})

export const messagesReducer = messagesSlice.reducer