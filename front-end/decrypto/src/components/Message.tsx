import { Button, Card, CardActions, CardContent, Container, Grid, IconButton, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteMessage, saveMessageById, selectMessageById } from '../redux/slices/messages';
import { AppDispatch } from '../redux/store';
import { useDispatch } from 'react-redux';
import axios from '../axios';
import User from '../interfaces/User';
import jwt_decode from 'jwt-decode';

interface Props {
  message: string;
  encodingType: string
  decodingKey:string
  id:string
}

const MessageComponent: React.FC<Props> = ({message, encodingType , id, decodingKey}) => {

  
  const getUserId = (token:string|null)=>{
    if(!token){
      return false
    }
    const data:User = jwt_decode(token)
    return data.id
  }

  const dispatch:AppDispatch = useDispatch();
  useEffect(()=>{dispatch(selectMessageById(id))},[dispatch])
  const [deleted, setDeleted] = useState(false);
  const [isDecoded, setIsDecoded] = useState(encodingType=="decoded")
  const [type, setType] = useState(encodingType)
  const [text, setText] = useState(message)
  const [key, setKey] = useState(decodingKey)
  const deleteItem= (id:string) =>{
    dispatch(deleteMessage(id))
    setDeleted(true)
  }

  const saveItem =(id:string) =>{
    axios.patch(`/users/${getUserId(localStorage.getItem('authToken'))}/messages/${id}`,{
      message:text,
      decodingKey:key
    })
  }

  const encode =async (type:string) =>{
    if(type!="decoded"){
      await axios.patch(`/users/${getUserId(localStorage.getItem('authToken'))}/messages/${id}/code`,{
        encodingType:type,
        decodingKey:key 
      })
      .then((res)=>{
        console.log(res.data)
        return res.data.message
      })
    }
  }

  const changeEncoding =(type:string) =>{
    setIsDecoded(!isDecoded)
    setType(type)
  }

  if (deleted) {
    return null;
  }

  return (
<Card variant="outlined">
  <CardContent>
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={6}>
        <Typography color="textSecondary" gutterBottom>
          {type}
        </Typography>
      </Grid>
      {isDecoded ? (
  <>
    <Container>
  <TextField 
  value={text}
  id="message" 
  label="Message" 
  variant="filled" 
  sx={{ margin: '0.5rem' }}
  onChange={(e) => {
    if(e.target.value.length>=1){
      return setText(e.target.value)
    }
  }}
/>
<TextField 
type = "number"
sx={{ margin: '0.5rem' }}
value={key}
onChange={(e) => {
  if(e.target.value.length>=1){
    return setKey(e.target.value)
  }
}}
  id="key" 
  label="Key" 
  variant="filled" 
/>
  </Container>
  </>
) : (
null
)}

      <Grid item xs={12} sm={6} container justifyContent="flex-end">
      </Grid>
      <Grid item xs={12}>
      {!isDecoded ? (
        <TextField
        disabled
        label="Cipher"
        variant="standard"
        value={encode(type)}/>
      ):null}
      </Grid>
    </Grid>
  </CardContent>
  <CardActions>
    <Button variant="contained" color="error" onClick={deleteItem.bind(this, id)}>
      Delete message
    </Button>
    {isDecoded ?(
      <>
    <Button variant="contained" color="info"  onClick={()=>changeEncoding("xor")} sx={{ margin: '0.5rem' }}>
      Encode XOR
    </Button>
    <Button variant="contained" color="info" onClick={()=>changeEncoding("caesar")} sx={{ margin: '0.5rem' }}>
      Encode Caesar
    </Button>
    <Button variant="contained" color="success" onClick={()=>saveItem(id)}>
      Save
    </Button>
    </>):
      <Button variant="contained" color="success" onClick={()=>setIsDecoded(true)}>
      Decode
    </Button>

}
  </CardActions>
  
</Card>

  );
};

export default MessageComponent;