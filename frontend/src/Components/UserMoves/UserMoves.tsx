import React from 'react';
import { useServer } from '../../Context/serverContext';
import { Iplayer } from '../../Interfaces/interfaces';
import {
  allIn, call, fold, backToLobby,
} from '../../Socket/requests';
import styles from './UserMoves.module.scss';
import Button from '../Button';
import Timer from '../Timer';

const UserMoves: React.FC = () => {
  const { gameState, serverState } = useServer();
  const { uid } = serverState;
  const {
    gid, players, whichPlayer, action, stage,
  } = gameState;

  // opponent is opponent
  const opponent: Iplayer = players[whichPlayer === 0 ? 1 : 0];

  const renderButtons = () => {
    if (action === whichPlayer && stage === 'preflop') {
      return (
        <>
          <Timer num={15} logic={() => fold(gid, uid)} />
          <div className="allIn">
            <Button logic={() => allIn(gid, uid)} text="All in" />
          </div>
          <div className="fold">
            <Button logic={() => fold(gid, uid)} text="Fold" />
          </div>
        </>
      );
    } if (action === whichPlayer && stage === 'to-call') {
      return (
        <>
          <Timer num={15} logic={() => fold(gid, uid)} />
          <div className="call">
            <Button
              logic={() => call(gid, uid, opponent['bet-size'])}
              text={`Call ${opponent['bet-size']}`}
            />
          </div>
          <div className="fold">
            <Button logic={() => fold(gid, uid)} text="Fold" />
          </div>
        </>
      );
    } if (['folded', 'showdown', 'winner'].includes(stage)) {
      return '';
    } if (stage === 'end') {
      return (
        <div className="backToLobby">
          <Button logic={() => backToLobby(gid, uid)} text="Back to lobby" />
        </div>
      );
    }

    return false;
  };

  return (
    <article className={styles.UserMoves}>
      {renderButtons()}
    </article>
  );
};

export default UserMoves;
