import React,{Component} from 'react';
import firebase from 'firebase'
import RideList from './RideList'
import {withFirebase} from '../firebase/firebaseindex'
import { withRouter } from 'react-router-dom';


class PublicUser extends Component{

    constructor(props){
        super(props)
        this.imgg = React.createRef();
    }

    state={
        points:0,
        posts:[],
        photoURL: 'https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg',
        name: ''
    }

    componentDidMount(){
        const db = firebase.firestore();
        db.collection('users').doc(this.props.match.params.uid).get().then(res=>{
            this.setState({points:res.data().veloPoints,posts:res.data().posts,name:res.data().name,photoURL:res.data().photoURL})
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
                    <h1>{this.state.name}</h1>
                    <p style={{marginBottom:'1px'}}>Cycle-Points: {this.state.points}</p>
                    <p style={{margin:'1px'}}><a style={{fontSize:'10px',color:'white'}} href='/cyclepoints'><i>Cycle-Points?</i></a></p>
                </div>
            </div>
            <div>
                <h3>Rides on {this.state.name}</h3>
                <RideList uid={this.props.match.params.uid} user={this.props.user} noOver={true}/>
            </div>
            </div>
        )
    }
}

export default withRouter(withFirebase(PublicUser));
