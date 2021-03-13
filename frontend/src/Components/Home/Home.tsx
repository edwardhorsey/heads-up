import React, { useContext } from "react";
import styles from "./Home.module.scss";
import { ServerContext } from '../../Context/serverContext';
import { AuthContext } from "../../Context/authContext";
import Lobby from '../../Components/Lobby';
import GameContainer from '../../Components/GameContainer';
import Button from "../Button";

const Home: React.FC = () => {
  const server = useContext(ServerContext);
  const { readyToStart } = server.serverState;
  const auth = useContext(AuthContext);
  const { logout } = auth;

  return (
    <section className={styles.Home}>
      <h1>Heads Up Poker</h1>
      <Button logic={logout} text="Logout" />
      {readyToStart ? <GameContainer /> : <Lobby />} {/* redirect or buttons to access game? */}
    </section>
  );
};

export default Home;