import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { updateMessage } from '../redux/slices/messages';
import { selectMessageById } from '../redux/selectors';

interface Props {}

const MessageEditPage: React.FC<Props> = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const message = useSelector(selectMessageById(id));
  const [updatedMessage, setUpdatedMessage] = useState('');

  useEffect(() => {
    if (message) {
      setUpdatedMessage(message.message);
    }
  }, [message]);

  const handleSaveClick = () => {
    if (message) {
      dispatch(updateMessage({ id: message.id, message: updatedMessage }));
    }
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4">Edit Message</Typography>
        {message ? (
          <Box mt={2}>
            <TextField
              fullWidth
              label="Message"
              value={updatedMessage}
              onChange={(event) => setUpdatedMessage(event.target.value)}
            />
            <Box mt={2}>
              <Button variant="contained" color="primary" onClick={handleSaveClick}>
                Save
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="body1">Message not found.</Typography>
        )}
      </Box>
    </Container>
  );
};

export default MessageEditPage;
