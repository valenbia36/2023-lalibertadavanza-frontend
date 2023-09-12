import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

const Login = () => {

  const [user, setUser] = React.useState({
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = React.useState(false);

  const handleLogin= () => {
    if ( user.email === '' || user.password === '' ) {
      setErrorMessage(true);      
      return;
    } else{
      fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      })
      .then(response => response.json())
      .then(data => {
        if(data.status === 200){
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user._id);
            localStorage.setItem('username', data.user.firstName  + ' ' + data.user.lastName);
            localStorage.setItem('roles', data.user.role[0]);
            window.location.replace('/main');
        }
        else{
          setErrorMessage(true);
        }
      })
    }
  }
  
  return(
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              InputLabelProps={{
                style: { color: 'white' },
              }}
              InputProps={{
                style: { color: 'white', min: 0},
              }}
              onChange={(e) => setUser({...user, email: e.target.value})} 
              onKeyPress={event => { if (event.key === 'Enter') { handleLogin() } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              InputLabelProps={{
                style: { color: 'white' },
              }}
              InputProps={{
                style: { color: 'white', min: 0},
              }}
              onChange={(e) => setUser({...user, password: e.target.value})} 
              onKeyPress={event => { if (event.key === 'Enter') { handleLogin() } }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => handleLogin()}
            >
              Sign In
            </Button>
            <Grid container justifyContent="center">
              {errorMessage && <p style={{color: 'red', fontSize: '14px', justifyContent: 'center', textAlign: 'center'}}>Please review your input. There are errors in one or more fields.</p>}
              <Grid item>
                <Link href="/SignUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;