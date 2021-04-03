import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useServer } from '../../Context/serverContext';
import styles from './WaitingRoom.module.scss';
import Button from '../Button';

const WaitingRoom: React.FC = () => {
  const { gameState, gameDispatch } = useServer();
  const { displayName, gid } = gameState;
  const [clipboard, setClipboard] = useState({ copied: false });

  return (
    <section className={styles.WaitingRoom}>
      <Button logic={() => gameDispatch({ type: 'removeGid' })} text="Back" />
      <p>{displayName}</p>
      <div>
        Game ID:
        {gid}
        <CopyToClipboard
          text={gid}
          onCopy={() => setClipboard({ copied: true })}
        >
          <span>Copy to clipboard</span>
        </CopyToClipboard>
      </div>
      {clipboard.copied ? <span style={{ color: 'red' }}>Copied.</span> : null}
      <p>Waiting for second player...</p>
    </section>
  );
};

export default WaitingRoom;
