import React, { useContext } from "react";
import styles from "./GameHand.module.scss";

interface Iplayer {
  name: string,
  bankroll: number,
  ready: boolean,
  blind: number
}

interface IProps {
  hand: [],
  pot: number,
  yourself: Iplayer,
  opponent: Iplayer
}

const GameNav: React.FC<IProps> = ({hand, pot, yourself, opponent}) => {
  
  const readCard = (card: any) => card.join(' of ');

  return (
    <article className={styles.Hand}>
        <h2>GAME HAND</h2>
        <p>opponent hand: CardBack, CardBack</p>
        <p>opponent blind: {opponent.blind}</p>
        <p>pot: {pot}</p>
        <p>your blind: {yourself.blind}</p>
        <p>your hand: {hand}</p>
    </article>
  )
}

export default GameNav;