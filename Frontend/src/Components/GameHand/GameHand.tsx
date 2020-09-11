import React, { useContext } from "react";
import { socket, ServerContext } from '../../Context/serverContext';
import styles from "./GameHand.module.scss";
import PlayingCard from "../PlayingCard";
import UserMoves from "../UserMoves";

interface Iplayer {
  name: string,
  bankroll: number,
  ready: boolean,
  'bet-size': number,
  folded: boolean
}

interface IProps {
  yourHand: [],
  oppHand: [],
  community: [],
  pot: number,
  yourself: Iplayer,
  opponent: Iplayer,
  noOfHands: number
}

const GameHand: React.FC<IProps> = ({yourself, opponent}) => {

  const context = useContext(ServerContext);
  const { whichPlayer, yourHand, oppHand, winner, winningHand, noOfHands, pot, community, stage } = context.cState;

  const isAWinningCard = (card: string) => winningHand[2].join('').includes(card);

  const readCards = (hand: string[]) => hand.map((card, index) => <PlayingCard key={index} winner={stage === 'winner' && winningHand ? isAWinningCard(`${card}`) : false} card={card}/>)
  const cardBacks = () => [<PlayingCard key={1} winner={false} card={['c', 'b']}/>, <PlayingCard key={2} winner={false} card={['c', 'b']}/>]

  const opponentsCards = () => oppHand ? readCards(oppHand) : cardBacks();

  const announceWinner = () => {
    if (winner === 'draw') {
      return <h3>Draw: players split the pot with {winningHand[0]} (further hand details)</h3>;
    } else {
      const winningPlayer = whichPlayer === (winner === 'one' ? 0:1) ? yourself : opponent;
      return <h3>{winningPlayer.name} wins the pot {pot} with {winningHand[0]} (further hand details)</h3>;
    }
  }

  return (
    <article className={styles.Hand}>
        <p>{`#${noOfHands}`}</p>
        {winner ? announceWinner() : ''}
        <div className={styles.players}>
          {opponentsCards()}
        </div>
        <div className={styles.blindsAndBets}>
          {opponent['bet-size'] > 0 ? <p>Opponent bet: {opponent['bet-size']}</p> : ''}
        </div>
        <div className={styles.community}>
          {community ? readCards(community) : ''}
        </div>
        <p>Pot: {pot}</p>
        <div className={styles.blindsAndBets}>
          {yourself['bet-size'] > 0 ? <p>Your bet: {yourself['bet-size']}</p> : ''}
        </div>
        <div className={styles.players}>
          {yourself.folded ? cardBacks() : readCards(yourHand)}
        </div>
        <UserMoves />
    </article>
  )
}

export default GameHand;