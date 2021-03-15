import React, { useContext } from "react";
import { ServerContext } from '../../Context/serverContext';
import { Iplayer } from '../../Context/interfaces';
import { allIn, call, fold, backToLobby } from '../../Socket/requests';
import styles from "./UserMoves.module.scss";
import Button from "../Button";
import Timer from "../Timer";

const UserMoves: React.FC = () => {

  const context = useContext(ServerContext);
  const { serverState } = context;
  const { uid, gid, players, whichPlayer, action, stage } = serverState;

  const opponent: Iplayer = players[whichPlayer === 0 ? 1: 0]; // opponent is opponent

  const renderButtons = () => {
    if (action === whichPlayer && stage === "preflop" ) {
      return (
      <>
        <Timer num={15} logic={() => fold(gid, uid)} />
        <div className={'allIn'}><Button logic={() => allIn(gid, uid)} text={'All in'}/></div>
        <div className={'fold'}><Button logic={() => fold(gid, uid)} text={'Fold'}/></div>
      </>
      )
    } else if (action === whichPlayer && stage === "to-call") {
      return (
        <>
          <Timer num={15} logic={() => fold(gid, uid)} />
          <div className={'call'}><Button logic={() => call(gid, uid, opponent['bet-size'])} text={`Call ${opponent['bet-size']}`}/></div>
          <div className={'fold'}><Button logic={() => fold(gid, uid)} text={'Fold'}/></div>
        </>
        )
    } else if (stage === "showdown" || stage === "folded") {
      return '';
    } else if (stage === "winner") {
      return '';
    } else if (stage === "end") {
      return <div className={'backToLobby'}><Button logic={() => backToLobby(gid, uid)} text={'Back to lobby'}/></div>;
    } else {
      return false;
    }
  }



  return (
    <article className={styles.UserMoves}>
      {renderButtons()}
    </article>
  )
}

export default UserMoves;