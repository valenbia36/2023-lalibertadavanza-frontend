import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import Main from './screens/Main';
import './styles/Home.css';

export default function App() {
  return (
    <div className='Home-header'>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />}/>
      <Route path="signUp" element={<SignUp />} />
      <Route path="main" element={<Main />} />
    </Routes>
    </div>
  );
}