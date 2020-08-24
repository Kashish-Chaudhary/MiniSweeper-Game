import React from 'react';
import "./Button.scss"
import { CellState, CellValue } from '../../types';
interface ButtonProps {
    row:number;
    col:number;
    state:CellState;
    value:CellValue;
    red?:boolean;
    onClick(rowParam:number,colParam:number): (...args:any[])=>void;
    onContext(rowParam:number,colParam:number): (...args:any[])=>void;

}
export const Button:React.FC<ButtonProps> = ({row,col,state,red,value,onClick,onContext}) => {
    const renderContent = ():React.ReactNode =>{
        if(state === CellState.visible){
            if(value === CellValue.bomb){
                return <span>💣</span>
            }
            return value > 0 ? value : '';

        }
        else if(state === CellState.flagged){
            //display emoji
            return <span role="img">🚩</span>
        }
        else
            return null;
    }
    
    
    
    
    return (
        <div className={`Button ${state === CellState.visible ? "visible":""}  value-${value} ${red ? "red":""}`} onClick={onClick(row,col)} onContextMenu={onContext(row,col)}>
            {renderContent()}
        </div>
    );
}

