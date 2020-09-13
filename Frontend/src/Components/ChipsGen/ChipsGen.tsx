import React from "react";
import styles from "./ChipsGen.module.scss";

interface IProps {
  amount: number
}

const ChipsGen: React.FC<IProps> = ({amount}) => {
  const createChips = ():string => {
    let total = amount;
    let array:number[] = [];
    [1000, 500, 100, 25, 5, 1].forEach(e=>{
      while(total-e>=0){
        array.push(e);
        total-=e;
      }
    });
    return array.reduce((a:string,b:number)=>{return a + ' ' + b }, '');  
  }

  return (
    <>
      <div>{createChips()}</div>
    </>
  );
}
export default ChipsGen;
