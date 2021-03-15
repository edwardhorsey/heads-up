import React, { useContext } from "react";
import styles from "./CreateOrJoin.module.scss";
import { ServerContext } from '../../Context/serverContext';
import { createGame, joinGame } from "../../Socket/requests";
import { useFormik, FormikErrors } from 'formik';
import Button from "../Button";

interface Ivalues {
  gid: string;
}

const validate = (values: Ivalues) => {
  let errors: FormikErrors<Ivalues> = { };
  if (!values.gid) {
    errors.gid = "Required"
  } else if (values.gid.length !== 10 || !/^[0-9a-zA-Z]+$/.test(values.gid)) {
    errors.gid = "Incorrect game code format"
  }
  return errors;
};

const CreateOrJoin: React.FC = () => {
  const context = useContext(ServerContext);
  const { serverState } = context;
  const { falseGID, uid, displayName } = serverState;

  const formik = useFormik({
    initialValues: {
      gid: '',
    },
    validate,
    onSubmit: values => {
      joinGame(values.gid, uid);
    }
  });

  if (formik.errors.gid === "Required" && falseGID) context.setServerState({...context.serverState, falseGID: false });

  return (
    <section className={styles.CreateOrJoin}>
      <h3>Create or Join a game</h3>
      <Button logic={() => createGame(uid)} text="Create game" />
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
