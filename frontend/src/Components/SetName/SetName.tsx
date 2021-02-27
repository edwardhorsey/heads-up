import React from "react";
import styles from "./SetName.module.scss";
import { useFormik, FormikErrors } from 'formik';
import Button from "../Button";

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

const SetName: React.FC<IProps> = (props) => {
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validate,
    onSubmit: values => props.setName(values.name)
  });

  return (
    <section className={styles.SetName}>
        <form>
          <label htmlFor="name"><h1>Set your display name</h1></label>
          <input name="name" placeholder="Your name" onChange={formik.handleChange} />
          <Button logic={formik.handleSubmit} text="Set name" />
          {formik.errors.name ? <div className={styles.formErrors}>{formik.errors.name}</div> : ''}
        </form>
    </section>
  );
};

export default SetName;






















