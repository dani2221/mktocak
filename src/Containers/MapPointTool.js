import React, {Component} from 'react'
import Map from '../Components/Map'
import firebase from 'firebase'
import './Contribute.css'
import Popup from 'reactjs-popup';


export default class MapPointTool extends Component{

    state={
        point: [],
        canAddPoint: true,
        placeType: 0,
        placeName: '',
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
        this.setState({point: pnt.points,canAddPoint: false})
    }
    updatePathPlace = ev=>{
        this.setState({placeType: ev.target.value})
    }
    chPlaceName = ev=>{
        this.setState({placeName: ev.target.value})
    }
    uploadPlace = ()=>{
        if(!this.validation()){
            return;
        }
        const db = firebase.firestore();
        db.collection('modPlaces').add({point:[{lng:this.state.point[0].lng,lat:this.state.point[0].lat}],placeType: this.state.placeType,placeName:this.state.placeName,user:this.props.user.displayName,uid:this.props.user.uid}).then(()=>{
            this.resetMap();
            this.setState({popup: 'Please wait up to 24 hours for your submission to be validated. If successful, you will receive 10 cycle points!'})
        }).catch(err=>console.log(err))
    }
    resetMap = ()=>{
        this.child.current.startOver();
        this.setState({
            point: [],
            canAddPoint: true,
            placeType: 0,
            placeName: ''
        })
    }
    validation = ()=>{
        if(this.state.placeType===0){
            this.setState({popup:'Enter a place-type'})
            return false;
        }
        if(this.state.point.length===0){
            this.setState({popup:'Choose the position with the \'Add Marker\' button'});
            return false;
        }
        if(this.state.placeType==2 || this.state.placeType==3){
            if(this.state.placeName.length===0){
                this.setState({popup:'Enter name and contact for this service/store'});
                return false;
            }
        }
        return true;
    }

    render(){
        return(
            <div>
                <Popup open={this.state.popup.length>0} onClose={()=>this.setState({popup: ''})}>
                    <div>
                        <p style={{textAlign:'center'}}>{this.state.popup}</p>
                        <p style={{textAlign:'center',fontSize:'10px'}}><i>Click outside of this window to deselect</i></p>
                    </div>
                </Popup>
                <div style={{borderRadius:'10px',height:'fit-content',padding:'3px',margin:'15px',backgroundColor:'rgba(255,255,255,0.5)',border:'1px solid #2c3e50'}}>
                    <Map points={this.state.point} updatePoints={points=>this.updatePoints(points)} canAddPoint={this.state.canAddPoint} ref={this.child}/>
                    <div style={{display:'inline-block',verticalAlign:'top'}}>
                        <h4 style={{maxWidth:'500px',marginLeft:'20px'}}>You can find the submission rules at the end of the page, please read these before starting</h4>
                        <div className='select'>
                            <select value={this.state.placetype} onChange={(ev)=>this.updatePathPlace(ev)}>
                                <option value={0}>Select place-type</option>
                                <option value={1}>Parking</option>
                                <option value={2}>Service</option>
                                <option value={3}>Shop</option>
                            </select>
                        </div>
                    {this.state.placeType>1 ? <input type='text' style={{margin:'20px'}} value={this.state.placeName} placeholder='Enter service/store name and contact details (phone/website)' onChange={ev=>this.chPlaceName(ev)} />:''}
                    <button style={{display:'inline-block',width:'fit-content',height:'35px',margin:'20px',fontSize:'15px',fontWeight:'100',padding:'10px'}} className='btn draw-border' onClick={()=>this.addPointClick()}>Add Marker</button>
                    <button style={{display:'inline-block',width:'fit-content',height:'35px',margin:'20px',fontSize:'15px',fontWeight:'100',padding:'10px'}} className='btn draw-border' onClick={()=>this.uploadPlace()}>Submit!</button>
                    </div>
                </div>
                <div style={{borderRadius:'10px',height:'fit-content',padding:'30px',margin:'30px',backgroundColor:'rgba(255,255,255,0.5)',border:'1px solid #2c3e50'}}>
                    <h2>Instructions</h2>
                    <hr/>
                    <ol>
                        <p>1. Move map to desired location</p>
                        <p>2. Press 'Add Marker' to lock map position</p>
                        <p>3. Select marker type</p>
                        <p>4. Enter name and contact info for services and stores</p>
                        <p>5. Click Submit and wait for verification. After 24 hours it will be placed on the main map and you will get 10 cycle points.</p>
                    </ol>
                    <h2>Rules</h2>
                    <hr/>
                    <h3>If any rules are violated your account may be terminated.</h3>
                    <hr/>
                    <ul>
                        <p>Only submit places that exist</p>
                        <p>Check that your submission has not already been submitted</p>
                        <p>Do not send submissions more than once</p>
                    </ul>
                </div>
            </div>
        )
    }
}
