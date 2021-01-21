import React, { Component } from 'react';
import mapboxgl, { Marker } from 'mapbox-gl'
import './site.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as turf from '@turf/turf'
import firebase from 'firebase'
import { withRouter } from 'react-router-dom';

class ModMap extends Component{
    constructor(props) {
        super(props);
        this.map = React.createRef();
    }
    state={
        markers: [],
        data: ''
    }

    componentDidMount() {
        mapboxgl.accessToken=mapboxgl.accessToken = 'id';
        this.map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [21.43141,41.99646],
        zoom: 12
        });
        this.displayDefaultMap()
        this.map.on('load', () =>{
            this.map.resize();
        });
    };

    displayDefaultMap = ()=>{
        const id = this.props.match.params.id
        const line = this.props.match.params.line
        let bikeLanes = null;
        let places = null
        const db = firebase.firestore();
        if(line==0){
            db.collection('modMap').get().then(res=>{
                bikeLanes = res.docs;
                    const data = bikeLanes[id].data();
                    const destructuredPoints = [];
                    data.points.map(e=>{
                        destructuredPoints.push([e.lng,e.lat]);
                    })
                const turf1 = turf.lineString(destructuredPoints);
                this.map.addLayer({
                    "id": "new",
                    "type": "line",
                    "source": {"type": "geojson","data":turf1},
                    "layout": {
                    "line-join": "round",
                    "line-cap": "round"
                    },
                    "paint": {
                    "line-color": '#FF00FF',
                    "line-width": 4
                    }
                });
                this.setState({data: bikeLanes[id]})
            })
        }else{
            db.collection('modPlaces').get().then(result=>{
                places = result.docs;
                const data = places[id].data();
                const marker = new mapboxgl.Marker()
                .setLngLat([data.point[0].lng,data.point[0].lat])
                .addTo(this.map)
                this.setState({data: places[id]})
            })
        }
    }
    yes = ()=>{
        const db = firebase.firestore();
        if(this.props.match.params.line==0){
            db.collection('mainMap').add({...this.state.data.data()})
            db.collection('modMap').doc(this.state.data.id).delete()
            db.collection('users').doc(this.state.data.data().uid).update({veloPoints: firebase.firestore.FieldValue.increment(30)})
        }else{
            db.collection('mainPlaces').add({...this.state.data.data()})
            db.collection('modPlaces').doc(this.state.data.id).delete()
            db.collection('users').doc(this.state.data.data().uid).update({veloPoints: firebase.firestore.FieldValue.increment(10)})
        }
    }
    no = ()=>{
        const db = firebase.firestore();
        if(this.props.match.params.line==0){
            db.collection('modMap').doc(this.state.data.id).delete()
        }else{
            db.collection('modPlaces').doc(this.state.data.id).delete()
        }
    }

    render(){
    return(
        <div className='mapDiv'>
            <div ref={el => this.mapContainer = el} className="mapContainer">
            </div>
            {this.state.data ? <p>{JSON.stringify(this.state.data.data())}</p>:''}
            <button onClick={()=>this.yes()}>yes</button>
            <button onClick={()=>this.no()}>no</button>
        </div>
    )}

}

export default withRouter(ModMap);
