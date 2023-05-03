import { Box, Button, Container, Link, TextField, Typography } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import env from 'react-dotenv';
import { Link as RLink, useNavigate } from 'react-router-dom';
import HttpException from '../../interfaces/HttpException';



const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data={
        password,
        email
      }
      axios.post(`${env.API_URL}/auth/login`, data)
      .then(response => {
        const authToken:string = response.headers.authorization;
        console.log(authToken)
        localStorage.setItem('authToken', authToken.split(' ')[1]);
        document.cookie = response.headers.cookie
        window.location.replace('/messages');
      })
      .catch((error:AxiosError) => {
        setIsError(true)
        console.error(error)
      })
    }
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Container maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>Login</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Email" variant="outlined" type="email" value={email} error={email.length<8||isError} onChange={(e) => {
                    setIsError(false)
                    setEmail(e.target.value)}
          }/>
          <TextField label="Password" variant="outlined" type="password" error={password.length<8||isError} value={password} onChange={(e) => {
                    setIsError(false)
                    setPassword(e.target.value)}
          }/>
          {isError?
          <Typography variant="body1" sx={{ color: 'red', fontWeight: 'bold' }}>
    Password or email is incorrect
  </Typography>:null}
          <Button type="submit" variant="contained" disabled={password.length<8||email.length<8} sx={{ mt: 2 }}>Login</Button>
        </Box>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
            <RLink to="/register">Don't have an account? Register here.</RLink>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage