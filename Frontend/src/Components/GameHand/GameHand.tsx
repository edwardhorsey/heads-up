import React, { useContext } from "react";
import { ServerContext, Iplayer } from '../../Context/serverContext';
import styles from "./GameHand.module.scss";
import PlayingCard from "../PlayingCard";
import UserMoves from "../UserMoves";
import ChipsGen from "../ChipsGen";
import Pot from "../Pot";

interface IProps {
  yourHand: string[],
  oppHand: string[],
  community: string[],
  pot: number,
  yourself: Iplayer,
  opponent: Iplayer,
  noOfHands: number
}

const GameHand: React.FC<IProps> = ({yourself, opponent}) => {

  const context = useContext(ServerContext);
  const { whichPlayer, yourHand, oppHand, winner, winningHand, noOfHands, pot, community, stage } = context;

  const isAWinningCard = (card: string) => {
    return winningHand[2].join('').includes(card)
  };

  const readCards = (hand: string[]) => hand.map((card, index) => <PlayingCard
    key={index}
    winner={(['winner', 'end'].includes(stage) && winningHand[2].length > 0) ? isAWinningCard(card) : false}
    card={card}
    />);

  const cardBacks = () => [<PlayingCard key={1} winner={false} card={['c', 'b']}/>, <PlayingCard key={2} winner={false} card={['c', 'b']}/>];

  const opponentsCards = () => oppHand.length > 0 ? readCards(oppHand) : cardBacks();

  const announceWinner = () => {
    if (winner === 'draw') {
      return <h3>Draw: players split the pot with {winningHand[0]} (further hand details)</h3>;
    } else {
      const winningPlayer = whichPlayer === (winner === 'one' ? 0:1) ? yourself : opponent;
      return <p>{winningPlayer.name} wins the pot {pot} with {winningHand[0]} (further hand details)</p>;
    }
  }

  const playerBust = () => {
    const bust = yourself.bankroll <= 0 ? [yourself, opponent] : [opponent, yourself];
    return <h3>{bust[0].name} has bust, {bust[1].name} wins the round!</h3>
    }

  return (
    <article className={styles.Hand}>
        <p>{`#${noOfHands}`}</p>
        {stage === 'end' ? playerBust(): ''}
        <div className={styles.players}>
          {opponentsCards()}
        </div>
        <div className={styles.blindsAndBets}>
          {opponent['bet-size'] > 0 && stage !== "winner" ? (<><p>Opponent bet:</p> <ChipsGen amount={opponent['bet-size']} /></>) : ''}
        </div>
        {winner ? announceWinner() : ''}
        <div className={styles.community}>
          {community ? readCards(community) : ''}
        </div>
        <Pot amount={pot} />
        <div className={styles.blindsAndBets}>
          {yourself['bet-size'] > 0 && stage !== "winner" ? (<><p>Your bet:/</p> <ChipsGen amount={yourself['bet-size']} /></>) : ''}
        </div>
        <div className={styles.players}>
          {yourself.folded ? cardBacks() : readCards(yourHand)}
        </div>
        <UserMoves />
    </article>
  )
}

export default GameHand;