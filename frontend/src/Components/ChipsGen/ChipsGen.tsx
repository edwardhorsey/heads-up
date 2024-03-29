import React from 'react';
import styles from './ChipsGen.module.scss';

interface IProps {
  amount: number
}

interface ChipsTable {
  [key: number]: number
}

let chipsGenCounter = 0;

const chipValues = [
  500000,
  100000,
  250000,
  10000,
  5000,
  1000,
  500,
  100,
  25,
  5,
  1,
];

const ChipsGen: React.FC<IProps> = ({ amount }) => {
  const calculateChips = (): ChipsTable => {
    let total = amount;
    const obj: ChipsTable = {
      500000: 0,
      100000: 0,
      250000: 0,
      10000: 0,
      5000: 0,
      1000: 0,
      500: 0,
      100: 0,
      25: 0,
      5: 0,
      1: 0,
    };

    chipValues.forEach((chip) => {
      while (total - chip >= 0) {
        obj[chip] += 1;
        total -= chip;
      }
    });
    return obj;
  };

  const hash = calculateChips();

  return (
    <div className={styles.ChipsGen}>
      {chipValues.map((chip) => {
        const chipsStack = [];

        for (let i = 0; i < hash[chip]; i += 1) {
          const inlineStyle = { top: `-${10 * i}px` };
          chipsStack.push(
            <img
              key={`chip ${chipsGenCounter += 1}`}
              style={inlineStyle}
              alt={`${chip}`}
              className={styles.chip}
              src={`./assets/PokerChips/${chip}.png`}
            />,
          );
        }

        return chipsStack.length > 0 && (
          <div key={`chipStack ${chipsGenCounter}`} className={styles.parent}>
            {chipsStack}
          </div>
        );
      })}
    </div>
  );
};

export default ChipsGen;
