import React, { useContext } from "react";
import styles from "./GameHand.module.scss";
import PlayingCard from "../PlayingCard";

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

  const readCards = (hand: string[]) => hand.map((card, index) => <PlayingCard key={index} card={card}/>)
  const twoCardBacks = () => [<PlayingCard key={1} card={['c', 'b']}/>, <PlayingCard key={2} card={['c', 'b']}/>]

  return (
    <article className={styles.Hand}>
        <h2>GAME HAND</h2>
        <div>{twoCardBacks()}</div>
        <p>Opponent blind: {opponent.blind}</p>
        <p>Pot: {pot}</p>
        <p>Your blind: {yourself.blind}</p>
        <div>{readCards(hand)}</div>
    </article>
  )
}

export default GameNav;