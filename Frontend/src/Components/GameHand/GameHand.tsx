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
  const { whichPlayer, yourHand, oppHand, winner, winningHand, pot, community, stage } = context;

  const isAWinningCard = (card: string) => winningHand[2].join('').includes(card);

  const readCards = (hand: string[]) => hand.map((card, index) => <PlayingCard
    key={index}
    winner={(['winner', 'end'].includes(stage) && winningHand[2].length > 0) ? isAWinningCard(card) : false}
    card={card}
    />);

  const cardBacks = () => [<PlayingCard key={1} winner={false} card={['c', 'b']}/>, <PlayingCard key={2} winner={false} card={['c', 'b']}/>];

  const opponentsCards = () => oppHand.length > 0 ? readCards(oppHand) : cardBacks();

  const announceWinner = () => {
    if (winner === 'draw') {
      return `Draw: players split the pot with ${winningHand[0]} (further hand details)`;
    } else {
      const winningPlayer = whichPlayer === (winner === 'one' ? 0:1) ? yourself : opponent;
      return `${winningPlayer.name} wins the pot ${pot} with ${winningHand[0]} (further hand details)`;
    }
  }

  const playerBust = () => {
    const bust = yourself.bankroll <= 0 ? [yourself, opponent] : [opponent, yourself];
    return `${bust[0].name} has bust, ${bust[1].name} wins the round!`
    }

  return (
    <article className={styles.Hand}>
        {stage === 'end' ? <RoundWinner text={playerBust()}/> : ''}
        <PlayersCards cards={opponentsCards()} />
        <PlayerChips which={'Opponent'} stage={stage} player={opponent} />
        {winner ? <WinnerAnnounce text={announceWinner()} /> : ''}
        {community ? <CommunityCards cards={readCards(community)} /> : ''}
        <Pot amount={pot} />
        <PlayerChips which={'Your'} stage={stage} player={yourself} />
        <PlayersCards cards={yourself.folded ? cardBacks() : readCards(yourHand)} />
        <UserMoves />
    </article>
  )
}

export default GameHand;