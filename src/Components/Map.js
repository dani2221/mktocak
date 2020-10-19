import React, { Component } from 'react';
import mapboxgl, { Marker } from 'mapbox-gl'
import './site.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as turf from '@turf/turf'
import firebase from 'firebase'
import parkIcon from '../pins/parkIcon.png'
import serviceIcon from '../pins/serviceIcon.png'
import shopIcon from '../pins/shopIcon.png'
import gpark from '../pins/gpark.png'
import gservice from '../pins/gservice.png'
import gshop from '../pins/gshop.png'
import {withRouter} from 'react-router-dom'
import withRouterAndRef from '../HOC/withRouterAndRef'

class Map extends Component{
    constructor(props) {
        super(props);
        this.map = React.createRef();
        this.mainMarker = React.createRef();
        this.placeMarkers = React.createRef();
    }
    state={
        markers: [],
        places: [],
        bikeLanes: []
    }
    requestFullScreen = ()=>{
        const container = this.map.getContainer();
        const rfs =
        container.requestFullscreen ||
        container.webkitRequestFullScreen ||
        container.mozRequestFullScreen ||
        container.msRequestFullscreen;

        rfs.call(container);
    }

    componentDidMount() {
        mapboxgl.accessToken=mapboxgl.accessToken = 'id';
        this.map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [55.8596,-4.2503],
        zoom: 12
        });
        if(!this.props.cancelDefault){
            this.displayDefaultMap()
        }
        this.map.on('load', () =>{
            this.map.resize();
            // this.map.addControl(new mapboxgl.FullscreenControl());
            this.map.addSource("route", {
                "type": "geojson",
                "data": {
                "type": "Feature",
                "properties": {},
                "geometry": {
                "type": "LineString",
                "coordinates": [
                    [0,0],
                    [0,0]
                ]
                }
            }});
            this.map.addLayer({
                "id": "route",
                "type": "line",
                "source": "route",
                "layout": {
                "line-join": "round",
                "line-cap": "round"
                },
                "paint": {
                "line-color": '#121212',
                "line-width": 4
                }
            });
        });
        this.map.on('exitFullscreen', function(){
            this.props.exitFull();
        });
        this.placeMarkers = [];
            this.mainMarker = new mapboxgl.Marker({container: this.mapMarker})
            .setLngLat([21.43141,41.99646])
            .addTo(this.map);
            this.map.on('move', (e) =>{
                console.log(`Current Map Center: ${this.map.getCenter()}`);
                this.mainMarker.setLngLat(this.map.getCenter());
            });
    };

    displayDefaultMap = ()=>{
        const db = firebase.firestore();
        let bikeLanes = null;
        let places = null
        db.collection('mainMap').get().then(res=>{
            bikeLanes = res.docs;
        }).then(()=>{
            db.collection('mainPlaces').get().then(result=>{
                places = result.docs;
                this.setState({bikeLanes: bikeLanes,places: places},this.addPlacesAndRides);

            }).catch(err=>{this.props.history.push('/error')})
        }).catch(err=>{this.props.history.push('/error')})
    }
    addPlaces = ()=>{
        const mrks = [...this.placeMarkers]
        this.state.places.map(el=>{
            const data = el.data();
            if(data.placeType==1 && !this.props.dontPark){
                var sel = document.createElement("img");
                sel.src=parkIcon;
                const marker = new mapboxgl.Marker({element: sel})
                .setLngLat([data.point[0].lng,data.point[0].lat])
                .addTo(this.map)

                mrks.push(marker);

            }
            if(data.placeType==2 && !this.props.dontService){
                const popup = new mapboxgl.Popup({ offset: 25 }).setText(data.placeName);

                var sel = document.createElement("img");
                sel.src=serviceIcon;
                const marker = new mapboxgl.Marker({element: sel})
                .setLngLat([data.point[0].lng,data.point[0].lat])
                .setPopup(popup)
                .addTo(this.map)

                mrks.push(marker);
            }
            if(data.placeType==3 && !this.props.dontShop){
                const popup = new mapboxgl.Popup({ offset: 25 }).setText(data.placeName);
                var sel = document.createElement("img");
                sel.src=shopIcon;
                const marker = new mapboxgl.Marker({element: sel})
                .setLngLat([data.point[0].lng,data.point[0].lat])
                .setPopup(popup)
                .addTo(this.map)

                mrks.push(marker);
            }
        })
        this.placeMarkers = mrks;
    }
    addPlacesAndRides = ()=>{
        this.addPlaces();
        this.addBikeLanes();
    }
    addBikeLanes = ()=>{
        if(!this.props.place){
            const bike1 = [];
            const bike2 = [];
            const bike3 = [];
            this.state.bikeLanes.map(el=>{
                const data = el.data();
                const destructuredPoints = [];
                data.points.map(e=>{
                    destructuredPoints.push([e.lng,e.lat]);
                })
                if(data.pathState==1){
                    bike1.push(destructuredPoints);
                }if(data.pathState==2){
                    bike2.push(destructuredPoints);
                }if(data.pathState==3){
                    bike3.push(destructuredPoints);
                }
            })
            const turf1 = turf.multiLineString(bike1);
            const turf2 =turf.multiLineString(bike2);
            const turf3 =turf.multiLineString(bike3);

            this.map.addLayer({
                "id": "new",
                "type": "line",
                "source": {"type": "geojson","data":turf1},
                "layout": {
                "line-join": "round",
                "line-cap": "round"
                },
                "paint": {
                "line-color": '#98FB98',
                "line-width": 4
                }
            });
            this.map.addLayer({
                "id": "good",
                "type": "line",
                "source": {"type": "geojson","data":turf2},
                "layout": {
                "line-join": "round",
                "line-cap": "round"
                },
                "paint": {
                "line-color": '#FCD12A',
                "line-width": 4
                }
            });
            this.map.addLayer({
                "id": "bad",
                "type": "line",
                "source": {"type": "geojson","data":turf3},
                "layout": {
                "line-join": "round",
                "line-cap": "round"
                },
                "paint": {
                "line-color": '#B80F0A',
                "line-width": 4
                }
            });
        }else{
            const bike1 = [];
            const bike2 = [];
            const bike3 = [];
            const bike4 = [];
            this.state.bikeLanes.map(el=>{
                const data = el.data();
                const destructuredPoints = [];
                data.points.map(e=>{
                    destructuredPoints.push([e.lng,e.lat]);
                })
                if(data.pathPlace==1){
                    bike1.push(destructuredPoints);
                }if(data.pathPlace==2){
                    bike2.push(destructuredPoints);
                }if(data.pathPlace==3){
                    bike3.push(destructuredPoints);
                }if(data.pathPlace==4){
                    bike4.push(destructuredPoints);
                }
            })
            const turf1 = turf.multiLineString(bike1);
            const turf2 =turf.multiLineString(bike2);
            const turf3 =turf.multiLineString(bike3);
            const turf4 =turf.multiLineString(bike4);

            this.map.addLayer({
                "id": "new",
                "type": "line",
                "source": {"type": "geojson","data":turf1},
                "layout": {
                "line-join": "round",
                "line-cap": "round"
                },
                "paint": {
                "line-color": '#CC8899',
                "line-width": 4
                }
            });
            this.map.addLayer({
                "id": "good",
                "type": "line",
                "source": {"type": "geojson","data":turf2},
                "layout": {
                "line-join": "round",
                "line-cap": "round"
                },
                "paint": {
                "line-color": '#009696',
                "line-width": 4
                }
            });
            this.map.addLayer({
                "id": "bad",
                "type": "line",
                "source": {"type": "geojson","data":turf3},
                "layout": {
                "line-join": "round",
                "line-cap": "round"
                },
                "paint": {
                "line-color": '#98BF64',
                "line-width": 4
                }
            });
            this.map.addLayer({
                "id": "awful",
                "type": "line",
                "source": {"type": "geojson","data":turf4},
                "layout": {
                "line-join": "round",
                "line-cap": "round"
                },
                "paint": {
                "line-color": '#893101',
                "line-width": 4
                }
            });
        }
    }
    componentDidUpdate(){
        if(this.props.fullScreen){
            this.requestFullScreen()
        }
        try{
        this.map.removeLayer('new');
        this.map.removeSource('new');
        }catch(err){}
        try{
        this.map.removeLayer('good');
        this.map.removeSource('good');
        }catch(err){}
        try{
        this.map.removeLayer('bad');
        this.map.removeSource('bad');
        }catch(err){}
        try{
        this.map.removeLayer('awful');
        this.map.removeSource('awful');
        }catch(err){}
        this.placeMarkers.map(el=>{
            try{
                el.remove();
            }catch(err){
                console.log(err)
            }
        })
        this.placeMarkers= [];
        if(!this.props.cancelDefault){
            this.addPlacesAndRides();
        }
        if(!this.props.canAddPoint){
            this.mainMarker.remove();
        }
        if(this.props.points.length>1){
            const edditedCords = [];
            this.props.points.map(el=>{
                const cordPair = [el.lng,el.lat];
                edditedCords.push(cordPair);
            })
            const lineString = turf.lineString(edditedCords);
            this.map.getSource('route').setData(lineString)
        }
    }
    startOver = ()=>{
        const lineString = turf.lineString([[0,0],[0,0]]);
        this.map.getSource('route').setData(lineString);
        this.state.markers.map(el=>{
            el.remove();
        })
        this.props.updatePoints({points: []});
        if(!this.mainMarker._scale){
            this.mainMarker = new mapboxgl.Marker({container: this.mapMarker})
                .setLngLat(this.map.getCenter())
                .addTo(this.map);
                this.map.on('move', (e) =>{
                    console.log(`Current Map Center: ${this.map.getCenter()}`);
                    this.mainMarker.setLngLat(this.map.getCenter());
                });
        }
    }

    addPoint = () =>{
        const marker = new mapboxgl.Marker()
            .setLngLat(this.map.getCenter())
            .addTo(this.map);
        const coords = [...this.props.points];
        coords.push(this.map.getCenter())
        this.props.updatePoints({points: coords})
        const allMarkers = [...this.state.markers]
        allMarkers.push(marker);
        this.setState({markers: allMarkers})
    }

    render(){
        let img1 = parkIcon;
        let img2 = shopIcon;
        let img3 = serviceIcon
        if(this.props.dontPark){
            img1 = gpark
        }
        if(this.props.dontShop){
            img2 = gshop
        }
        if(this.props.dontService){
            img3 = gservice
        }

        let legend;
        if(this.props.stateClick){
            legend=(
                <div style={{display:'inline-block',verticalAlign:'top',margin:'5px'}}>
                    <label className='container' style={{cursor:'default'}}>
                        <span style={{width:'10px',height:'10px',borderRadius: '50%',display:'inline-block',backgroundColor:'#98FB98',marginRight:'10px'}}/>
                        New Path
                    </label>
                    <label className='container' style={{cursor:'default'}}>
                        <span style={{width:'10px',height:'10px',borderRadius: '50%',display:'inline-block',backgroundColor:'#FCD12A',marginRight:'10px'}}/>
                        Path Condition - Good
                    </label>
                    <label className='container' style={{cursor:'default'}}>
                        <span style={{width:'10px',height:'10px',borderRadius: '50%',display:'inline-block',backgroundColor:'#B80F0A',marginRight:'10px'}}/>
                        Path Condition - Poor
                    </label>
                </div>
            )
        }else{
            legend=(
                <div style={{display:'inline-block',verticalAlign:'top',margin:'5px'}}>
                    <label className='container' style={{cursor:'default'}}>
                        <span style={{width:'10px',height:'10px',borderRadius: '50%',display:'inline-block',backgroundColor:'#CC8899',marginRight:'10px'}}/>
                        On Road
                    </label>
                    <label className='container' style={{cursor:'default'}}>
                        <span style={{width:'10px',height:'10px',borderRadius: '50%',display:'inline-block',backgroundColor:'#009696',marginRight:'10px'}}/>
                        Pavement - Separate from Pedestrians
                    </label>
                    <label className='container' style={{cursor:'default'}}>
                        <span style={{width:'10px',height:'10px',borderRadius: '50%',display:'inline-block',backgroundColor:'#98BF64',marginRight:'10px'}}/>
                        Pavement - With Pedestrians
                    </label>
                    <label className='container' style={{cursor:'default'}}>
                        <span style={{width:'10px',height:'10px',borderRadius: '50%',display:'inline-block',backgroundColor:'#893101',marginRight:'10px'}}/>
                        Completely Separate/Offroad
                    </label>
                </div>
            )

        }

        let fullScreen;
        if(this.props.fullScreen){
            fullScreen = (
            <div className='legend'>
                <div style={{borderRadius:'10px',height:'fit-content',padding:'20px',margin:'10px',backgroundColor:'rgba(255,255,255,0.1)',border:'1px solid white'}}>
                        <label className='container'>Path Condition
                            <input type='checkbox' checked={this.props.stateClick} onChange={()=>this.props.changeStatePlace()}/>
                            <span className='checkmark'></span>
                        </label>
                        <label className='container'>Path Location
                            <input type='checkbox' checked={!this.props.stateClick} onChange={()=>this.props.changeStatePlace()}/>
                            <span className='checkmark'></span>
                        </label>
                </div>
                <div style={{display:'block'}}>
                        {legend}
                        <div style={{display:'inline-block'}}>
                            <label className='container' onClick={()=>this.props.cngPark()}>
                                <img style={{width:'30px',verticalAlign:'middle'}} src={img1} alt='Please reload the browser'/>
                                <span style={{margin:'10px'}}></span>
                                Bicycle Parking
                            </label>
                            <label className='container' onClick={()=>this.props.cngShop()}>
                                <img style={{width:'30px',verticalAlign:'middle'}} src={img2} alt='Please reload the browser'/>
                                <span style={{margin:'10px'}}></span>
                                    Shops
                            </label>
                            <label className='container' onClick={()=>this.props.cngService()}>
                                <img style={{width:'30px',verticalAlign:'middle'}} src={img3} alt='Please reload the browser'/>
                                <span style={{margin:'10px'}}></span>
                                    Service
                            </label>
                        </div>
                </div>
            </div>)
        }
    if(!this.props.smol){
        return(
            <div className='mapDiv'>
                <div ref={el => this.mapContainer = el} className="mapContainer">
                    {fullScreen}
                </div>
            </div>
    )}else{
        return(
            <div className='mapDiv' style={{width:'100%',height: '300px'}}>
                <div ref={el => this.mapContainer = el} className="mapContainer">
                    {fullScreen}
                </div>
            </div>
            )
    }
}

}

export default withRouterAndRef(Map);
