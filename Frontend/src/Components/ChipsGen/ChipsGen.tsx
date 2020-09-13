import React from "react";
import styles from "./ChipsGen.module.scss";

interface IProps {
  amount: number
}

const ChipsGen: React.FC<IProps> = ({amount}) => {
  const createChips = ():number[] => {
    let total = amount;
    let array:number[] = [];
    [1000, 500, 100, 25, 5, 1].forEach(e=>{
      while(total-e>=0){
        array.push(e);
        total-=e;
      }
    });
    return array;
  }

  return (
      <div className={styles.ChipsGen}>
        {createChips().map((chip, index) => <img key={index} className={styles.chip} src={`./assets/PokerChips/${chip}.png`}/>)}
      </div>
  );
}
export default ChipsGen;
