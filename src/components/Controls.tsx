import React from 'react';

interface ControlsProps {
  playCard: (player: string) => void;
}

const Controls: React.FC<ControlsProps> = ({ playCard }) => {
  return (
    <div className="controls">
      <button onClick={() => playCard('player')}>Play</button>
      <button onClick={() => playCard('computer1')}>Computer 1 Play</button>
      <button onClick={() => playCard('computer2')}>Computer 2 Play</button>
    </div>
  );
};

export default Controls;
