import React from 'react';
import { useFormik, FormikErrors } from 'formik';
import styles from './AddChips.module.scss';
// import { useServer } from '../../Context/serverContext';
// import { addChips, joinGame } from '../../Socket/requests';
import Button from '../Button';

interface Ivalues {
  amount: number;
}

interface AddChipsProps {
  numChips: number,
  minimum: number,
}

const AddChips: React.FC<AddChipsProps> = ({ numChips, minimum }) => {
  const validate = (values: Ivalues) => {
    const errors: FormikErrors<Ivalues> = {};
    if (!values.amount) {
      errors.amount = 'Required';
    } else if (values.amount + numChips >= minimum) {
      errors.amount = `Must meet minimum chip requirement: ${minimum}`;
    }
    return errors;
  };

  const defaultValue = minimum - numChips === 0 ? 500 : minimum - numChips;

  const formik = useFormik({
    initialValues: { amount: defaultValue },
    validate,
    onSubmit: ({ amount }) => {
      // addChips(gid, uid, amount)
      console.log('adding ', amount);
    },
  });

  return (
    <section className={styles.AddChips}>
      <form>
        <input
          name="amount"
          placeholder={`${defaultValue}`}
          onChange={formik.handleChange}
        />
        <Button logic={formik.handleSubmit} text="Add chips" />
        {formik.errors.amount
          ? <div className={styles.formErrors}>{formik.errors.amount}</div>
          : ''}
      </form>
    </section>
  );
};

export default AddChips;
