import { Box, Button, Container, Link, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import env from 'react-dotenv';
import { Link as RLink, useNavigate } from 'react-router-dom';


const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data={
        password,
        email
      }
      axios.post(`${env.API_URL}/auth/login`, data)
      .then(response => {
        const authToken:string = response.headers.authorization;
        localStorage.setItem('authToken', authToken.split(' ')[1]);
        document.cookie = response.headers.cookie
        navigate('/home')
      })
      .catch(error => {
        console.error(error);
      });
    
    }
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Container maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>Login</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <TextField label="Password" variant="outlined" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>Login</Button>
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