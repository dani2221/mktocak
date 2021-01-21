import React, { Component } from 'react';
import MapLineTool from './MapLineTool';
import MapPointTool from './MapPointTool';
import './Contribute.css';

export default class Contribute extends Component{
    state = {
        option: ''
    }

    lineClicked = ()=>{
        this.setState({option: 'line'})
    }
    objectClicked = ()=>[
        this.setState({option: 'object'})
    ]



    render(){
        if(this.state.option==='line'){
            return <MapLineTool user={this.props.user}/>
        }else if(this.state.option==='object'){
            return <MapPointTool user={this.props.user}/>
        }else{
        return(
            <div className='middle'>
                <p><a className='btn draw-border' href='/contribute/map' style={{textDecoration:'none',textAlign:'center'}}>View Map</a></p>
                <button className='btn draw-border' onClick={()=>this.lineClicked()}>Add Bike Path</button>
                <button className='btn draw-border' onClick={()=>this.objectClicked()}>Add Facility (service, parking, etc)</button>
            </div>
        )
        }
    }
}
