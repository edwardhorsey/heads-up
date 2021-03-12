import React, { useContext } from "react";
import styles from "./Login.module.scss";
import Button from "../Button";
import { AuthContext } from "../../Context/authContext";

const Login: React.FC = () => {
  const auth = useContext(AuthContext);
  const { login } = auth;

  return (
    <section className={styles.Login}>
      <h1>Welcome to Poker</h1>
      <Button logic={login} text="Login" />
    </section>
  );
};

export default Login;