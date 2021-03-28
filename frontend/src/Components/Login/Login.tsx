import React, { useEffect, useState } from "react";
import styles from "./Login.module.scss";
import { sendCognitoCode } from '../../Socket/requests';

/*
import Button from "../Button";
import { useFormik, FormikErrors } from 'formik';
*/

const Login: React.FC = () => {
  const [ loginCode, setLoginCode ] = useState<string | null>(null);
  
  useEffect(()=>{
    setTimeout(() => {
        if (!loginCode) {
        console.log('!loginCode');
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');
        if (authCode) {
          setLoginCode(authCode);
          sendCognitoCode(authCode);
        }
      } else {
      }
    }, 1000);
  }, [loginCode]);

  /*
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
  */

  const loginUrl = process.env.REACT_APP_COGNITO_LOGIN_URL;
  
  return (
    <section className={styles.Login}>
      <h1>Welcome to Poker</h1>
      <a href={loginUrl}>Login</a>
    </section>
  );
};

export default Login;