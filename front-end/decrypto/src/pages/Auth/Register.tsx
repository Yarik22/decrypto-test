import { useState } from 'react';
import { Box, Button, Container, Link, TextField, Typography } from '@mui/material';
import { Link as RLink } from 'react-router-dom';
import axios from 'axios';
import env from "react-dotenv";

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (event:React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${env.API_URL}/auth/registration`, {
        "name":username,
        "password":password,
        "email":email
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Container maxWidth="xs">
        <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>Register</Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Username" variant="outlined" value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField label="Email" variant="outlined" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Password" variant="outlined" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Register</Button>
          </Box>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link component={RLink} to="/login">Already have an account? Login here.</Link>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
