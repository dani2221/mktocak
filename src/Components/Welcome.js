import React, { Component } from 'react';
import '../App.css';
import '../Containers/Contribute.css'
import Axios from 'axios'

class Welcome extends Component {
  render(){
    return (
      <div className="App" style={{textAlign:'center',padding:'50px'}}>
        
        <h1 className='h1' style={{margin:'30px'}}>Можеш и ти да помогнеш!</h1>
        <h3 style={{margin:'30px'}}>Имај пристап до мапата и додавај нови вело-патеки или места</h3>
        <a href='/contribute' className='btn draw-border' style={{width:'150px',margin:'auto',textDecoration:'none'}}>Зачлени се</a>
        <p><i>и собирај вело-поени</i></p>
      </div>
    );
  }
}

export default Welcome;
