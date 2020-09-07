import React, { useState, useContext } from "react";
import styles from "./CreateOrJoin.module.scss";
import { ServerContext, socket } from '../../Context/serverContext';
import { useFormik, FormikErrors } from 'formik';
import Button from "../Button";

interface Ivalues {
  gid: string;
}

const validate = (values: Ivalues) => {
  let errors: FormikErrors<Ivalues> = { };
  if (!values.gid) {
    errors.gid = "Required"
  } else if (!Number(values.gid)) {
    errors.gid = "Must be a number between 1-999"
  }
  return errors;
};

const CreateOrJoin: React.FC = () => {    
  const context = useContext(ServerContext);
  console.log('hi from CreateOrJoin', context);

  const { uid, displayName } = context.cState;

  const formik = useFormik({
    initialValues: {
      gid: '',
    },
    validate,
    onSubmit: values => {
      joinGame(values.gid);
    }
  });

  const createGame = () => {
    const request = {
      'method': 'create-game',
      'uid': uid,
      'display-name': displayName
    };
    socket.send(JSON.stringify(request));
  }

  const joinGame = (gid: string) => {
      const request = {
        'method': 'join-game',
        'uid': uid,
        'display-name': displayName,
        'gid': gid
      };
      socket.send(JSON.stringify(request));
  }

  return (
    <section className={styles.CreateOrJoin}>
      <h3>Create or Join a game</h3>
      <Button logic={createGame} text="Create game" />
      <form>
        <input name="gid" placeholder="Game ID" onChange={formik.handleChange}/>
        <Button logic={formik.handleSubmit} text="Join a game" />
        {formik.errors.gid ? <div className={styles.formErrors}>{formik.errors.gid}</div> : ''}
      </form>
    </section>
  );
};

export default CreateOrJoin;
