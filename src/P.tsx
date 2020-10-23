import React,{useState, useEffect} from 'react';

function P() {
    const [time,setTime]=useState(0);
    const [live,setper]=useState(true);

//##############################
    //either put ()=> in setTime or puttime in array with setTime(time+1)
//############### RUNNING FUNCTION USEeFFECT AGAIN AND AGAIN
    useEffect(()=>{
        if(live){
            console.log("use")
            const timer=setInterval(()=>{setTime(time+1)},1000);
            return ()=>clearInterval(timer)
        }
    },[live,time]) 
//######################### RUNNING ONLY ONCE BUT KEEPING THE TRACT OF IT BUT WITHOUT ()=> IN SETTIME
     //it do not stops on button click
    // useEffect(()=>{
    //     if(live){
    //     console.log("effect")
    //     setInterval(()=>{setTime(prevtime=>prevtime+1)},1000)
    //     return ()=>clearInterval(time);  // this is equal to componentwillunmount
    //     } //removes memory leak;
    // },[live]
    // )
//####################### RUNNING ONCE BUT WITH ()=> IN SETTIME
    //it do not stops on button click

    // useEffect(()=>{
    //         if(live){
    //         console.log("effect")
    //         const timer=setInterval(()=>{setTime(time=>time+1)},1000)
    //         return ()=>clearInterval(timer);  // this is equal to componentwillunmount
    //         } //removes memory leak;
    //     },[live]
    //     )
   //############# causes problem
    //     useEffect(()=>{
    //     if(live){
    //     console.log("effect")
    //     setInterval(()=>{setTime(time=>time+1)},1000)
    //     return ()=>clearInterval(time);  // this is equal to componentwillunmount
    //     } //removes memory leak;
    // },[live]
    // )




    
    return (
        <div>
        {time}
        <button onClick={()=>setper(!live)}>false</button>
        
        </div>
    );
}

export default P;