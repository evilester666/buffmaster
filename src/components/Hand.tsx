import React from 'react';
import Card from './Card';

interface HandProps {
  cards: string[];
  isHidden?: boolean;
  playerName: string;
  isComputerHand?: boolean;
  selectedCards?: string[];
  onCardClick?: (card: string) => void;
}

const Hand: React.FC<HandProps> = ({ cards, isHidden = false, playerName, isComputerHand = false, selectedCards = [], onCardClick }) => {
  return (
    <div className="hand-container">
      <div className={`hand ${isComputerHand ? 'computer-hand' : 'player-hand'}`}>
        {cards.map((card, index) => (
          <Card 
            key={index} 
            value={card} 
            isHidden={isHidden} 
            isSelected={selectedCards.includes(card)}
            style={isComputerHand ? {} : { zIndex: index, marginLeft: index === 0 ? '0' : '-40px' }} 
            onClick={onCardClick ? () => onCardClick(card) : undefined}
          />
        ))}
      </div>
      <div className="player-name">{playerName} ({cards.length})</div>
    </div>
  );
};

export default Hand;
