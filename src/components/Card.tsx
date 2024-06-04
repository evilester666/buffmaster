import React from 'react';

interface CardProps {
  value: string;
  isHidden?: boolean;
  isSelected?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ value, isHidden = false, isSelected = false, style, onClick }) => {
  return (
    <div
      className={`card ${isHidden ? 'hidden' : ''} ${isSelected ? 'selected' : ''}`}
      style={style}
      onClick={onClick}
    >
      {isHidden ? '' : <div className="value">{value}</div>}
    </div>
  );
};

export default Card;
