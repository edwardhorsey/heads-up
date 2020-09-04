import React, { useContext } from "react";
import styles from "./GameHand.module.scss";

interface IProps {
  hand: [],
  pot: number
}

const GameNav: React.FC<IProps> = ({hand, pot}) => {
  return (
    <article className={styles.Hand}>
        <h2>GAME HAND</h2>
        <p>pot: {pot}</p>
        <p>opponent hand: CardBack, CardBack</p>
        <p>your hand: {hand}</p>
    </article>
  )
}

export default GameNav;