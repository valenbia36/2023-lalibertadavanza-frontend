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
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://img.freepik.com/foto-gratis/lay-flat-delicioso-concepto-comida-sana_23-2148648502.jpg?w=1380&t=st=1694729010~exp=1694729610~hmac=8f6349b5b92090526d1bd3acdd7e87d04fcd5b2bb1ab6d30f326c790dc75de66)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} style={{backgroundColor: '#CAD2C5'}} elevation={6} square="true">
        <div style={{justifyContent: 'center', textAlign: 'center', color: 'black', marginTop: '10%'}}>
        <Typography variant="h3" color="inherit" noWrap>
          HELIAPP
          </Typography>        
        </div>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" style={{color: 'black', fontWeight: 'bold'}}>
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
                style: { color: 'black'},
              }}
              InputProps={{
                style: { color: 'color', min: 0},
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
                style: { color: 'black' },
              }}
              InputProps={{
                style: { color: 'black', min: 0},
              }}
              onChange={(e) => setUser({...user, password: e.target.value})} 
              onKeyPress={event => { if (event.key === 'Enter') { handleLogin() } }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: '#373D20', '&:hover': {backgroundColor: '#373D20'}, fontWeight: 'bold' }}
              onClick={() => handleLogin()}
            >
              Sign In
            </Button>
            <Grid container justifyContent="center">
              {errorMessage && <p style={{color: 'red', fontSize: '14px', justifyContent: 'center', textAlign: 'center'}}>Please review your input. There are errors in one or more fields.</p>}
              <Grid item style={{justifyContent: 'center'}}>
                <Link href="/SignUp" variant="body2" sx={{color: 'black'}}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  </ThemeProvider>
  );
}

export default Login;