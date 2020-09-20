import React from "react";
import styles from "./ChipsGen.module.scss";

interface IProps {
  amount: number
}

interface IChipHash {
  [key: number]: number
}

const ChipsGen: React.FC<IProps> = ({amount}) => {
  // const calculateChips = ():number[] => {
  //   let total = amount;
  //   let array:number[] = [];
  //   [1000, 500, 100, 25, 5, 1].forEach(e=>{
  //     while(total-e>=0){
  //       array.push(e);
  //       total-=e;
  //     }
  //   });
  //   return array;
  // }

  const calculateChips = ():IChipHash => {
    let total = amount;
    let obj: IChipHash = {
      1000: 0,
      500: 0,
      100: 0,
      25: 0,
      5: 0,
      1: 0
    };

    [1000, 500, 100, 25, 5, 1].forEach( chip =>{
      while(total - chip >= 0) {
        obj[chip] += 1;
        total -= chip;
      }
    });
    return obj;
  }

  
  return (
    <div className={styles.ChipsGen}>
        {[1000, 500, 100, 25, 5, 1].map((chip, index) => {
          
          const inlineStyle = { top: `-${10*index}px` }

        return <img key={index} style={inlineStyle} alt={`${chip}`} className={styles.chip} src={`./assets/PokerChips/${chip}.png`}/>})

        // div called base, and map (like above) through the hash table of chips. for each base. and return into the map
        }
      </div>
  );
}
export default ChipsGen;
