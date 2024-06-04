import React, { useState, useEffect } from 'react';
import Hand from './Hand';
import Controls from './Controls';
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

  const playCard = (player: string, card: string) => {
    if (player === 'player') {
      setTableCards([card]);
      setPlayerCards(playerCards.filter(c => c !== card));
    }
    // 简单的AI逻辑，选择第一张牌出牌
    else if (player === 'computer1') {
      setTableCards([computer1Cards[0]]);
      setComputer1Cards(computer1Cards.slice(1));
    } else if (player === 'computer2') {
      setTableCards([computer2Cards[0]]);
      setComputer2Cards(computer2Cards.slice(1));
    }
  };

  return (
    <div className="game">
      <h1>Dou Di Zhu</h1>
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
      <Controls playCard={playCard} />
      <button onClick={playSelectedCards}>Play Selected Cards</button>
    </div>
  );
};

export default Game;
