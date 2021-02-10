import React, { useContext } from "react";
import styles from "./ConnectedStatus.module.scss";
import { ServerContext } from "../../Context/serverContext";

interface IProps {}

const ConnectedStatus: React.FC<IProps> = () => {
  const context = useContext(ServerContext);
  const { status } = context;
  const circleStyle = `${styles.circle} ${styles[status]}`;
  return (
    <section className={styles.ConnectedStatus}>
      <div className={circleStyle}></div>
      <p>{status}</p>
    </section>
  );
};

export default ConnectedStatus;
