import React from 'react';
import { useServer } from '../../Context/serverContext';
import { Iplayer, Hand, Card } from '../../Interfaces/interfaces';
import styles from './GameHand.module.scss';
import PlayingCard from '../PlayingCard';
import UserMoves from '../UserMoves';
import Pot from '../Pot';
import PlayerChips from '../PlayersChips/PlayersChips';
import CommunityCards from '../CommunityCards';
import PlayersCards from '../PlayersCards';
import WinnerAnnounce from '../WinnerAnnounce';
import RoundWinner from '../RoundWinner';
import PlayerStats from '../PlayerStats';
import Timer from '../Timer';

let gameHandCounter = 0;

const cardBacks = () => {
  gameHandCounter += 2;
  return [
    <PlayingCard
      key={`cardBacks ${gameHandCounter}`}
      winner={false}
      card={['c', 'b']}
    />,
    <PlayingCard
      key={`cardBacks ${gameHandCounter + 1}`}
      winner={false}
      card={['c', 'b']}
    />,
  ];
};

interface GameHandProps {
  yourself: Iplayer,
  opponent: Iplayer
}

const GameHand: React.FC<GameHandProps> = ({ yourself, opponent }) => {
  const { gameState } = useServer();
  const {
    whichPlayer,
    yourHand,
    oppHand,
    winner,
    winningHand,
    pot,
    community,
    stage,
    noOfHands,
    action,
  } = gameState;

  const isAWinningCard = (card: Card) => (
    winningHand[2].join('').includes(card.join(''))
  );

  const readCards = (hand: Hand) => hand.map((card) => {
    gameHandCounter += 1;
    return (
      <PlayingCard
        key={`readCards ${gameHandCounter}`}
        winner={['winner', 'end'].includes(stage) && winningHand[2].length > 0
          ? isAWinningCard(card)
          : false}
        card={card}
      />
    );
  });

  const playerNavStyles = (action !== null && whichPlayer === action)
    ? `${styles.playerNav} ${styles.focus}`
    : styles.playerNav;
  const opponentNavStyles = (action !== null && whichPlayer !== action)
    ? `${styles.playerNav} ${styles.focus}`
    : styles.playerNav;

  const opponentsCards = oppHand.length > 0 ? readCards(oppHand) : cardBacks();

  const announceWinner = () => {
    if (winner === 'draw') {
      return `Draw: players split the pot with ${winningHand[0]}`;
    }

    const winningPlayer = whichPlayer === (winner === 'one' ? 0 : 1)
      ? yourself
      : opponent;
    return `${winningPlayer.name} wins the pot ${pot} with ${winningHand[0]}`;
  };

  const playerBust = () => {
    const bust = yourself.bankroll <= 0
      ? [yourself, opponent]
      : [opponent, yourself];
    return `${bust[0].name} has bust, ${bust[1].name} wins the round!`;
  };

  return (
    <article className={styles.Hand}>
      <div className={opponentNavStyles}>
        {noOfHands && <p>{`#${noOfHands}`}</p>}
        <PlayersCards cards={opponentsCards} />
        <div className={styles.OppAndTimer}>
          {(action !== null) && (whichPlayer !== action)
            && <Timer num={15} logic={() => { /* do nothing */ }} />}
          <PlayerStats
            player={opponent}
            who="opp"
            stage={stage}
            yourHand={yourHand}
          />
        </div>
      </div>
      <PlayerChips which="Opponent" stage={stage} player={opponent} />
      {stage === 'end' && <RoundWinner text={playerBust()} />}
      {winner && <WinnerAnnounce text={announceWinner()} />}
      {community && <CommunityCards cards={readCards(community)} />}
      <Pot amount={pot} stage={stage} />
      <PlayerChips which="Your" stage={stage} player={yourself} />
      <div className={playerNavStyles}>
        <PlayerStats
          player={yourself}
          who="you"
          stage={stage}
          yourHand={yourHand}
        />
        <PlayersCards
          cards={yourself.folded ? cardBacks() : readCards(yourHand)}
        />
        <UserMoves />
      </div>
    </article>
  );
};

export default GameHand;
