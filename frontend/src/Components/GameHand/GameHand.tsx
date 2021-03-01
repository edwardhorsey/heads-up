import React, { useContext } from "react";
import { ServerContext, Iplayer } from '../../Context/serverContext';
import styles from "./GameHand.module.scss";
import PlayingCard from "../PlayingCard";
import UserMoves from "../UserMoves";
import Pot from "../Pot";
import PlayerChips from "../PlayersChips/PlayersChips";
import CommunityCards from "../CommunityCards";
import PlayersCards from "../PlayersCards";
import WinnerAnnounce from "../WinnerAnnounce";
import RoundWinner from "../RoundWinner";
import PlayerStats from "../PlayerStats";
import Timer from "../Timer";

interface IProps {
  yourself: Iplayer,
  opponent: Iplayer
}

const GameHand: React.FC<IProps> = ({yourself, opponent}) => {
  const context = useContext(ServerContext);
  const { whichPlayer, yourHand, oppHand, winner, winningHand, pot, community, stage, noOfHands, action } = context;

  const isAWinningCard = (card: string) => winningHand[2].join('').includes(card);

  const readCards = (hand: string[]) => hand.map((card, index) => <PlayingCard
    key={index}
    winner={(['winner', 'end'].includes(stage) && winningHand[2].length > 0) ? isAWinningCard(card) : false}
    card={card}
    />);

  const cardBacks = [<PlayingCard key={1} winner={false} card={['c', 'b']}/>, <PlayingCard key={2} winner={false} card={['c', 'b']}/>];

  const playerNavStyles = () => (action !== null) && (whichPlayer === action) ? `${styles.playerNav} ${styles.focus}` : styles.playerNav;
  const opponentNavStyles = () => (action !== null) && (whichPlayer !== action) ? `${styles.playerNav} ${styles.focus}` : styles.playerNav;

  const opponentsCards = () => oppHand.length > 0 ? readCards(oppHand) : cardBacks;

  const announceWinner = () => {
    if (winner === 'draw') {
      return `Draw: players split the pot with ${winningHand[0]}`;
    } else {
      const winningPlayer = whichPlayer === (winner === 'one' ? 0 : 1) ? yourself : opponent;
      return `${winningPlayer.name} wins the pot ${pot} with ${winningHand[0]}`;
    }
  }

  const playerBust = () => {
    const bust = yourself.bankroll <= 0 ? [yourself, opponent] : [opponent, yourself];
    return `${bust[0].name} has bust, ${bust[1].name} wins the round!`;
    }

  return (
    <article className={styles.Hand}>
        <div className={opponentNavStyles()}>
          {noOfHands ? <p>{`#${noOfHands}`}</p> : ''}
          <PlayersCards cards={opponentsCards()} />
          <div className={styles.OppAndTimer}>
            {((action !== null) && (whichPlayer !== action)) && <Timer num={15} logic={()=>{}} />}
            <PlayerStats player={opponent} who="opp" />
          </div>
        </div>
        <PlayerChips which={'Opponent'} stage={stage} player={opponent} />
        {stage === 'end' && <RoundWinner text={playerBust()}/>}
        {winner && <WinnerAnnounce text={announceWinner()} />}
        {community && <CommunityCards cards={readCards(community)} />}
        <Pot amount={pot} />
        <PlayerChips which={'Your'} stage={stage} player={yourself} />
        <div className={playerNavStyles()}>
          <PlayerStats player={yourself} who="you" />
          <PlayersCards cards={yourself.folded ? cardBacks : readCards(yourHand)} />
          <UserMoves />
        </div>
    </article>
  )
}

export default GameHand;