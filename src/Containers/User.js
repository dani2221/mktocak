import React, {Component} from 'react';
import {withFirebase} from '../firebase/firebaseindex'
import firebase from 'firebase'
import './Contribute.css'
import RideList from './RideList';
import { withRouter } from 'react-router-dom';

class User extends Component{

    constructor(props){
        super(props)
        this.imgg = React.createRef();
    }

    state={
        points:0,
        posts:[],
        photoURL: this.props.user.photoURL
    }

    logOut = ()=>{
        this.props.firebase.doSignOut().then(res=>{
            console.log(res)
        }).catch(er=>{
            console.log(er);
        })
    }
    componentDidMount(){
        const db = firebase.firestore();
        db.collection('users').doc(this.props.user.uid).get().then(res=>{
            this.setState({points:res.data().veloPoints,posts:res.data().posts})
        }).catch(er=>{
            this.setState({points:0,posts:[]})
        })
    }

    errorPic = ()=>{
        this.setState({photoURL: 'https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg'})
    }



    render(){
        return(
            <div style={{textAlign:'center'}}>
            <div style={{textAlign:'center',backgroundColor:'#2c3e40',paddingBottom:'50px'}}>
                <div style={{display:'inline-block',verticalAlign:'top'}}>
                    <img src={this.state.photoURL} style={{width:'130px',height:'130px',margin:'30px',borderRadius:'50%'}} onError={()=>this.errorPic()} ref={this.imgg}></img>
                </div>
                <div style={{display:'inline-block',margin:'20px',color:'white'}}>
                    <h1>{this.props.user.displayName}</h1>
                    <p style={{marginBottom:'1px'}}>Cycle Points {this.state.points}</p>
                    <p style={{margin:'1px'}}><a style={{fontSize:'10px',color:'white'}} href='/cyclepoints'><i>Cycle Point?</i></a></p>
                </div>
                <button className='btn draw-border' style={{color:'white',boxShadow:'inset 0 0 0 4px white',width:'150px',fontSize:'15px',margin:'auto'}} onClick={this.logOut}>Log Out</button>
            </div>
            <div>
                <h3>My Routes:</h3>
                <button className='btn draw-border' style={{fontSize:'15px',margin:'auto'}} onClick={()=>this.props.history.push('/addRide')}>Add Route</button>
                <RideList uid={this.props.user.uid} user={this.props.user} noOver={true}/>
            </div>
            </div>
        )
    }
}

export default withRouter(withFirebase(User))
