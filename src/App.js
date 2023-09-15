import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Main from './screens/Main';
import './styles/Home.css';

export default function App() {
  return (
    <div className='Home-header' style={{backgroundColor: '#CAD2C5'}}>
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="signUp" element={<SignUp />} />
      <Route path="main" element={<Main />} />
    </Routes>
    </div>
  );
}