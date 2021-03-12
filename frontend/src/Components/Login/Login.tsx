import React, { useContext } from "react";
import styles from "./Login.module.scss";
import Button from "../Button";
import { AuthContext } from "../../Context/authContext";

const Login: React.FC = () => {
  const auth = useContext(AuthContext);
  const { login } = auth;

  return (
    <section className={styles.Login}>
      <Button logic={login} text="Login" />
    </section>
  );
};

export default Login;