import React, { Component } from 'react';
import {FirebaseContext} from '../firebase/firebaseindex'
import Login from '../Components/Login'
import User from './User'

export default class Auth extends Component{

    login = ()=>{
        return(
            <FirebaseContext.Consumer>
                {firebase=>{
                    return(
                        <div>
                            <Login firebase={firebase}/>
                        </div>
                    )
                }}
            </FirebaseContext.Consumer>
        )
    }

    user = us=>{
        return(
            <User user={us}/>
        )
    }

    render(){
        if(this.props.user==null){
            return this.login();
        }else{
            return this.user(this.props.user);
        }
    }
}