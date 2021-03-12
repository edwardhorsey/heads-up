import React, { useContext } from "react";
import styles from "./Pot.module.scss";
import ChipsGen from "../ChipsGen";
import { ServerContext } from "../../Context/serverContext";

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