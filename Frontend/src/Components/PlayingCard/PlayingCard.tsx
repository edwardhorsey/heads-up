import React from "react";
import styles from "./PlayingCard.module.scss";

interface IProps {
  card: string[] | string,
  winner: boolean
}

const PlayingCard: React.FC<IProps> = ({card, winner}) => {
  const source = './assets/CardImages/' + card[0] + card[1][0] + '.svg';
  const alt = card[0] + 'of' + card[1];
  const style = winner ? `${styles.PlayingCard} ${styles.winner}` : `${styles.PlayingCard}`;
  return <img src={source} alt={alt} className={style} />;
}
export default PlayingCard;