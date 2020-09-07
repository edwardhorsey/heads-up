import React from "react";
import styles from "./PlayingCard.module.scss";

interface IProps {
  card: string[] | string
}

const PlayingCard: React.FC<IProps> = ({card}) => {
  let source = './assets/CardImages/' + card[0] + card[1][0] + '.svg';
  const alt = card[0] + 'of' + card[1];
  return <img src={source} alt={alt} className={styles.PlayingCard} />;
}
export default PlayingCard;