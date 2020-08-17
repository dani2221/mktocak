import React, { Component } from 'react'
import PostMap from './PostMap'
import './Ride.css'
import LikeButton from './LikeButton'
import firebase from 'firebase'
import { withRouter } from 'react-router-dom'

class Ride extends Component{
    state={
        photo: 'https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg'
    }
    componentWillReceiveProps(next){
        let hasLiked = false;
        try{
        next.likers.map(el=>{
            if(el===this.props.user.uid){
                hasLiked=true;
            }
        })}catch(err){
            //not logged in
        }
        this.setState({photo:next.photo,liked:hasLiked})
    }
    componentDidMount(){
        let hasLiked = false;
        try{
        this.props.likers.map(el=>{
            if(el===this.props.user.uid){
                hasLiked=true;
            }
        })}catch(err){
            //not logged in
        }
        this.setState({photo:this.props.photo,liked:hasLiked})
    }
    errorPhoto = ()=>{
        this.setState({photo:'https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg'})
    }
    changeLike = cngState => {
        if(!this.props.user){
            this.props.history.push('/user');
            return;
        }
        this.setState({liked: cngState,addOne: cngState});
        if(cngState){
            const db = firebase.firestore();
            db.collection('posts').doc(this.props.id).update({
                likes: firebase.firestore.FieldValue.increment(1),
                likers: firebase.firestore.FieldValue.arrayUnion(this.props.user.uid)
            })
            db.collection('users').doc(this.props.uid).update({
                veloPoints: firebase.firestore.FieldValue.increment(1)
            })
        }else{
            const db = firebase.firestore();
            db.collection('posts').doc(this.props.id).update({
                likes: firebase.firestore.FieldValue.increment(-1),
                likers: firebase.firestore.FieldValue.arrayRemove(this.props.user.uid)
            })
            db.collection('users').doc(this.props.uid).update({
                veloPoints: firebase.firestore.FieldValue.increment(-1)
            })
        }
    }
    redirectToUser = () =>{
        this.props.history.push('/user/'+this.props.uid)
    }
    render(){
        let inlineStyle={};
        if(this.props.inline){
            inlineStyle = {display: 'inline-block',margin:'10px'}
        }


        return(
            <div className='postCon' style={inlineStyle}>
                <div>
                    <div style={{margin:'10px'}}>
                        <div onClick={()=>this.redirectToUser()} style={{padding:'0px',margin:'0px',cursor:'pointer',display:'inline-block'}}>
                            <img src={this.state.photo} style={{width:'40px',height:'40px',borderRadius:'50%',display:'inline-block',verticalAlign:'middle'}} onError={()=>this.errorPhoto()}/>
                            <p style={{display:'inline-block',fontWeight:'900',fontSize:'20px',margin:'5px',padding:'0px',marginLeft:'20px',verticalAlign:'middle'}}>{this.props.name}</p>
                        </div>
                        <div style={{display:'inline-block',float:'right'}}>
                            <pre style={{float:'right',verticalAlign:'bottom',fontSize:'7px',color:'gray',transform: 'translateY(17px)'}}><i>{this.props.time}</i></pre>
                        </div>
                    </div>
                </div>
                <div>
                    <PostMap line={this.props.line}/>
                </div>
                <div>
                    <LikeButton liked={this.state.liked} changeLike={(cngState)=>this.changeLike(cngState)}/>
                    {this.state.addOne ? <p style={{display:'inline-block',verticalAlign:'middle',marginLeft:'10px'}}>{this.props.likes+1}</p>: <p style={{display:'inline-block',verticalAlign:'middle',marginLeft:'10px'}}>{this.props.likes}</p>}
                </div>
                <div>
                    <p>{this.props.title}</p>
                </div>
            </div>
    )}
}

export default withRouter(Ride);