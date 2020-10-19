import React,{Component, useRef} from 'react'
import firebase from 'firebase'
import Map from './Map'
import '../Containers/Contribute.css'
import Popup from 'reactjs-popup'
import {withRouter} from 'react-router-dom'
class AddRide extends Component{

    state={
        title: '',
        hour: '',
        minute: '',
        points: [],
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
    startOver = ()=>{
        this.child.current.startOver();
        this.setState({
            points: []
        })
    }
    validation = ()=>{
        if(this.state.title.length===0){
            this.setState({popup:'Please enter description'})
            return false;
        }
        if(this.state.title.length>500){
            this.setState({popup:'Description must not be more than 500 characters '+this.state.title.length+'/500'})
            return false;
        }
        if(isNaN(this.state.hour)){
            this.setState({popup:'Please enter a valid number in the hour field'})
            return false;
        }
        if(isNaN(this.state.minute)){
            this.setState({popup:'Please enter a valid number in the minute field'})
            return false;
        }
        if(this.state.hour.length===0 || this.state.minute.length===0){
            this.setState({popup:'Please enter a valid number in the hours and minutes field'})
            return false;
        }
        if(this.state.points.length<2){
            this.setState({popup:'Use a minimum of 2 points to mark your path'})
            return false;
        }
        return true;


    }
    setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substring(0,index) + chr + str.substring(index+1);
    }

    upload = ()=>{
        if(!this.validation()){
            return;
        }
        let time = '';
        if(this.state.hour==0){
        }else if(this.state.hour==1){
            time='One hour'
        }
        else{
            time=this.state.hour + ' hours'
        }
        if(this.state.minute==0){}else if(this.state.minute==1){
            time+=' and one minute'
        }else{
            time+=' and '+this.state.minute+' minutes'
        }
        if(this.state.hour==0 & this.state.minute!=0){
            time = this.setCharAt(time,1,' ');
        }
        const destructuredPoints = [];
        this.state.points.map(el=>{
            const obj={
                lng: el.lng,
                lat: el.lat
            }
            destructuredPoints.push(obj);
        })
        const obj = {
            title: this.state.title,
            time: time,
            line: destructuredPoints,
            likes: 0,
            name: this.props.user.displayName,
            photo: this.props.user.photoURL,
            uid: this.props.user.uid,
            likers: [],
            when: firebase.firestore.FieldValue.serverTimestamp()
        }
        const db = firebase.firestore();
        db.collection('posts').add(obj).then(res=>{
            db.collection('users').doc(this.props.user.uid).update({
                posts: firebase.firestore.FieldValue.arrayUnion(res.id)
            }).then(result=>{
                console.log(result)
                //редирект
                this.props.history.push('/rides');
            }).catch(error=>{
                console.log(error)
                this.setState({popup:'There was a problem submitting, please try again'})
            })
        }).catch(err=>{
            this.setState({popup:'There was a problem submitting, please try again'})
        })
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
                <div style={{borderRadius:'10px',minHeight:'350px',padding:'3px',margin:'15px',backgroundColor:'rgba(255,255,255,0.5)',border:'1px solid #2c3e50',padding:'20px'}}>
                    <div>
                        <div className='addRideText'>
                            <input style={{marginTop:'50px',width:'100%'}} type='text' placeholder='Enter Description' value={this.state.title} onChange={(ev)=>this.setState({title:ev.target.value})}/>
                            <h4>Route Duration</h4>
                            <input style={{marginTop:'10px',marginRight:'20px',display:'inline-block',maxWidth:'70px'}} type='text' placeholder='Hours' value={this.state.hour} onChange={(ev)=>this.setState({hour:ev.target.value})}/>
                            <input style={{marginTop:'10px',display:'inline-block',maxWidth:'70px'}} type='text' placeholder='Minutes' value={this.state.minute} onChange={(ev)=>this.setState({minute:ev.target.value})}/>
                        </div>
                        <div className='addRideMap'>
                            <h4>Enter route below</h4>
                            <Map ref={this.child} cancelDefault={true} points={this.state.points} updatePoints={points=>this.updatePoints(points)} canAddPoint={true} smol={true}/>
                        </div>
                    </div>
                    <div style={{textAlign:'center'}}>
                        <button className='btn draw-border' style={{display:'inline-block',margin:'10px'}} onClick={()=>this.addPointClick()}>Add point</button>
                        <button className='btn draw-border' style={{display:'inline-block',margin:'10px'}} onClick={()=>this.upload()}>Submit</button>
                    </div>
                </div>
                <div style={{borderRadius:'10px',minHeight:'350px',padding:'3px',margin:'15px',backgroundColor:'rgba(255,255,255,0.5)',border:'1px solid #2c3e50',padding:'20px'}}>
                        <h2>Instructions</h2>
                        <hr/>
                        <ol>
                            <p>1. Move map to beginning of route</p>
                            <p>2. Press add point to lock position</p>
                            <p>3. Mark your route with multiple points</p>
                            <p>4. Check everything is correct and press submit</p>
                        </ol>
                    </div>
            </div>
        )
    }
}

export default withRouter(AddRide);
