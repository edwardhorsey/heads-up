import React, { useEffect, useState } from "react";
import styles from "./LoggingIn.module.scss";
import { sendCognitoCode } from '../../Socket/requests';
import { useHistory } from "react-router-dom";

const LoggingIn: React.FC = () => {
  const [ loginCode, setLoginCode ] = useState<string | null>(null);
  let history = useHistory();
  
  useEffect(()=>{
    setTimeout(() => {
      if (!loginCode) {
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');

        if (authCode) {
          setLoginCode(authCode);
          sendCognitoCode(authCode);
        } else {
          history.push('/');
        }
      }
    }, 1000);
  }, [loginCode]);
  
  return (
    <section className={styles.LoggingIn}>
      <p>Logging you in...</p>
    </section>
  );
};

export default LoggingIn;