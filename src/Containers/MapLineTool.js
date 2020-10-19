import React, { Component } from 'react';
import Map from '../Components/Map'
import firebase from 'firebase';
import './Contribute.css'
import Popup from 'reactjs-popup';
import { withFirebase } from '../firebase/firebaseindex';

export default class MapLineTool extends Component{

    state={
        points: [],
        pathState: 0,
        pathPlace: 0,
        popup: ''
    }

    constructor(props) {
        super(props);
        this.child = React.createRef();
    }
    addPointClick = () => {
        this.child.current.addPoint();
    };
    updatePoints = pnt=>{
        this.setState({points: pnt.points})
    }
    updatePathState = ev=>{
        this.setState({pathState: ev.target.value})
    }
    updatePathPlace = ev=>{
        this.setState({pathPlace: ev.target.value})
    }
    uploadPoints = ()=>{
        if(!this.validation()){
            return;
        }
        const db = firebase.firestore();
        const destructuredPoints = [];
        this.state.points.map(el=>{
            const obj={
                lng: el.lng,
                lat: el.lat
            }
            destructuredPoints.push(obj);
        })
        db.collection('modMap').add({points: destructuredPoints, pathState: this.state.pathState, pathPlace: this.state.pathPlace,user:this.props.user.displayName,uid:this.props.user.uid}).then(()=>{
        this.startOver()
        this.setState({popup: 'Please wait up to 24 hours for your submission to be validated. If successful, you will receive 10 cycle points!'})
        }).catch((error)=>{
            console.log(error);
            this.setState({popup: 'There was a problem, try again later.'})
        })
    }
    startOver = ()=>{
        this.child.current.startOver();
        this.setState({
            points: [],
            pathState: 0,
            pathPlace: 0
        })
    }
    validation = ()=>{
        if(this.state.pathState==0){
            this.setState({popup: 'Enter path-status'});
            return false;
        }
        if(this.state.pathPlace==0){
            this.setState({popup: 'Enter path position'});
            return false;
        }
        if(this.state.points.length<2){
            this.setState({popup: 'Path Disabled - Please enter at least two points that represent a valid path.'});
            return false;
        }
        return true
    }
    render(){
        return(
            <div>
                <Popup open={this.state.popup} onClose={()=>this.setState({popup: ''})}>
                    <div>
                        <p style={{textAlign:'center'}}>{this.state.popup}</p>
                        <p style={{textAlign:'center',fontSize:'10px'}}><i>Click outside of this window to deselect</i></p>
                    </div>
                </Popup>
                <div style={{borderRadius:'10px',height:'fit-content',padding:'3px',margin:'15px',backgroundColor:'rgba(255,255,255,0.5)',border:'1px solid #2c3e50'}}>
                    <Map points={this.state.points} updatePoints={points=>this.updatePoints(points)} canAddPoint={true} ref={this.child}/>
                    <div style={{display:'inline-block',verticalAlign:'top'}}>
                    <h4 style={{maxWidth:'500px',marginLeft:'20px'}}>You can find the submission rules at the end of the page, please read these before starting</h4>
                        <div className='select'>
                            <select value={this.state.pathState} onChange={(ev)=>this.updatePathState(ev)}>
                                <option value={0}>Select path condition</option>
                                <option value={1}>Perfect</option>
                                <option value={2}>Good</option>
                                <option value={3}>Poor</option>
                            </select>
                        </div>
                    <div className='select'>
                        <select value={this.state.pathPlace} onChange={(ev)=>this.updatePathPlace(ev)}>
                            <option value={0}>Select path position</option>
                            <option value={1}>On road</option>
                            <option value={2}>Pavement - Separate from Pedestrians</option>
                            <option value={3}>Pavement - With Pedestrians</option>
                            <option value={4}>Separate/Offroad</option>
                        </select>
                    </div>
                    <button style={{display:'inline-block',width:'fit-content',height:'35px',margin:'20px',fontSize:'15px',fontWeight:'100',padding:'10px'}} className='btn draw-border' onClick={()=>this.addPointClick()}>Add Pointer</button>
                    <button style={{display:'inline-block',width:'fit-content',height:'35px',margin:'20px',fontSize:'15px',fontWeight:'100',padding:'10px'}} className='btn draw-border' onClick={()=>this.uploadPoints()}>Submit</button>
                    <button style={{display:'inline-block',width:'fit-content',height:'35px',margin:'20px',fontSize:'15px',fontWeight:'100',padding:'10px'}} className='btn draw-border' onClick={()=>this.startOver()}>Start Over</button>
                </div>
                </div>
                <div style={{borderRadius:'10px',height:'fit-content',padding:'30px',margin:'30px',backgroundColor:'rgba(255,255,255,0.5)',border:'1px solid #2c3e50'}}>
                    <h2>Instructions</h2>
                    <hr/>
                    <ol>
                        <p>1. Move map to beginning of path</p>
                        <p>2. Press 'Add point' to lock position</p>
                        <p>3. Move map to next turn and click 'Add point'</p>
                        <p>4. Continue until end of path</p>
                        <p>5. Select condition and position</p>
                        <p>6. Check everything is correct</p>
                        <p>7. Click Submit and wait for verification. After 24 hours it will be placed on the main map and you will get 10 cycle points.</p>
                    </ol>
                    <h2>Rules</h2>
                    <hr/>
                    <h3>If any rules are violated your account may be terminated</h3>
                    <hr/>
                    <ul>
                        <p>Zoom in and be precise with your points</p>
                        <p>Do not submit false paths</p>
                        <p>Check your submission has not already been submitted</p>
                        <p>Do not send submissions more than once</p>
                    </ul>
                </div>
            </div>
        )
    }
}
