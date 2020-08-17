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
            this.setState({popup: 'Успешно пратено. Ве молиме почекајте до 24 часа за оваа место да биде валидирано. Докулку истото се потврди добивате 10 вело-поени. До тогаш додавајте други места!'})
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
            this.setState({popup:'Ве молиме внесете тип на место'})
            return false;
        }
        if(this.state.point.length===0){
            this.setState({popup:'Ве молиме заклучете ја одбраната позиција со копчето \'Додади маркер\''});
            return false;
        }
        if(this.state.placeType==2 || this.state.placeType==3){
            if(this.state.placeName.length===0){
                this.setState({popup:'Ве молиме внесете име и контакт на овој сервис/продавница'});
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
                        <p style={{textAlign:'center',fontSize:'10px'}}><i>Кликнете надвор од ова прозорче за да го изгасите</i></p>
                    </div>
                </Popup>
                <div style={{borderRadius:'10px',height:'fit-content',padding:'3px',margin:'15px',backgroundColor:'rgba(255,255,255,0.5)',border:'1px solid #2c3e50'}}>
                    <Map points={this.state.point} updatePoints={points=>this.updatePoints(points)} canAddPoint={this.state.canAddPoint} ref={this.child}/>
                    <div style={{display:'inline-block',verticalAlign:'top'}}>
                        <h4 style={{maxWidth:'500px',marginLeft:'20px'}}>Ве молиме да ги прочитате упатството и правилата на крајот од странава пред да почнете</h4>
                        <div className='select'>
                            <select value={this.state.placetype} onChange={(ev)=>this.updatePathPlace(ev)}>
                                <option value={0}>Избери тип на место</option>
                                <option value={1}>Вело-паркинг</option>
                                <option value={2}>Сервис за велосипеди</option>
                                <option value={3}>Продавница за велосипеди</option>
                            </select>
                        </div>
                    {this.state.placeType>1 ? <input type='text' style={{margin:'20px'}} value={this.state.placeName} placeholder='Внеси име на сервис/продавница и контакт(телефон/вебсајт)' onChange={ev=>this.chPlaceName(ev)} />:''}
                    <button style={{display:'inline-block',width:'fit-content',height:'35px',margin:'20px',fontSize:'15px',fontWeight:'100',padding:'10px'}} className='btn draw-border' onClick={()=>this.addPointClick()}>Додади маркер</button>
                    <button style={{display:'inline-block',width:'fit-content',height:'35px',margin:'20px',fontSize:'15px',fontWeight:'100',padding:'10px'}} className='btn draw-border' onClick={()=>this.uploadPlace()}>Постирај!</button>
                    </div>
                </div>
                <div style={{borderRadius:'10px',height:'fit-content',padding:'30px',margin:'30px',backgroundColor:'rgba(255,255,255,0.5)',border:'1px solid #2c3e50'}}>
                    <h2>Упатство</h2>
                    <hr/>
                    <ol>
                        <p>1. Движи ја мапата до посакуваното место</p>
                        <p>2. Притисни 'Додади маркер' за заклучување на позицијата</p>
                        <p>3. Избери тип на маркер</p>
                        <p>4. Ако избереш сервис или продавница ќе треба да внесеш име и контакт за тоа место</p>
                        <p>5. Притисни 'Испрати' и почекај ова место да биде верифицирано.(24 часа). По тоа ќе биде ставено во главната мапа и ќе добиеш 10 вело-поени</p>
                    </ol>
                    <h2>Правила</h2>
                    <hr/>
                    <h3>Ако некое од овие правила се прекрши, вашиот профил може да биде целосно избришан</h3>
                    <hr/>
                    <ul>
                        <p>Забрането е поставување лажни места</p>
                        <p>Провери дали твоето место е веќе ставено на главната мапа</p>
                        <p>Не праќај исто место повеќе од еднаш</p>
                    </ul>
                </div>
            </div>
        )
    }
}