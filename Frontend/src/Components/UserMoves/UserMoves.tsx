import React, { useContext } from "react";
import { socket, ServerContext } from '../../Context/serverContext';
import styles from "./UserMoves.module.scss";
import Button from "../Button";
import { callbackify } from "util";

interface Iplayer {
}

interface IProps {
}

const UserMoves: React.FC<IProps> = ({}) => {

  const context = useContext(ServerContext);
  console.log('hi from UserMoves', context);
  const { uid, gid, players, whichPlayer, action, stage } = context.cState;

  const yourself = players[whichPlayer]; // yourself is user
  const opponent = players[whichPlayer === 0 ? 1: 0]; // opponent is opponent

  const renderButtons = () => {
    if (action === whichPlayer && stage === "preflop" ) {
      return (
      <>
        <div className={'allIn'}><Button logic={() => allIn()} text={'All in'}/></div>
        <div className={'fold'}><Button logic={() => fold()} text={'Fold'}/></div>
      </>
      )
    } else if (action === whichPlayer && stage === "to-call") {
      return (
        <>
          <div className={'call'}><Button logic={() => call()} text={`Call ${opponent['bet-size']}`}/></div>
          <div className={'fold'}><Button logic={() => fold()} text={'Fold'}/></div>
        </>
        )
    } else if (stage === "showdown" || stage === "folded") {
      return '';
    } else if (stage === "winner") {
      return '';
    } else {
      return (
      <>
        <p>Waiting on opponent...</p>
      </>
      )
    }
  }

  const allIn = () => {
    const request = {
      method: 'all-in',
      uid: uid,
      gid: gid,
    }
    socket.send(JSON.stringify(request));
  }

  const call = () => {
    const request = {
      method: 'call',
      uid: uid,
      gid: gid,
      'amount-to-call': opponent['bet-size']
    }
    socket.send(JSON.stringify(request));
  }

  const fold = () => {
    const request = {
      method: 'fold',
      uid: uid,
      gid: gid,
    }
    socket.send(JSON.stringify(request));
  }

  const nextHand = () => {
    console.log(nextHand);
  }

  return (
    <article className={styles.UserMoves}>
      {renderButtons()}
    </article>
  )
}

export default UserMoves;