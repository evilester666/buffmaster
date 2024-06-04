import React, { useEffect } from 'react';
import Card from './Card'; // 确保正确导入 Card 组件

interface HandProps {
  cards: string[];
  isHidden?: boolean;
  playerName: string;
  isComputerHand?: boolean;
  selectedCards?: string[];
  onCardClick?: (card: string) => void;
}

const Hand: React.FC<HandProps> = ({ cards, isHidden = false, playerName, isComputerHand = false, selectedCards = [], onCardClick }) => {
  // 按照从大到小排序，并确保 Joker 在最前面
  const sortedCards = cards.slice().sort((a, b) => {
    const valueOrder = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2', 'Joker'];
    const suitOrder = ['♣', '♦', '♥', '♠'];
    const getValue = (card: string) => valueOrder.indexOf(card.slice(0, -1));
    const getSuit = (card: string) => suitOrder.indexOf(card.slice(-1));
    if (a.includes('Joker')) return -1; // Joker is the highest value
    if (b.includes('Joker')) return 1;
    return getValue(b) - getValue(a) || getSuit(b) - getSuit(a);
  });

  useEffect(() => {
    const adjustCardLayout = () => {
      const hand = document.querySelector('.hand.player-hand') || document.querySelector('.hand.computer-hand');
      const cards = document.querySelectorAll('.hand.player-hand .card') || document.querySelectorAll('.hand.computer-hand .card');
      if (hand && cards.length > 0) {
        const handWidth = hand.clientWidth;
        const cardWidth = cards[0].clientWidth;
        const totalCardWidth = cardWidth * cards.length;
        if (totalCardWidth > handWidth) {
          const overlap = (totalCardWidth - handWidth) / (cards.length - 1);
          cards.forEach((card: HTMLElement, index: number) => {
            card.style.zIndex = `${index}`;
            card.style.left = `${index * (cardWidth - overlap)}px`;
          });
        } else {
          const startLeft = (handWidth - totalCardWidth) / 2;
          cards.forEach((card: HTMLElement, index: number) => {
            card.style.zIndex = `${index}`;
            card.style.left = `${startLeft + index * cardWidth}px`;
          });
        }
      }
    };

    adjustCardLayout();
    window.addEventListener('resize', adjustCardLayout);

    return () => {
      window.removeEventListener('resize', adjustCardLayout);
    };
  }, [cards.length]);

  return (
    <div className="hand-container">
      <div className={`hand ${isComputerHand ? 'computer-hand' : 'player-hand'}`}>
        {sortedCards.map((card, index) => (
          <Card 
            key={index} 
            value={card} 
            isHidden={isHidden} 
            isSelected={selectedCards.includes(card)}
            onClick={onCardClick ? () => onCardClick(card) : undefined}
          />
        ))}
      </div>
      <div className="player-name">{playerName} ({cards.length})</div>
    </div>
  );
};

export default Hand;
