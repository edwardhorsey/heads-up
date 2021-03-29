import React from 'react';
import { useFormik, FormikErrors } from 'formik';
import styles from './CreateOrJoin.module.scss';
import { useServer } from '../../Context/serverContext';
import { createGame, joinGame } from '../../Socket/requests';
import Button from '../Button';

interface Ivalues {
  gid: string;
}

const validate = (values: Ivalues) => {
  const errors: FormikErrors<Ivalues> = { };
  if (!values.gid) {
    errors.gid = 'Required';
  } else if (values.gid.length !== 10 || !/^[0-9a-zA-Z]+$/.test(values.gid)) {
    errors.gid = 'Incorrect game code format';
  }
  return errors;
};

const CreateOrJoin: React.FC = () => {
  const { gameState, serverState, gameDispatch } = useServer();
  const { uid } = serverState;
  const { falseGID } = gameState;

  const formik = useFormik({
    initialValues: { gid: '' },
    validate,
    onSubmit: (values) => joinGame(values.gid, uid),
  });

  if (formik.errors.gid === 'Required' && falseGID) {
    gameDispatch({ type: 'validGid' });
  }

  return (
    <section className={styles.CreateOrJoin}>
      <h3>Create or Join a game</h3>
      <Button logic={() => createGame(uid)} text="Create game" />
      <form>
        <input
          name="gid"
          placeholder="Game ID"
          onChange={formik.handleChange}
        />
        <Button logic={formik.handleSubmit} text="Join a game" />
        {formik.errors.gid
          ? <div className={styles.formErrors}>{formik.errors.gid}</div>
          : ''}
        {!formik.errors.gid && falseGID
          ? <div className={styles.formErrors}>Incorrect Game ID</div>
          : ''}
      </form>
    </section>
  );
};

export default CreateOrJoin;
