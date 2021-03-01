import React, { useContext } from "react";
import styles from "./CreateOrJoin.module.scss";
import { ServerContext } from '../../Context/serverContext';
import socket from "../../Socket/socket";
import { useFormik, FormikErrors } from 'formik';
import Button from "../Button";

interface Ivalues {
  gid: string;
}

const validate = (values: Ivalues) => {
  let errors: FormikErrors<Ivalues> = { };
  if (!values.gid) {
    errors.gid = "Required"
  } else if (!Number(values.gid) || !/^[0-9]{1,4}$/.test(values.gid)) {
    errors.gid = "Must be a number between 1-9999"
  }
  return errors;
};

const CreateOrJoin: React.FC = () => {
  const context = useContext(ServerContext);

  const { falseGID, uid, displayName } = context;

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
      'action': 'onGameAction',
      'method': 'createGame',
      uid,
      displayName,
    };
    console.log(request);
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

  if (formik.errors.gid === "Required" && falseGID) context.setCState({...context, falseGID: false });

  return (
    <section className={styles.CreateOrJoin}>
      <h3>Create or Join a game</h3>
      <Button logic={createGame} text="Create game" />
      <form>
        <input name="gid" placeholder="Game ID" onChange={formik.handleChange}/>
        <Button logic={formik.handleSubmit} text="Join a game" />
        {formik.errors.gid ? <div className={styles.formErrors}>{formik.errors.gid}</div> : ''}
        {!formik.errors.gid && falseGID ? <div className={styles.formErrors}>Incorrect Game ID</div> : ''}
      </form>
    </section>
  );
};

export default CreateOrJoin;
