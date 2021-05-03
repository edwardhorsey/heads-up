import React from 'react';
import {
  Iplayer,
  Hand,
  Card,
  WinningHand,
  Stage,
  Action,
  CommunityType,
} from '../../Interfaces/interfaces';
import styles from './GameHand.module.scss';
import PlayingCard from '../PlayingCard';
import UserMoves from '../UserMoves';
import Pot from '../Pot';
import PlayerChips from '../PlayersChips/PlayersChips';
import CommunityCards from '../CommunityCards';
import PlayersCards from '../PlayersCards';
import Announcement from '../Announcement';
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
  action: Action;
  community: CommunityType;
  noOfHands: number;
  opponent: Iplayer;
  oppHand: Hand;
  pot: number;
  stage: Stage;
  whichPlayer: number;
  winner: string;
  winningHand: WinningHand;
  yourself: Iplayer;
  yourHand: Hand;
}

const isAWinningCard = (card: Card, winningHand: WinningHand) => (
  winningHand[2].join(',').includes(card.join(','))
);

const readCards = (
  cards: Card[],
  winningHand: WinningHand,
  stage: Stage,
) => cards.map((card: Card) => {
  gameHandCounter += 1;
  return (
    <PlayingCard
      key={`readCards ${gameHandCounter}`}
      winner={['winner', 'end'].includes(stage) && winningHand[2].length > 0
        ? isAWinningCard(card, winningHand)
        : false}
      card={card}
    />
  );
});

const GameHand: React.FC<GameHandProps> = ({
  action,
  community,
  noOfHands,
  opponent,
  oppHand,
  pot,
  stage,
  whichPlayer,
  winner,
  winningHand,
  yourself,
  yourHand,
}) => {
  const playerNavStyles = (action !== null && whichPlayer === action)
    ? `${styles.playerNav} ${styles.focus}`
    : styles.playerNav;

  const opponentNavStyles = (action !== null && whichPlayer !== action)
    ? `${styles.playerNav} ${styles.focus}`
    : styles.playerNav;

  const opponentsCards = oppHand.length > 0
    ? readCards(oppHand, winningHand, stage)
    : cardBacks();

  const yourCards = yourself.folded
    ? cardBacks()
    : readCards(yourHand, winningHand, stage);

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
    const bust = yourself.chips <= 0
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
      <div className={styles.announcements}>
        {stage === 'end' && <Announcement text={playerBust()} />}
        {winner && <Announcement text={announceWinner()} />}
      </div>
      {community && (
        <CommunityCards
          cards={readCards(community, winningHand, stage)}
        />
      )}
      <Pot amount={pot} stage={stage} />
      <PlayerChips which="Your" stage={stage} player={yourself} />
      <div className={playerNavStyles}>
        <PlayerStats
          player={yourself}
          who="you"
          stage={stage}
          yourHand={yourHand}
        />
        <PlayersCards cards={yourCards} />
        <UserMoves />
      </div>
    </article>
  );
};

export default GameHand;
