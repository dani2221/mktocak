import React, { Component } from 'react'
import FullMap from './FullMap'
import Ride from '../Components/Ride';
import firebase from 'firebase'
import './Contribute.css'
import { withRouter } from 'react-router-dom';

class LandingPage extends Component{

    state={
        rides: [{
            user:{
                photo: '',
                name: '',
                uid: ''
            },
            likes: 0,
            likers: [],
            time: '',
            line: [{lng:22.01,lat:41.01}],
            when: 0
        },{
            user:{
                photo: '',
                name: '',
                uid: ''
            },
            likes: 0,
            likers: [],
            time: '',
            line: [{lng:22.01,lat:41.01}],
            when: 0
        },{
            user:{
                photo: '',
                name: '',
                uid: ''
            },
            likes: 0,
            likers: [],
            time: '',
            line: [{lng:22.01,lat:41.01}],
            when: 0
        }]
    }

    componentDidMount(){
        const db = firebase.firestore();
            db.collection('posts').orderBy('when','desc').limit(3).get().then(res=>{
                const data = []
                res.docs.map(doc=>{
                    data.push({...doc.data(),id: doc.id})
                })
                this.setState({rides: data})
            }).catch(er=>{
                console.log(er);
                this.props.history.push('/error')
            })
    }

    render(){
        return(
            <div>
                <div>
                    <FullMap/>
                </div>
                <div style={{padding:'15px'}}>
                    <h1 style={{color:'#2c3e50'}}>Најнови објави:</h1>
                    <Ride {...this.state.rides[0]} user={this.props.user} inline={true}/>
                    <Ride {...this.state.rides[1]} user={this.props.user} inline={true}/>
                    <Ride {...this.state.rides[2]} user={this.props.user} inline={true}/>
                    <button className='btn draw-border' style={{margin:'auto',marginTop:'5px'}} onClick={()=>this.props.history.push('/rides')}>Сите објави</button>
                </div>
                <div style={{borderRadius:'10px',height:'fit-content',padding:'10px',margin:'15px',marginTop:'30px',backgroundColor:'rgba(255,255,255,0.5)',border:'1px solid #2c3e50'}}>
                    <h1 style={{textAlign:'center'}}><a href='/user' style={{textDecoration:'none',color:'#f39c12'}}>Најави се!</a></h1>
                    <p style={{display:'inline-block',textAlign:'center',width:'33%',fontSize:'20px'}}><i>Постирај ги твоите возења</i></p>
                    <p style={{ display:'inline-block',textAlign:'center',width:'33%',fontSize:'20px'}}><i>Учествувај во {'\n'}унапредување на мапата</i></p>
                    <p style={{ display:'inline-block',textAlign:'center',width:'33%',fontSize:'20px'}}><i>Собирај вело-поени!</i></p>
                </div>
                <div style={{height:'20px',width:'100%',backgroundColor:'#2c3e50',textAlign:'center'}}>
                    <p><a style={{color:'white',textAlign:'center',fontSize:'10px',verticalAlign:'middle'}} href='/policy'>TOS</a></p>
                </div>
            </div>
        )
    }
}

export default withRouter(LandingPage);