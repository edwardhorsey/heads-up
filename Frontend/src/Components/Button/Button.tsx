import React from "react";
import styles from "./Button.module.scss";

interface IProps {
  logic: (() => void),
  text: string
}

const Button: React.FC<IProps> = ({text, logic}) => {
  return <button type="submit" className={styles.Button} onClick={logic}>{text}</button>;
}
export default Button;
