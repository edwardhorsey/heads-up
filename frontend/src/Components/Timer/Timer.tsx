import React, { useState } from 'react';
import useInterval from "../../Utilities/useInterval";
import styles from "./Timer.module.scss";

interface IProps {
  num: number,
  logic: (() => void),
}

const Timer: React.FC<IProps> = ({num, logic}) => {

  let [count, setCount] = useState(num);

  useInterval(() => {
    setCount(count - 1);
  }, count ? 1000 : null);

  return ( 
    <div>
      <h1 className={styles.Timer}>{count}</h1>
      {!count && logic()}
    </div>
  )
}

export default Timer;