
import "./App.scss"
import React,{ useState,useEffect, Fragment } from 'react';
import NumberDisplay from "../NumberDisplay"
import {generateCells,openMultipleCells} from "../../utils"
import {Button} from '../Button/index'
import {CellType ,Face, CellState, CellValue} from '../../types'
import { MAX_ROWS,MAX_COLS } from "../../constants";
const App: React.FC= ()=> {   // React.FC tells in ts that it uis a functional component
    
    const [cells,setCells]=useState<CellType[][]>(generateCells);
    const [face,setFace]=useState<Face>(Face.smile);
    const [time,setTime]=useState<number>(0);
    const [live,setLive]=useState<boolean>(false);
    const [bombCounter,setBomb] = useState<number>(10)
    const [hasLost,setHasLost] = useState<boolean>(false)
    const [hasWon,setHasWon] = useState<boolean>(false)


    // console.log(cells)
   function  handleMouseDown() {
       if(!hasLost)
    setFace(Face.oh);
    }
    function  handleMouseUp() {
        if(!hasLost)
        setFace(Face.smile)
        }
    // useEffect(()=>{
    //     const handleMouseDown = () =>{
    //         setFace(Face.oh)
    //     }
    //     const handleMouseUp = () =>{
    //         setFace(Face.smile)
    //     }

    //     document.getElementById('Body')?.addEventListener('mousedown',handleMouseDown);
    //     document.getElementById('Body')?.addEventListener('mouseup',handleMouseUp);
        
    //     // window.addEventListener('mousedown',handleMouseDown);
    //     // window.addEventListener('mouseup',handleMouseUp)
    //     // return ()=>{
    //     //     r1;
    //     //     r;
    //     // // window.removeEventListener('mousedown',handleMouseDown);
    //     // // window.removeEventListener('mouseup',handleMouseUp)
    //     // }
    // },[])



    useEffect(()=>{
        if(live && time<999){
            const timer  = setInterval(()=>{setTime(time+1)},1000);
            return ()=>clearInterval(timer)
        }
    },[live,time])  //useeffect keeps the tract of live and time both about their previous value
    
    useEffect(()=>{
        if(hasLost){
            setFace(Face.lost)
            setLive(false)
            

        }
    },[hasLost])
    
    

    useEffect(()=>{
        if(hasWon){
            setLive(false);
            setFace(Face.won)
        }
    },[hasWon])
    const handleCellClick = (rowParam:number,colParam:number)  => ():void=>{
        // console.log(rowParam,colParam)
        //start game
        // console.log(live)
        let newCells = cells.slice();
        if(hasLost)
            return;
        if(!live){
                let isABomb = newCells[rowParam][colParam].value === CellValue.bomb;
                while(isABomb){
                    newCells = generateCells();
                    if(newCells[rowParam][colParam].value !== CellValue.bomb){
                        isABomb = false;
                        break;
                    }
                }
            
        
            setLive(true)
        }
        const currentCell = cells[rowParam][colParam];
        
        if([CellState.flagged, CellState.visible].includes(currentCell.state))
            return;

            // currentCell.state ===CellState.flagged  ||
            //  currentCell.state === CellState.visible)
        if(currentCell.value === CellValue.bomb){
            
            setHasLost(true)
            newCells[rowParam][colParam].red=true;
            newCells=showAllBombs();
            setCells(newCells)
            return ;

        }
        else if(currentCell.value === CellValue.none){
             newCells = openMultipleCells (newCells,rowParam,colParam)
            
            }
        else{
            newCells[rowParam][colParam].state=CellState.visible;
            
        }
        //check to see if u have won
        let safeOpenCellsExists = false;
        for(let row=0;row<MAX_ROWS;row++){
            for(let col=0;col<MAX_COLS;col++){
                const currentCell=newCells[row][col];
                if(currentCell.value !== CellValue.bomb && currentCell.state === CellState.open){
                    safeOpenCellsExists = true;
                    break;
                }
            }
        }
        if(!safeOpenCellsExists){
            newCells = newCells.map(row => row.map(cell=>{
                if(cell.value === CellValue.bomb){
                    return {
                        ...cell,
                        state:CellState.flagged
                    }
                }
                return cell;
            }))
            setHasWon(true);
        }
        setCells(newCells);
    }
   
   
   
   
    const renderCells = ():React.ReactNode =>{
        return cells.map((row,rowIndex)=>row.map((cell,colIndex)=><Button key={colIndex} state={cell.state}  value={cell.value } red={cell.red} onClick={handleCellClick} onContext= {handleContext} row={rowIndex} col={colIndex}/>))
    } 


    const handleFaceClick = ():void =>{
        
            setLive(false);
            setTime(0);
            setCells(generateCells());
            setBomb(10);
            setHasLost(false);
            setHasWon(false)
        
    }


    const handleContext = (rowParam:number,colParam:number)  => (e:React.MouseEvent<HTMLDivElement,MouseEvent>):void=>{
        // console.log(rowParam,colParam)
        //start game
        e.preventDefault();
        if(!live) return;
        console.log("we are in conext")
        const currentCells = cells.slice();

        const currentCell = cells[rowParam][colParam];
        if(currentCell.state ===CellState.visible){
            return;
        }
        else if(currentCell.state ===CellState.open){
            currentCells[rowParam][colParam].state=CellState.flagged;
            setCells(currentCells);
            setBomb(bombCounter-1);
        }
        else if(currentCell.state === CellState.flagged){
            currentCells[rowParam][colParam].state=CellState.open;
            setCells(currentCells);
            setBomb(bombCounter+1)

        }
 
    }
    const showAllBombs = ():CellType[][] =>{
        const currentCells =cells.slice();
        return currentCells.map((row)=>row.map((cell)=>{
            if(cell.value === CellValue.bomb ){
                return {...cell,
                state:CellState.visible}
            }
            return cell;
        }))
    }
    const r1="YOU LOST";
    return (
       
        <div className="App">
            {hasLost?<Fragment>YOU LOST</Fragment>:''}
            <div className="Header">
                <NumberDisplay value={bombCounter}/>
                <div className="Face" onClick={handleFaceClick}>
                <span>{face}</span>
                </div>
                <NumberDisplay value={time}/>
            </div>
            <div className="Body" onMouseDown = {handleMouseDown} onMouseUp = {handleMouseUp}>
                {renderCells()}</div>
            
        </div>
    );
}

export default App;