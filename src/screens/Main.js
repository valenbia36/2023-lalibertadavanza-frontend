import React from 'react';

const Main = () => {

  return(
    <div>
        <span style={{fontSize: '12px'}}>
            Username: {localStorage.getItem('username')}
        </span>
        <br/>
        <span style={{fontSize: '12px'}}>
            Role: {localStorage.getItem('roles')}
        </span>
        <br/>
        <span style={{fontSize: '12px'}}>
            UserId: {localStorage.getItem('userId')}
        </span>
        <br/>
        <span style={{fontSize: '12px'}}>
            Token: {localStorage.getItem('token')}
        </span>
    </div>
  ); 
}

export default Main;
