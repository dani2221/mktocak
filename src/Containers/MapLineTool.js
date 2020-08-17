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
        this.setState({popup: 'Успешно пратено. Ве молиме почекајте до 24 часа за оваа патека да биде валидирана. Докулку таа се потврди добивате 30 вело-поени. До тогаш додавајте други патеки!'})
        }).catch((error)=>{
            console.log(error);
            this.setState({popup: 'Хмм, имаше проблем. Ве молиме пробајте повторно подоцна!'})
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
            this.setState({popup: 'Ве молиме внесете состојба на патеката'});
            return false;
        }
        if(this.state.pathPlace==0){
            this.setState({popup: 'Ве молиме внесете положба на патеката'});
            return false;
        }
        if(this.state.points.length<2){
            this.setState({popup: 'Инвалидна патека - Ве молиме внесете барем две точки кои претставуваат валидна патека. Прочитајте го упатството за повеќе информации'});
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
                        <p style={{textAlign:'center',fontSize:'10px'}}><i>Кликнете надвор од ова прозорче за да го изгасите</i></p>
                    </div>
                </Popup>
                <div style={{borderRadius:'10px',height:'fit-content',padding:'3px',margin:'15px',backgroundColor:'rgba(255,255,255,0.5)',border:'1px solid #2c3e50'}}>
                    <Map points={this.state.points} updatePoints={points=>this.updatePoints(points)} canAddPoint={true} ref={this.child}/>
                    <div style={{display:'inline-block',verticalAlign:'top'}}>
                    <h4 style={{maxWidth:'500px',marginLeft:'20px'}}>Ве молиме да ги прочитате упатството и правилата на крајот од странава пред да почнете</h4>
                        <div className='select'>
                            <select value={this.state.pathState} onChange={(ev)=>this.updatePathState(ev)}>
                                <option value={0}>Избери состојба на патеката</option>
                                <option value={1}>Нова/Како нова</option>
                                <option value={2}>Добра</option>
                                <option value={3}>Лоша</option>
                            </select>
                        </div>
                    <div className='select'>
                        <select value={this.state.pathPlace} onChange={(ev)=>this.updatePathPlace(ev)}>
                            <option value={0}>Избери положба на патеката</option>
                            <option value={1}>На коловоз одвоена од возила</option>
                            <option value={2}>На тротоар одвоена од пешаци</option>
                            <option value={3}>На тротоар заедно со пешаци</option>
                            <option value={4}>Специална(сосема одвоена/offroad)</option>
                        </select>
                    </div>
                    <button style={{display:'inline-block',width:'fit-content',height:'35px',margin:'20px',fontSize:'15px',fontWeight:'100',padding:'10px'}} className='btn draw-border' onClick={()=>this.addPointClick()}>Додади точка</button>
                    <button style={{display:'inline-block',width:'fit-content',height:'35px',margin:'20px',fontSize:'15px',fontWeight:'100',padding:'10px'}} className='btn draw-border' onClick={()=>this.uploadPoints()}>Прати!</button>
                    <button style={{display:'inline-block',width:'fit-content',height:'35px',margin:'20px',fontSize:'15px',fontWeight:'100',padding:'10px'}} className='btn draw-border' onClick={()=>this.startOver()}>Почни одново</button>
                </div>
                </div>
                <div style={{borderRadius:'10px',height:'fit-content',padding:'30px',margin:'30px',backgroundColor:'rgba(255,255,255,0.5)',border:'1px solid #2c3e50'}}>
                    <h2>Упатство</h2>
                    <hr/>
                    <ol>
                        <p>1. Движи ја мапата до почетокот на патеката</p>
                        <p>2. Притисни 'Додади точка' за заклучување на таа позиција</p>
                        <p>3. Движи ја мапата до следната кривина или раскрсница и притисни 'Додади точка'</p>
                        <p>4. Продожи така до крајот на патеката</p>
                        <p>5. Избери состојба на патот и положба</p>
                        <p>6. На крај провери дали се е точно и притисни 'Испрати!'</p>
                        <p>7. Додадената патека ќе биде проверена во 24 часа и ако биде одобрена ќе добиете 10 вело-поени</p>
                    </ol>
                    <h2>Правила </h2>
                    <hr/>
                    <h3>Ако некое од овие правила се прекрши, вашиот профил може да биде целосно избришан</h3>
                    <hr/>
                    <ul>
                        <p>Зумирај и биди прецизни со точките</p>
                        <p>Забрането е поставување лажни патеки</p>
                        <p>Провери дали твојата патека е веќе ставена на главната мапа</p>
                        <p>Не праќај иста патека повеќе од еднаш</p>
                    </ul>
                </div>
            </div>
        )
    }
}