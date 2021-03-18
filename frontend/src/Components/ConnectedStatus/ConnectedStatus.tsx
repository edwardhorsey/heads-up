import React from "react";
import styles from "./ConnectedStatus.module.scss";
import { useServer } from "../../Context/serverContext";

interface IProps {}

const ConnectedStatus: React.FC<IProps> = () => {
  const { serverState } = useServer()
  const { status } = serverState;

  const circleStyle = `${styles.circle} ${styles[status]}`;
  return (
    <section className={styles.ConnectedStatus}>
      <div className={circleStyle}></div>
      <p>{status}</p>
    </section>
  );
};

export default ConnectedStatus;
