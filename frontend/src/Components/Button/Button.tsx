import React from 'react';
import styles from './Button.module.scss';

interface IProps {
  logic: (() => void),
  text: string,
  disabled?: boolean,
}

const Button: React.FC<IProps> = ({ text, logic, disabled }) => (
  <button
    type="submit"
    className={styles.Button}
    onClick={logic}
    disabled={disabled}
  >
    {text}
  </button>
);

export default Button;
