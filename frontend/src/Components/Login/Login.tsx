import React from 'react';
import styles from './Login.module.scss';

const Login: React.FC = () => (
  <section className={styles.Login}>
    <h1>Welcome to Poker</h1>
    <a href={process.env.REACT_APP_COGNITO_LOGIN_URL}>Login</a>
  </section>
);

export default Login;
