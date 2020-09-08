import React, { useContext } from "react";
import styles from "./GameHand.module.scss";
import PlayingCard from "../PlayingCard";
import UserMoves from "../UserMoves";

interface Iplayer {
  name: string,
  bankroll: number,
  ready: boolean,
  blind: number
  bet: number
}

interface IProps {
  yourHand: [],
  oppHand: [],
  community: [],
  pot: number,
  yourself: Iplayer,
  opponent: Iplayer
}

const GameHand: React.FC<IProps> = ({yourHand, oppHand, community, pot, yourself, opponent}) => {

  const readCards = (hand: string[]) => hand.map((card, index) => <PlayingCard key={index} card={card}/>)
  const cardBacks = () => [<PlayingCard key={1} card={['c', 'b']}/>, <PlayingCard key={2} card={['c', 'b']}/>]

  const opponentsCards = () => oppHand ? readCards(oppHand) : cardBacks();

  return (
    <article className={styles.Hand}>
        <h2>GAME HAND</h2>
        <div>{opponentsCards()}</div>
        <p>Opponent blind: {opponent.blind}</p>
        <p>Opponent bet: {opponent.bet}</p>
        <div>{community ? readCards(community) : ''}</div>
        <p>Pot: {pot}</p>
        <p>Your blind: {yourself.blind}</p>
        <p>Your bet: {yourself.bet}</p>
        <div>{readCards(yourHand)}</div>
        <UserMoves />
    </article>
  )
}

export default GameHand;