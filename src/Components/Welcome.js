import React, { Component } from 'react';
import '../App.css';
import '../Containers/Contribute.css'

const Welcome =()=> {
    return (
      <div className="App" style={{textAlign:'center',padding:'50px'}}>

        <h1 className='h1' style={{margin:'30px'}}>Get Involved!</h1>
        <h3 style={{margin:'30px'}}>Submit new paths and places</h3>
        <a href='/contribute' className='btn draw-border' style={{width:'150px',margin:'auto',textDecoration:'none'}}>Join</a>
        <p><i>and collect cycle points.</i></p>
      </div>
    );
  }
export default Welcome;
