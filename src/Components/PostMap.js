import React, { Component } from 'react';
import mapboxgl, { Marker } from 'mapbox-gl'
import './site.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import * as turf from '@turf/turf'

class PostMap extends Component{
    constructor(props) {
        super(props);
        this.map = React.createRef();
    }
    componentDidMount() {
        try{
        mapboxgl.accessToken=mapboxgl.accessToken = '';
        this.map = new mapboxgl.Map({
        container: this.mapContainer,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [this.props.line[0].lng,this.props.line[0].lat],
        zoom: 12
        });
        this.map.on('load', () =>{
            this.map.resize();
            this.displayDefaultMap();
        });}catch(err){console.log(err)}
    }
    componentDidUpdate(prevProps){
        try{
        if(prevProps.line[0].lng!==this.props.line[0].lng){
            this.map.jumpTo({center: [this.props.line[0].lng,this.props.line[0].lat]})
            this.displayDefaultMap();
        }}catch(err){console.log(err)}
    }

    displayDefaultMap = ()=>{
        const data = this.props.line;
        const destructuredPoints = [];
        data.map(e=>{
            destructuredPoints.push([e.lng,e.lat]);
        })
        if(destructuredPoints.length<2){
            return;
        }
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
            })
    }
    render(){
    return(
        <div style={{maxWidth:'400px',height:'200px'}}>
            <div ref={el => this.mapContainer = el} className="mapContainer">
            </div>
        </div>
    )}

}

export default PostMap;
