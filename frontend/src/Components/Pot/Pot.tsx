import React from "react";
import styles from "./Pot.module.scss";
import ChipsGen from "../ChipsGen";

interface IProps {
  amount: number;
  stage: string;
}

const Pot: React.FC<IProps> = ({amount, stage}) => {

  return (
    <div className={styles.pot}>
    <p>Total pot: {amount}</p>
    <ChipsGen amount={['showdown', 'winner', "end"].includes(stage) ? amount: 0}/>
  </div>
  );
}
export default Pot;