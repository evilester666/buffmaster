import React from 'react';

interface CardProps {
  value: string;
  isHidden?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ value, isHidden = false, isSelected = false, onClick }) => {
  const className = `card ${isHidden ? 'hidden' : ''} ${isSelected ? 'selected' : ''} ${value.includes('Joker') ? 'joker' : ''}`;
  return (
    <div className={className} onClick={onClick}>
      <div className="value">{!isHidden && value}</div>
    </div>
  );
};

export default Card;
