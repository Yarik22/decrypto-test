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
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import FileCopyIcon from '@mui/icons-material/FileCopy';


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
  const [isError, setIsError] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [isDecoded, setIsDecoded] = useState(encodingType=="decoded")
  const [type, setType] = useState(encodingType)
  const [text, setText] = useState(message)
  const [key, setKey] = useState(decodingKey)
  const [isSaved, setIsSaved] = useState(true)
  const [cipher, setCipher] = useState("")
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cipher);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const deleteItem= (id:string) =>{
    dispatch(deleteMessage(id))
    setDeleted(true)
  }
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if(e.target.value.length<1){
      setIsError(true);
      return
    }
    setIsSaved(false)
    setIsError(false);
  };
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value)
    if(e.target.value.length<1){
      setIsError(true);
      return
    }
    setIsSaved(false)
    setIsError(false);
  };
  const saveItem = async (id:string) =>{
    setIsSaved(true)
    await axios.patch(`/users/${getUserId(localStorage.getItem('authToken'))}/messages/${id}`,{
      message:text,
      decodingKey:key
    })
  }

  const changeEncoding =async (type:string) =>{
    setIsDecoded(!isDecoded)
    setType(type)
    if(type!="decoded"){
      await saveItem(id)
      await axios.patch(`/users/${getUserId(localStorage.getItem('authToken'))}/messages/${id}/code`,{
        encodingType:type,
        decodingKey:key 
      })
      .then((res)=>{
        console.log(res.data)
        setCipher(res.data.message)
      })
    }
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
  error={!text.length}
  sx={{ margin: '0.5rem' }}
  onChange={handleTextChange
}
/>
<TextField 
type = "number"
sx={{ margin: '0.5rem' }}
value={key}
onChange={handleKeyChange}
  id="key" 
  label="Key" 
  variant="filled" 
  error={!key.length}
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

        <>
        <TextField
        disabled
        label="Cipher"
        variant="standard"
        value={cipher}/>

      <IconButton color="primary" onClick={handleCopy}>
        <FileCopyIcon />
      </IconButton>
      {copied && <span style={{ color: 'green' }}>Copied to clipboard!</span>}
  </>
      ):null}
      </Grid>
    </Grid>
  </CardContent>
  <CardActions>
    <Button variant="contained" startIcon={<DeleteIcon />} color="error" onClick={deleteItem.bind(this, id)}>
      Delete message
    </Button>
    {isDecoded ?(
      <>
    <Button disabled={!key.length||!text.length} variant="contained" color="info"  onClick={()=>changeEncoding("xor")} sx={{ margin: '0.5rem' }}>
      Encode XOR
    </Button>
    <Button disabled={!key.length||!text.length} variant="contained" color="info" onClick={()=>changeEncoding("caesar")} sx={{ margin: '0.5rem' }}>
      Encode Caesar
    </Button>
        <Button disabled={!key.length||!text.length||isSaved} variant="outlined" startIcon={<SendIcon/>} color="success" onClick={()=>saveItem(id)}>
        Save
      </Button>
    </>):
      <Button disabled={!key.length||!text.length} variant="contained" color="success" onClick={()=>changeEncoding('decoded')}>
      Decode
    </Button>

}
  </CardActions>
  
</Card>

  );
};

export default MessageComponent;