import React, { Component } from 'react';
import {GoogleLoginButton,FacebookLoginButton,TwitterLoginButton} from 'react-social-login-buttons'
import '../Containers/Contribute.css'
import firebase from 'firebase'

class Login extends Component{
    google = ()=>{
        this.props.firebase
        .doSignInWithGoogle().then(user=>{
            if(user.additionalUserInfo.isNewUser){
                const customObj = {
                    name: user.user.displayName,
                    veloPoints: 0,
                    photoURL: user.user.photoURL,
                    posts: []
                }
                const db = firebase.firestore();
                db.collection('users').doc(user.user.uid).set(customObj).then(re=>{
                    console.log(re)
                }).catch(er=>{
                    console.log(er)
                });
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    facebook = ()=>{
        this.props.firebase
        .doSignInWithFacebook().then(user=>{
            if(user.additionalUserInfo.isNewUser){
                const customObj = {
                    name: user.user.displayName,
                    veloPoints: 0,
                    photoURL: user.user.photoURL,
                    posts: []
                }
                const db = firebase.firestore();
                db.collection('users').doc(user.user.uid).set(customObj).then(re=>{
                    console.log(re)
                }).catch(er=>{
                    console.log(er)
                });
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    twitter = ()=>{
        this.props.firebase
        .doSignInWithTwitter().then(user=>{
            if(user.additionalUserInfo.isNewUser){
                const customObj = {
                    name: user.user.displayName,
                    cyclePoints: 0,
                    photoURL: user.user.photoURL,
                    posts: []
                }
                const db = firebase.firestore();
                db.collection('users').doc(user.user.uid).set(customObj).then(re=>{
                    console.log(re)
                }).catch(er=>{
                    console.log(er)
                });
            }
        }).catch(err=>{
            console.log(err)
        })
    }


    render(){
        return(
            <div className='middle' style={{border: '1px solid black',padding:'20px',borderRadius:'5px',height:'fit-content',width:'280px',marginLeft:'-160px',marginTop:'-130px'}}>
                <FacebookLoginButton onClick={()=>this.facebook()}><span>Login with Facebook</span></FacebookLoginButton>
                <TwitterLoginButton style={{marginTop:'30px'}} onClick={()=>this.twitter()}><span>Login with Twitter</span></TwitterLoginButton>
                <GoogleLoginButton style={{marginTop:'30px'}} onClick={()=>this.google()}><span>Login with Google</span></GoogleLoginButton>
            </div>
        )
    }
}

export default Login;
