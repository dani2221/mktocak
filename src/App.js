import React, { Component } from 'react';
import './App.css';
import Auth from './Containers/Auth'
import Contribute from './Containers/Contribute';
import FullMap from './Containers/FullMap'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Welcome from './Components/Welcome';
import ModMap from './Components/ModMap';
import { withFirebase } from './firebase/firebaseindex';
import pointsInfo from './Components/pointsInfo'
import AddRide from './Components/AddRide';
import RideList from './Containers/RideList';
import PublicUser from './Containers/PublicUser';
import LandingPage from './Containers/LandingPage'
import Error from './Components/Error'
import policy from './Components/policy'
class App extends Component {

  state={
    user: null,
    rendered: false
  }

  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(authUser => {

      if(authUser){
        this.setState({user: authUser, rendered:true })
      }else{
        this.setState({user: null, rendered: true });
      }

    });
  }

  render(){
    return (
      <div>
        <header className='header'>
          <p className='par'><a style={{textDecoration:'none',color:'#2c3e50',cursor:'pointer'}} href='/'>CS Cycle</a></p>
          <p className='hbut'><a style={{textDecoration:'none',color:'#2c3e50'}} href='/user'>Profile</a></p>
        </header>
        <Router>
          <Switch>
            <Route exact path='/' render={this.state.rendered?()=><LandingPage user={this.state.user}/>:()=><div className="lds-ring"><div></div><div></div><div></div><div></div></div>}/>
            <Route exact path='/contribute' render={this.state.rendered?(this.state.user!=null?()=><Contribute user={this.state.user}/>:()=><Auth user={this.state.user}/>):()=><div className="lds-ring"><div></div><div></div><div></div><div></div></div>}/>
            <Route path='/contribute/map' render={this.state.rendered?(this.state.user!=null?()=><FullMap/>:()=><Auth user={this.state.user}/>):()=><div className="lds-ring"><div></div><div></div><div></div><div></div></div>} />
            <Route path='/mod/:id/:line' render={this.state.rendered?(this.state.user!=null?()=><ModMap/>:()=><Auth user={this.state.user}/>):()=><div className="lds-ring"><div></div><div></div><div></div><div></div></div>}/>
            <Route exact path='/user' render={this.state.rendered?(()=><Auth user={this.state.user}/>):()=><div className="lds-ring"><div></div><div></div><div></div><div></div></div>}/>
            <Route path='/cyclepoints' component={pointsInfo}/>
            <Route path='/error' component={Error}/>
            <Route path='/addRide' render={()=><AddRide user={this.state.user}/>}/>
            <Route path='/rides' render={()=><RideList user={this.state.user}/>}/>
            <Route path='/user/:uid' render={this.state.rendered?()=><PublicUser user={this.state.user}/>:()=><div className="lds-ring"><div></div><div></div><div></div><div></div></div>}/>
            <Route path='/policy' component={policy}/>

          </Switch>
        </Router>
      </div>
    );
  }
}

export default withFirebase(App);
