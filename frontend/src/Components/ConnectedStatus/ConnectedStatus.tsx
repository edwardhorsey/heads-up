import React from 'react';
import styles from './ConnectedStatus.module.scss';
import { useServer } from '../../Context/serverContext';

const ConnectedStatus: React.FC = () => {
  const { serverState } = useServer();
  const { status } = serverState;

  const circleStyle = `${styles.circle} ${styles[status]}`;
  return (
    <section className={styles.ConnectedStatus}>
      <div className={circleStyle} />
      <p>{status}</p>
    </section>
  );
};

export default ConnectedStatus;
