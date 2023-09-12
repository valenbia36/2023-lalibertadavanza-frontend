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
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel } from '@mui/material';

import '../styles/SignUp.css';

const defaultTheme = createTheme();

const SignUp = () => {

  const [errorMessage, setErrorMessage] = React.useState(false);
    
  const [user, setUser] = React.useState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      age: '',
      sex: '',
      height: '',
      weight:''
  });

  const handleRegister = () => {
      if ( user.firstName === '' || user.lastName === '' || user.email === '' || user.password === '' || user.sex === '' || user.age === '' || user.height === '' || user.weight === '' ) {
        console.log(JSON.stringify(user));
        setErrorMessage(true);
        return;
      }
      console.log(JSON.stringify(user));
      fetch('http://localhost:3001/api/auth/register', {
          method: 'POST',
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
      }).then(function(response) {
          if(response.status === 200){
              window.location.replace('/login');
          }
          else{
              setErrorMessage(true);
          }
      });
  }

  return (
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
            Sign up
          </Typography>
          <Box sx={{ mt: 3 }}>
          <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              name="firstName"
              required
              fullWidth
              id="firstName"
              label="First Name"
              InputLabelProps={{
                style: { color: 'white' },
              }}
              InputProps={{
                style: { color: 'white' },
              }}
              autoFocus
              onChange={(e) => setUser({...user, firstName: e.target.value})} 
              onKeyPress={event => { if (event.key === 'Enter') { handleRegister() } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              InputLabelProps={{
                style: { color: 'white' },
              }}
              InputProps={{
                style: { color: 'white' },
              }}
              onChange={(e) => setUser({...user, lastName: e.target.value})} 
              onKeyPress={event => { if (event.key === 'Enter') { handleRegister() } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              InputLabelProps={{
                style: { color: 'white' },
              }}
              InputProps={{
                style: { color: 'white' },
              }}
              onChange={(e) => setUser({...user, email: e.target.value})} 
              onKeyPress={event => { if (event.key === 'Enter') { handleRegister() } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              InputLabelProps={{
                style: { color: 'white' },
              }}
              InputProps={{
                style: { color: 'white' },
              }}
              onChange={(e) => setUser({...user, password: e.target.value})} 
              onKeyPress={event => { if (event.key === 'Enter') { handleRegister() } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="age"
              label="Age"
              name="age"
              type="number"
              InputLabelProps={{
                style: { color: 'white' },
              }}
              InputProps={{
                style: { color: 'white', min: 0},
              }}
              onChange={(e) => setUser({...user, age: e.target.value})} 
              onKeyPress={event => { if (event.key === 'Enter') { handleRegister() } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl>
              <FormLabel style={{ color: 'white' }}>Sex</FormLabel>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="sex"
                      value="male"
                      color="primary"
                      style={{ color: 'white' }}
                      onChange={(e) => setUser({...user, sex: 'male'})} 
                    />
                  }
                  label="Male"
                  style={{ color: 'white' }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="sex"
                      value="female"
                      color="primary"
                      style={{ color: 'white' }}
                      onChange={(e) => setUser({...user, sex: 'female'})} 
                    />
                  }
                  label="Female"
                  style={{ color: 'white' }}
                />
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
              required
              fullWidth
              id="height"
              label="Height (cm)"
              name="height"
              type="number"
              InputLabelProps={{
                style: { color: 'white' },
              }}
              InputProps={{
                style: { 
                  color: 'white',
                  min: 0 
                }
              }}
              onChange={(e) => setUser({...user, height: e.target.value})} 
              onKeyPress={event => { if (event.key === 'Enter') { handleRegister() } }}
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <TextField
              required
              fullWidth
              id="weight"
              label="Weight (kg)"
              name="weight"
              type="number"
              InputLabelProps={{
                style: { color: 'white' },
              }}
              InputProps={{
                style: { 
                  color: 'white',
                  min: 0 
                }
              }}
              onChange={(e) => setUser({...user, weight: e.target.value})} 
              onKeyPress={event => { if (event.key === 'Enter') { handleRegister() } }}
            />
          </Grid>
        </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleRegister}
            >
              Sign Up
            </Button>
            {errorMessage && <p style={{color: 'red', fontSize: '14px', justifyContent: 'center', textAlign: 'center'}}>Please review your input. There are errors in one or more fields.</p>}
            <Grid container justifyContent="center">
              <Grid item>
                <Link href='/Login' variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );

}

export default SignUp;