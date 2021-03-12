import React from "react";
import styles from "./Login.module.scss";
import Button from "../Button";
import { useFormik, FormikErrors } from 'formik';
import socket from '../../Socket/socket';


const setUsername = (username: string) => {
  const request = {
    username,
    action: 'onGameAction',
    method: 'setUsername',
  };

  socket.send(JSON.stringify(request));
}

const Login: React.FC = () => {
  const setName = (name: string): void => setUsername(name);

  interface Ivalues {
    name: string;
  }
  interface IProps {
    setName: (name: string) => void
  }
  
  const validate = (values: Ivalues) => {
    let errors: FormikErrors<Ivalues> = { };
    if (!values.name) errors.name = "Required" 
    return errors
  };
  
  const formik = useFormik({
    initialValues: { name: "" },
    validate,
    onSubmit: values => setName(values.name)
  });

  return (
    <section className={styles.Login}>
      <h1>Welcome to Poker</h1>
      <form>
        <label htmlFor="name" hidden><h1>Display name</h1></label>
        <input name="name" placeholder="Your name" onChange={formik.handleChange} />
        <Button logic={formik.handleSubmit} text="Login" />
        {formik.errors.name ?? <div className={styles.formErrors}>{formik.errors.name}</div>}
      </form>
    </section>
  );
};

export default Login;