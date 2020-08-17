import React from 'react'
import LikeeButton from '../pins/likebutton.png'
import LikedButton from '../pins/likedbutton.png'

const LikeButton = props =>{
    if(props.liked){
        return(
            <img style={{width:'50px',height:'30px',cursor:'pointer',display:'inline-block',verticalAlign:'middle'}} src={LikedButton} onClick={()=>props.changeLike(false)}/>
        )
    }else{
        return(
            <img style={{width:'50px',height:'30px',cursor:'pointer',display:'inline-block',verticalAlign:'middle'}} src={LikeeButton} onClick={()=>props.changeLike(true)}/>
        )
    }
}
export default LikeButton;