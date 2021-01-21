import React from 'react'

const pointsInfo=()=>{
    return(
        <div style={{borderRadius:'10px',height:'fit-content',padding:'30px',margin:'30px',backgroundColor:'rgba(255,255,255,0.5)',border:'1px solid #2c3e50',textAlign:'center'}}>
        <h2>How do I collect cycle points?</h2>
        <hr/>
        <ol>
            <p>Each like on your published rides = 1 point</p>
            <p>Each accepted bike path = 30 points</p>
            <p>Each accepted place/service = 10 points</p>
        </ol>
        <h2>What can I do with cycle points?</h2>
        <hr/>
        <ul>
            <p>500 points - You can add to the map without verification</p>
            <p>1000 points - Become a moderator</p>
        </ul>
    </div>
    )
}

export default pointsInfo;
