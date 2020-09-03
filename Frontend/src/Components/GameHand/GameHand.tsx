import React, { useContext } from "react";
import styles from "./GameHand.module.scss";

interface IProps {
  hand: []
}

const GameNav: React.FC<IProps> = ({hand}) => {
  return (
    <article className={styles.Hand}>
        <h2>GAME HAND</h2>
        <p>opponent hand: CardBack, CardBack</p>
        <p>your hand: {hand}</p>
    </article>
  )
}

export default GameNav;