import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axios";
import jwt_decode from 'jwt-decode';
import User from "../interfaces/User";
import MessageComponent from "../components/Message";
import { addMessage, fetchUserMessages } from "../redux/slices/messages";
import store, { AppDispatch, RootState } from "../redux/store";
import { MessagesState } from "../redux/slices/messages";
import { Box, Button, CircularProgress, Container } from '@mui/material';

const MessageList = () => {
  const dispatch:AppDispatch = useDispatch();
  useEffect(()=>{dispatch(fetchUserMessages())},[dispatch])
  const messages = useSelector((state:RootState) => state.messages)
  const isLoading = messages.loading
  const messagesItems = messages.items
  console.log(messages)
  return(
<Container maxWidth="md">
  <Box sx={{ textAlign: "center", mt: 5}}>
    {isLoading ? (
      <CircularProgress />
    ) : (
      <>
        {messagesItems.map((message) => (
          <MessageComponent
            key={message.id}
            id={message.id}
            name={message.name}
            message={message.message}
            encodingType={message.encodingType}
          />
        ))}
        <Button size="large" sx={{ marginTop: '10px' }} variant="contained" color="primary" onClick={() => dispatch(addMessage())}>
          Create message
        </Button>
      </>
    )}
  </Box>
</Container>
  )
};
export default MessageList