import React,{Component} from 'react';
import Ride from '../Components/Ride';
import firebase from 'firebase'
import './Contribute.css'

class RideList extends Component{

    constructor(props){
        super(props);
        this.listRef = React.createRef();
    }

    state={
        rides: [{
            user:{
                photo: '',
                name: '',
                uid: ''
            },
            likes: 0,
            likers: [],
            time: '',
            line: [{lng:22.01,lat:41.01}],
            when: 0
        }],
        lastDoc: {}
    }
    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (prevState.rides.length < this.state.rides.length) {
          const list = this.listRef.current;
          return list.scrollTop;
        }
        return null;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot !== null) {
          const list = this.listRef.current;
          list.scrollTop = snapshot;
          console.log(list.scrollTop)
        }
    }

    componentDidMount(){
        if(!this.props.uid){
            const db = firebase.firestore();
            db.collection('posts').orderBy('when','desc').limit(5).get().then(res=>{
                const data = []
                res.docs.map(doc=>{
                    data.push({...doc.data(),id: doc.id})
                })
                this.setState({rides: data, lastDoc: res.docs[res.docs.length-1]})
            }).catch(er=>{
                console.log(er)
            })
        }else{
            const db = firebase.firestore();
            const posts = [];
            db.collection('users').doc(this.props.uid).get().then(async res=>{
                const data = res.data();
                const promises = data.posts.map(el=>{
                    return db.collection('posts').doc(el).get()
                });
                Promise.all(promises).then(result=>{
                    this.setState({rides: result.map(elem=>{return {...elem.data(),id:elem.id}}).reverse()})
                })
            }).catch(er=>{
                console.log(er)
            })
        }
    }

    loadMore = ()=>{
        const rides = [...this.state.rides];
        const db = firebase.firestore();
        db.collection('posts').orderBy('when','desc').startAfter(this.state.lastDoc).limit(5).get().then(res=>{
                res.docs.map(doc=>{
                    rides.push({...doc.data(),id: doc.id})
                })
                this.setState({rides: rides, lastDoc: res.docs[res.docs.length-1]})
        })
    }

    render(){
        if(!this.props.noOver){
            return(
                <div style={{textAlign:'start',height:'520px',overflow:'auto'}} ref={this.listRef}>
                    {this.state.rides.map((el,index)=>{
                            return(
                                <div>
                                    {el.when ? <Ride key={el.when} {...el} user={this.props.user}/>:''}
                                </div>
                            )
                    })}
                    {(this.props.uid) ? '':(this.state.rides.length%5===0?<button style={{textAlign: 'center',margin:'auto',marginTop:'50px'}} className='btn draw-border' onClick={()=>this.loadMore()}>Show More</button>:'')}
                </div>
            )
        }else{
            return(
                <div style={{textAlign:'start'}} ref={this.listRef}>
                    {this.state.rides.map((el,index)=>{
                            return(
                                <div>
                                    {el.when ? <Ride key={el.when} {...el} user={this.props.user}/>:''}
                                </div>
                            )
                    })}
                    {(this.props.uid) ? '':(this.state.rides.length%5===0?<button style={{textAlign: 'center',margin:'auto',marginTop:'50px'}} className='btn draw-border' onClick={()=>this.loadMore()}>Show More</button>:'')}
                </div>
            )
        }
    }
}

export default RideList;
