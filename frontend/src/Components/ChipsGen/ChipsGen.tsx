import React from "react";
import styles from "./ChipsGen.module.scss";

interface IProps {
  amount: number
}

interface ChipsTable {
  [key: number]: number
}

let counter = 0;

const ChipsGen: React.FC<IProps> = ({amount}) => {
  const calculateChips = ():ChipsTable => {
    let total = amount;
    const obj: ChipsTable = {
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

  const hash = calculateChips()
  
  return (
    <div className={styles.ChipsGen}>
        {[1000, 500, 100, 25, 5, 1].map((chip) => {
          const chipsStack = [];

          for (let i = 0; i < hash[chip]; i++) {
            const inlineStyle = { top: `-${10*i}px` }
            chipsStack.push(<img key={'chip' + counter++} style={inlineStyle} alt={`${chip}`} className={styles.chip} src={`./assets/PokerChips/${chip}.png`}/>);
          }

          return chipsStack.length > 0 ?? <div key={'chipStack' + counter++}className={styles.parent}>{chipsStack}</div>;
        })
        }
      </div>
  );
}
export default ChipsGen;
