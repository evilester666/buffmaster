import React, { useState, useEffect, useRef } from 'react';
import Hand from './Hand';
import Card from './Card';

const Game: React.FC = () => {
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [computer1Cards, setComputer1Cards] = useState<string[]>([]);
  const [computer2Cards, setComputer2Cards] = useState<string[]>([]);
  const [tableCards, setTableCards] = useState<string[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [turn, setTurn] = useState<number>(0); // 0: Player, 1: Computer 1, 2: Computer 2
  const [landlord, setLandlord] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    dealCards();
  }, []);

  useEffect(() => {
    if (gameStarted) {
      startTimer();
      if (turn !== 0) {
        setTimeout(computerPlay, 1000);
      }
    } else {
      clearTimer();
    }
  }, [gameStarted, turn]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleTimeout();
    }
  }, [timeLeft]);

  const startTimer = () => {
    setTimeLeft(60);
    clearTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleTimeout = () => {
    console.log(`Timeout: Player ${turn}`);
    if (turn === 0) {
      passTurn();
    } else {
      computerPlay();
    }
  };

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

    console.log('Dealt cards');
    console.log('Player cards:', deck.slice(0, 17));
    console.log('Computer 1 cards:', deck.slice(17, 34));
    console.log('Computer 2 cards:', deck.slice(34, 51));
    console.log('Table cards:', deck.slice(51));
  };

  const callLandlord = (player: number) => {
    console.log(`Player ${player} called Landlord`);
    setLandlord(player);
    setGameStarted(true);
    if (player === 0) {
      setPlayerCards([...playerCards, ...tableCards]);
    } else if (player === 1) {
      setComputer1Cards([...computer1Cards, ...tableCards]);
    } else {
      setComputer2Cards([...computer2Cards, ...tableCards]);
    }
  };

  const toggleCardSelection = (card: string) => {
    setSelectedCards((prevSelectedCards) =>
      prevSelectedCards.includes(card)
        ? prevSelectedCards.filter((c) => c !== card)
        : [...prevSelectedCards, card]
    );
    console.log('Selected cards:', selectedCards);
  };

  const playSelectedCards = () => {
    if (!isValidPlay(selectedCards)) {
      alert('Invalid play');
      return;
    }

    console.log(`Player ${turn} played cards:`, selectedCards);
    setTableCards(selectedCards);
    if (turn === 0) {
      setPlayerCards(playerCards.filter(c => !selectedCards.includes(c)));
    } else if (turn === 1) {
      setComputer1Cards(computer1Cards.filter(c => !selectedCards.includes(c)));
    } else {
      setComputer2Cards(computer2Cards.filter(c => !selectedCards.includes(c)));
    }

    if (playerCards.length === 0 || computer1Cards.length === 0 || computer2Cards.length === 0) {
      alert(`Player ${turn} wins!`);
      console.log(`Player ${turn} wins!`);
      resetGame();
      return;
    }

    setSelectedCards([]);
    setNextTurn();
  };

  const isValidPlay = (cards: string[]) => {
    if (cards.length === 0) {
      return false;
    }

    const values = cards.map(card => card.slice(0, -1));
    const suits = cards.map(card => card.slice(-1));
    const uniqueValues = [...new Set(values)];
    const uniqueSuits = [...new Set(suits)];

    const countMap = values.reduce((acc, value) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const valueCounts = Object.values(countMap);
    const uniqueValueCounts = [...new Set(valueCounts)];

    // 火箭（双王）
    if (uniqueValues.length === 2 && uniqueValues.includes('Joker') && uniqueValues.includes('Joker Black')) {
      return true;
    }

    // 炸弹（四张相同数值牌）
    if (uniqueValueCounts.length === 1 && uniqueValueCounts[0] === 4) {
      return true;
    }

    // 单牌
    if (cards.length === 1) {
      return true;
    }

    // 对牌
    if (cards.length === 2 && uniqueValueCounts[0] === 2) {
      return true;
    }

    // 三张牌
    if (cards.length === 3 && uniqueValueCounts[0] === 3) {
      return true;
    }

    // 顺子（五张或更多连续单牌）
    if (cards.length >= 5 && uniqueValues.length === cards.length && isSequential(values)) {
      return true;
    }

    // 连对（三对或更多连续对牌）
    if (cards.length >= 6 && cards.length % 2 === 0 && uniqueValueCounts.length === 1 && uniqueValueCounts[0] === 2 && isSequential(uniqueValues)) {
      return true;
    }

    // 飞机（两个及以上点数相邻的三张牌）
    if (cards.length >= 6 && cards.length % 3 === 0 && uniqueValueCounts.length === 1 && uniqueValueCounts[0] === 3 && isSequential(uniqueValues)) {
      return true;
    }

    return false;
  };

  const isSequential = (values: string[]) => {
    const valueOrder = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2'];
    const valueIndices = values.map(value => valueOrder.indexOf(value)).sort((a, b) => a - b);
    for (let i = 1; i < valueIndices.length; i++) {
      if (valueIndices[i] !== valueIndices[i - 1] + 1) {
        return false;
      }
    }
    return true;
  };

  const resetGame = () => {
    dealCards();
    setTableCards([]);
    setSelectedCards([]);
    setTurn(0);
    setLandlord(null);
    setGameStarted(false);
    clearTimer();
    console.log('Game reset');
  };

  const passTurn = () => {
    console.log(`Player ${turn} passed`);
    setSelectedCards([]);
    setNextTurn();
  };

  const setNextTurn = () => {
    const nextTurn = (turn + 1) % 3;
    setTurn(nextTurn);
    console.log(`Next turn: Player ${nextTurn}`);
  };

  const computerPlay = () => {
    console.log(`Computer ${turn} is playing`);
    // 简单的电脑出牌逻辑，可以根据实际需要进行扩展
    let playCards: string[] = [];
    if (turn === 1 && computer1Cards.length > 0) {
      playCards = [computer1Cards[0]];
      setComputer1Cards(computer1Cards.slice(1));
    } else if (turn === 2 && computer2Cards.length > 0) {
      playCards = [computer2Cards[0]];
      setComputer2Cards(computer2Cards.slice(1));
    }

    if (playCards.length === 0) {
      console.log(`Computer ${turn} has no cards to play`);
      passTurn();
      return;
    }

    setTableCards(playCards);
    console.log(`Computer ${turn} played cards:`, playCards);
    if (computer1Cards.length === 0 || computer2Cards.length === 0) {
      alert(`Player ${turn} wins!`);
      console.log(`Player ${turn} wins!`);
      resetGame();
      return;
    }

    setNextTurn();
  };

  return (
    <div className="game">
      <div className="header">Dou Di Zhu</div>
      <div className="timer">Time left: {timeLeft}s</div>
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
        {gameStarted && turn === 0 && <button onClick={playSelectedCards}>出牌</button>}
        {gameStarted && turn === 0 && <button onClick={passTurn}>过</button>}
        {!gameStarted && <button onClick={() => callLandlord(0)}>Call Landlord</button>}
        {!gameStarted && <button onClick={() => callLandlord(1)}>Computer 1 Call Landlord</button>}
        {!gameStarted && <button onClick={() => callLandlord(2)}>Computer 2 Call Landlord</button>}
      </div>
    </div>
  );
};

export default Game;
