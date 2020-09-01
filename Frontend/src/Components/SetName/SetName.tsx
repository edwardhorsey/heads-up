import React, { useState, useContext } from "react";
import styles from "./SetName.module.scss";
import { ServerContext } from '../../Context/serverContext';
// import Button from "../Button";

interface IProps {
  setName: (name: string) => void
}

const SetName: React.FC<IProps> = (props) => {
  const [input, setInput] = useState('Your name')
  
  const context = useContext(ServerContext)
  console.log('hi from setname', context)

  return (
    <section className={styles.SetName}>
      <h1>Set your display name</h1>
      <input type="text" name="display-name" value={input} onChange={(event) => {setInput(event.target.value)}}/>
      <button onClick={() => props.setName(input)}>Set name</button>
    </section>
  );
};

export default SetName;
