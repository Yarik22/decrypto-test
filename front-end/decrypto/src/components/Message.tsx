import { Button, Card, CardContent, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteMessage } from '../redux/slices/messages';
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';

interface Props {
  message: string;
  name: string;
  encodingType: string
  id:string
}

const MessageComponent: React.FC<Props> = ({message , name , encodingType , id}) => {
  const dispatch:AppDispatch = useDispatch();
  const [deleted, setDeleted] = useState(false);
  const navigate = useNavigate();
  const deleteItem= (id:string) =>{
    dispatch(deleteMessage(id))
    setDeleted(true)
  }
  const handleEditClick=()=>{
    navigate(`/messages/${id}/edit`)
  }
  if (deleted) {
    return null; // return null to render nothing
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {encodingType}
        </Typography>
        <Typography variant="body2" component="p">
          {message}
        </Typography>
        <IconButton aria-label="edit" onClick={handleEditClick}>
          <EditIcon />
        </IconButton>
      </CardContent>
      <Button variant="contained" color="primary" onClick={deleteItem.bind(this,id)}>
          Delete message
      </Button>
    </Card>
  );
};

export default MessageComponent;