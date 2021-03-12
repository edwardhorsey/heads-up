import React, { useContext } from "react";
import { ServerContext } from '../../Context/serverContext';
import { Iplayer } from '../../Context/interfaces';
import socket from "../../Socket/socket";
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
        <Timer num={15} logic={fold} />
        <div className={'allIn'}><Button logic={() => allIn()} text={'All in'}/></div>
        <div className={'fold'}><Button logic={() => fold()} text={'Fold'}/></div>
      </>
      )
    } else if (action === whichPlayer && stage === "to-call") {
      return (
        <>
          <Timer num={15} logic={fold} />
          <div className={'call'}><Button logic={() => call()} text={`Call ${opponent['bet-size']}`}/></div>
          <div className={'fold'}><Button logic={() => fold()} text={'Fold'}/></div>
        </>
        )
    } else if (stage === "showdown" || stage === "folded") {
      return '';
    } else if (stage === "winner") {
      return '';
    } else if (stage === "end") {
      return <div className={'backToLobby'}><Button logic={() => backToLobby()} text={'Back to lobby'}/></div>;
    } else {
      return false;
    }
  }

  const allIn = () => {
    const request = {
      action: 'onGameAction',
      method: 'allIn',
      uid,
      gid,
    }

    socket.send(JSON.stringify(request));
  }

  const call = () => {
    const request = {
      action: 'onGameAction',
      method: 'call',
      uid,
      gid,
      'amount-to-call': opponent['bet-size']
    }

    socket.send(JSON.stringify(request));
  }

  const fold = () => {
    const request = {
      action: 'onGameAction',
      method: 'fold',
      uid,
      gid,
    }

    socket.send(JSON.stringify(request));
  }

  const backToLobby = () => {
    const request = {
      action: 'onGameAction',
      method: 'backToLobby',
      uid,
      gid,
    }

    socket.send(JSON.stringify(request));
    }

  return (
    <article className={styles.UserMoves}>
      {renderButtons()}
    </article>
  )
}

export default UserMoves;