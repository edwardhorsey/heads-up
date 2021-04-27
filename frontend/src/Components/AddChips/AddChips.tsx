import React, { useState } from 'react';
import { useFormik, FormikErrors } from 'formik';
import styles from './AddChips.module.scss';
import { addChips } from '../../Socket/requests';
import Button from '../Button';

interface Ivalues {
  amount: number;
}

interface AddChipsProps {
  numChips: number;
  minimum: number;
  gid: string;
  uid: string;
}

const AddChips: React.FC<AddChipsProps> = ({
  numChips,
  minimum,
  gid,
  uid,
}) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const validate = (values: Ivalues) => {
    const errors: FormikErrors<Ivalues> = {};
    if (!values.amount) {
      errors.amount = 'Required';
    } else if (
      Number(values.amount) < 1
      || Number(values.amount) + numChips < minimum
    ) {
      errors.amount = `Must meet minimum chip requirement: ${minimum}`;
    }

    return errors;
  };

  const defaultValue = minimum - numChips < 1 ? 500 : minimum - numChips;

  const formik = useFormik({
    initialValues: { amount: defaultValue },
    validate,
    onSubmit: ({ amount }) => {
      addChips(gid, uid, amount);
      setButtonDisabled(true);
    },
  });

  return (
    <section className={styles.AddChips}>
      <form>
        <input
          name="amount"
          placeholder={String(defaultValue)}
          onChange={formik.handleChange}
        />
        <Button
          logic={formik.handleSubmit}
          text="Add chips"
          disabled={buttonDisabled}
        />
        {formik.errors.amount
          ? <div className={styles.formErrors}>{formik.errors.amount}</div>
          : ''}
      </form>
    </section>
  );
};

export default AddChips;
