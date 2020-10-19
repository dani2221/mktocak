import React, { Component } from 'react';
import Map from '../Components/Map'
import './FullMap.css'
import parkIcon from '../pins/parkIcon.png'
import serviceIcon from '../pins/serviceIcon.png'
import shopIcon from '../pins/shopIcon.png'
import gpark from '../pins/gpark.png'
import gservice from '../pins/gservice.png'
import gshop from '../pins/gshop.png'

export default class FullMap extends Component{

    constructor(props) {
        super(props);
        this.child = React.createRef();
    }
    componentDidMount(){
        document.addEventListener('fullscreenchange', (event) => {
            if (document.fullscreenElement) {
              console.log(`Element: ${document.fullscreenElement.id} entered full-screen mode.`);
            } else {
                this.setState({fullScreen: false})
            }
          });
    }

    state={
        state:true,
        place: false,
        shop:false,
        service:false,
        park: false
    }
    fullScreen = ()=>{
        //this.child.current.requestFullScreen();
        this.setState({fullScreen: true})
    }
    stateClicked = ()=>{
        this.setState({state: !this.state.state,place: !this.state.place})
    }
    exitFull = ()=>{
        this.setState({fullScreen: false})
    }
    park = ()=>{
        this.setState({park: !this.state.park})
    }
    shop = ()=>{
        this.setState({shop: !this.state.shop})
    }
    service = ()=>{
        this.setState({service: !this.state.service})
    }


    render(){
        let img1 = parkIcon;
        let img2 = shopIcon;
        let img3 = serviceIcon
        if(this.state.park){
            img1 = gpark
        }
        if(this.state.shop){
            img2 = gshop
        }
        if(this.state.service){
            img3 = gservice
        }

        let legend;
        if(this.state.state){
            legend=(
                <div style={{display:'inline-block',verticalAlign:'top',margin:'5px'}}>
                    <label className='container' style={{cursor:'default'}}>
                        <span style={{width:'10px',height:'10px',borderRadius: '50%',display:'inline-block',backgroundColor:'#98FB98',marginRight:'10px'}}/>
                        New Path
                    </label>
                    <label className='container' style={{cursor:'default'}}>
                        <span style={{width:'10px',height:'10px',borderRadius: '50%',display:'inline-block',backgroundColor:'#FCD12A',marginRight:'10px'}}/>
                        Good Path Condition
                    </label>
                    <label className='container' style={{cursor:'default'}}>
                        <span style={{width:'10px',height:'10px',borderRadius: '50%',display:'inline-block',backgroundColor:'#B80F0A',marginRight:'10px'}}/>
                        Poor Path Condition
                    </label>
                </div>
            )
        }else{
            legend=(
                <div style={{display:'inline-block',verticalAlign:'top',margin:'5px'}}>
                    <label className='container' style={{cursor:'default'}}>
                        <span style={{width:'10px',height:'10px',borderRadius: '50%',display:'inline-block',backgroundColor:'#CC8899',marginRight:'10px'}}/>
                        Path on Road
                    </label>
                    <label className='container' style={{cursor:'default'}}>
                        <span style={{width:'10px',height:'10px',borderRadius: '50%',display:'inline-block',backgroundColor:'#009696',marginRight:'10px'}}/>
                        Path on Pavement - Separated from Pedestrians
                    </label>
                    <label className='container' style={{cursor:'default'}}>
                        <span style={{width:'10px',height:'10px',borderRadius: '50%',display:'inline-block',backgroundColor:'#98BF64',marginRight:'10px'}}/>
                        Pavement with Pedestrians
                    </label>
                    <label className='container' style={{cursor:'default'}}>
                        <span style={{width:'10px',height:'10px',borderRadius: '50%',display:'inline-block',backgroundColor:'#893101',marginRight:'10px'}}/>
                        Completely Separate/Offroad
                    </label>
                </div>
            )

        }

        return(
            <div>
                <div style={{height:'fit-content',padding:'25px',backgroundColor:'#2c3e40',color:'white'}}>
                    <div style={{display:'inline-block'}}>
                        <Map ref={this.child} canAddPoint={false} points={[]} place={this.state.place} dontShop={this.state.shop} dontPark={this.state.park} dontService={this.state.service} cngPark={this.park} cngService={this.service} cngShop={this.shop} changeStatePlace={this.stateClicked} stateClick={this.state.state} fullScreen={this.state.fullScreen} exitFull={this.exitFull}/>
                        <a href='/contribute' style={{color:'whitesmoke',textAlign:'center',display:'block'}}>Do you know paths or places that are not on the map?</a>
                    </div>
                    <div style={{display:'inline-block',verticalAlign:'top',margin:'30px',marginBottom:'0px'}}>
                        <div style={{borderRadius:'10px',height:'fit-content',padding:'20px',margin:'10px',backgroundColor:'rgba(255,255,255,0.1)',border:'1px solid white'}}>
                            <label className='container'>Bike Path Condition
                                <input type='checkbox' checked={this.state.state} onChange={()=>this.setState({state: !this.state.state,place: !this.state.place})}/>
                                <span className='checkmark'></span>
                            </label>
                            <label className='container'>Bike Path Location
                                <input type='checkbox' checked={this.state.place} onChange={()=>this.setState({state: !this.state.state,place: !this.state.place})}/>
                                <span className='checkmark'></span>
                            </label>
                        </div>
                        <div style={{display:'block'}}>
                            {legend}
                            <div style={{display:'inline-block'}}>
                                <label className='container' onClick={()=>this.setState({park: !this.state.park})}>
                                    <img style={{width:'30px',verticalAlign:'middle'}} src={img1} alt='Please reload the browser'/>
                                    <span style={{margin:'10px'}}></span>
                                    Bicicle Parking
                                </label>
                                <label className='container' onClick={()=>this.setState({shop: !this.state.shop})}>
                                    <img style={{width:'30px',verticalAlign:'middle'}} src={img2} alt='Please reload the browser'/>
                                    <span style={{margin:'10px'}}></span>
                                        Stores
                                </label>
                                <label className='container' onClick={()=>this.setState({service: !this.state.service})}>
                                    <img style={{width:'30px',verticalAlign:'middle'}} src={img3} alt='Please reload the browser'/>
                                    <span style={{margin:'10px'}}></span>
                                        Service
                                </label>
                            </div>
                        </div>
                        <button className='btn draw-border' style={{color:'white',boxShadow:'inset 0 0 0 4px white',width:'140px',fontSize:'13px',margin:'auto',marginTop:'30px',marginBottom:'20px'}} onClick={()=>this.fullScreen()}>Full-Screen</button>
                        <p style={{display:'block',fontSize:'9px',textAlign:'center'}}>Full-Screen is not supported on mobile</p>
                    </div>
                </div>
            </div>
        )
    }
}
