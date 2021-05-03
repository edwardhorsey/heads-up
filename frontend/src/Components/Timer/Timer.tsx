import React, { useEffect, useState } from 'react';
import useInterval from '../../Utilities/useInterval';
import styles from './Timer.module.scss';

interface IProps {
  num: number,
  logic: () => void
}

const Timer: React.FC<IProps> = ({ num, logic }) => {
  const [count, setCount] = useState(num);
  const [logicCompleted, setLogicCompleted] = useState(false);

  useEffect(() => {
    if (!logicCompleted && !count) {
      logic();
      setLogicCompleted(true);
    }
  }, [logicCompleted, count, logic]);

  useInterval(() => {
    setCount(count - 1);
  }, count ? 1000 : null);

  return (
    <div>
      <h1 className={styles.Timer}>{count}</h1>
    </div>
  );
};

export default Timer;
