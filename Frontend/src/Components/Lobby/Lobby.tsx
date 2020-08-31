import React, {useState} from "react";
import styles from "./Lobby.module.scss";
// import Button from "../Button";

interface IProps {
  displayName: string
}

const Lobby: React.FC<IProps> = (props) => {
  const [input, setInput] = useState('Game ID')
  console.log(props);

  return (
    <section className={styles.Lobby}>
      <h2>Lobby</h2>
      <h3>Welcome, {props.displayName}</h3>
      <h3>Create or Join a game</h3>
      <button>Create game</button>
      <input type="text" name="display-name" value={input} onChange={(event) => {setInput(event.target.value)}}/>
      <button>Join a game</button>
    </section>
  );
};

export default Lobby;
