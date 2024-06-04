import React, { useState, useEffect } from 'react';
import Hand from './Hand';
import Card from './Card';

const Game: React.FC = () => {
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [computer1Cards, setComputer1Cards] = useState<string[]>([]);
  const [computer2Cards, setComputer2Cards] = useState<string[]>([]);
  const [tableCards, setTableCards] = useState<string[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  useEffect(() => {
    dealCards();
  }, []);

  const dealCards = () => {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];
    const deck: string[] = [];

    suits.forEach(suit => {
      values.forEach(value => {
        deck.push(value + suit);
      });
    });

    // 添加双王
    deck.push('Joker Black');
    deck.push('Joker Red');

    deck.sort(() => Math.random() - 0.5);

    setPlayerCards(deck.slice(0, 17)); // 取前17张作为玩家的手牌
    setComputer1Cards(deck.slice(17, 34)); // 取接下来的17张作为电脑1的手牌
    setComputer2Cards(deck.slice(34, 51)); // 取接下来的17张作为电脑2的手牌
    setTableCards(deck.slice(51)); // 剩余的牌作为地主牌
  };

  const toggleCardSelection = (card: string) => {
    setSelectedCards((prevSelectedCards) =>
      prevSelectedCards.includes(card)
        ? prevSelectedCards.filter((c) => c !== card)
        : [...prevSelectedCards, card]
    );
  };

  const playSelectedCards = () => {
    setTableCards(selectedCards);
    setPlayerCards(playerCards.filter(c => !selectedCards.includes(c)));
    setSelectedCards([]);
  };

  const passTurn = () => {
    setSelectedCards([]);
  };

  return (
    <div className="game">
      <div className="header">Dou Di Zhu</div>
      <div className="computer-avatar left">
        <div className="avatar"></div>
        <div>Computer 1</div>
      </div>
      <div className="computer-avatar right">
        <div className="avatar"></div>
        <div>Computer 2</div>
      </div>
      <div className="computer-hand left">
        <Hand cards={computer1Cards} isHidden={true} playerName="" isComputerHand={true} />
      </div>
      <div className="table">
        <div className="card-on-table">
          {tableCards.map((card, index) => (
            <Card key={index} value={card} />
          ))}
        </div>
      </div>
      <div className="computer-hand right">
        <Hand cards={computer2Cards} isHidden={true} playerName="" isComputerHand={true} />
      </div>
      <div className="player-hand">
        <Hand cards={playerCards} playerName="Player" selectedCards={selectedCards} onCardClick={toggleCardSelection} />
      </div>
      <div className="action-buttons">
        <button onClick={playSelectedCards}>出牌</button>
        <button onClick={passTurn}>过</button>
      </div>
    </div>
  );
};

export default Game;
