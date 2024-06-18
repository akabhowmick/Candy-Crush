import React, { useCallback, useEffect, useState } from "react";
import { ScoreBoard } from "./components/Scoreboard";
import { CandyColor } from "./types/interfaces";
import { candies, candyColors, emptyCandy, generateNewCandy } from "./components/HelperFunctions";
import "./App.css";

const App: React.FC = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState<CandyColor[]>([
    emptyCandy,
  ]);
  const [squareBeingDragged, setSquareBeingDragged] = useState<HTMLImageElement | null>(null);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState<HTMLImageElement | null>(null);
  const [scoreDisplay, setScoreDisplay] = useState<number>(0);
  const width = 8;

  const checkForColumnOfFour = useCallback(() => {
    for (let i = 0; i <= width * width - width * 3; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === emptyCandy;

      if (
        columnOfFour.every((square) => currentColorArrangement[square] === decidedColor && !isBlank)
      ) {
        setScoreDisplay((score) => score + 4);
        columnOfFour.forEach((square) => (currentColorArrangement[square] = emptyCandy));
        return true;
      }
    }
  }, [currentColorArrangement]);

  const checkForRowOfFour = useCallback(() => {
    for (let i = 0; i < width * width; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArrangement[i];
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64,
      ];
      const isBlank = currentColorArrangement[i] === emptyCandy;

      if (notValid.includes(i)) continue;

      if (
        rowOfFour.every((square) => currentColorArrangement[square] === decidedColor && !isBlank)
      ) {
        setScoreDisplay((score) => score + 4);
        rowOfFour.forEach((square) => (currentColorArrangement[square] = emptyCandy));
        return true;
      }
    }
  }, [currentColorArrangement]);

  const checkForColumnOfThree = useCallback(() => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decidedColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === emptyCandy;

      if (
        columnOfThree.every(
          (square) => currentColorArrangement[square] === decidedColor && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 3);
        columnOfThree.forEach((square) => (currentColorArrangement[square] = emptyCandy));
        return true;
      }
    }
  }, [currentColorArrangement]);

  const checkForRowOfThree = useCallback(() => {
    for (let i = 0; i < width * width; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decidedColor = currentColorArrangement[i];
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
      const isBlank = currentColorArrangement[i] === emptyCandy;

      if (notValid.includes(i)) continue;

      if (
        rowOfThree.every((square) => currentColorArrangement[square] === decidedColor && !isBlank)
      ) {
        setScoreDisplay((score) => score + 3);
        rowOfThree.forEach((square) => (currentColorArrangement[square] = emptyCandy));
        return true;
      }
    }
  }, [currentColorArrangement]);

  const moveIntoSquareBelow = useCallback(() => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);

      if (isFirstRow && currentColorArrangement[i] === emptyCandy) {
        const randomNumber = Math.floor(Math.random() * candyColors.length);
        currentColorArrangement[i] = candies[randomNumber];
      }

      if (currentColorArrangement[i + width] === emptyCandy) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = emptyCandy;
      }
    }
    setCurrentColorArrangement([...currentColorArrangement]); // Ensure state is updated
  }, [currentColorArrangement]);

  // ! drag creates a copy => not swapping 
  const dragStart = (e: React.DragEvent<HTMLImageElement>) => {
    setSquareBeingDragged(e.target as HTMLImageElement);
  };

  const dragDrop = (e: React.DragEvent<HTMLImageElement>) => {
    setSquareBeingReplaced(e.target as HTMLImageElement);
  };

  const dragEnd = () => {
    const squareBeingDraggedId = parseInt(squareBeingDragged?.getAttribute("data-id") || "0");
    const squareBeingReplacedId = parseInt(squareBeingReplaced?.getAttribute("data-id") || "0");

    currentColorArrangement[squareBeingReplacedId] = {
      ...currentColorArrangement[squareBeingDraggedId],
      imageSrc: currentColorArrangement[squareBeingDraggedId].imageSrc,
    };
    currentColorArrangement[squareBeingDraggedId] = {
      ...currentColorArrangement[squareBeingReplacedId],
      imageSrc: currentColorArrangement[squareBeingReplacedId].imageSrc,
    };

    const validMoves = [
      squareBeingDraggedId - 1, // left 
      squareBeingDraggedId - width, // up 
      squareBeingDraggedId + 1, // right 
      squareBeingDraggedId + width, // down 
    ];

    const validMove = validMoves.includes(squareBeingReplacedId);

    const isAColumnOfFour = checkForColumnOfFour();
    const isARowOfFour = checkForRowOfFour();
    const isAColumnOfThree = checkForColumnOfThree();
    const isARowOfThree = checkForRowOfThree();

    if (
      squareBeingReplacedId &&
      validMove &&
      (isARowOfThree || isARowOfFour || isAColumnOfFour || isAColumnOfThree)
    ) {
      setSquareBeingDragged(null);
      setSquareBeingReplaced(null);
    } else {
      currentColorArrangement[squareBeingReplacedId] = {
        ...currentColorArrangement[squareBeingDraggedId],
        imageSrc: currentColorArrangement[squareBeingDraggedId].imageSrc,
      };
      currentColorArrangement[squareBeingDraggedId] = {
        ...currentColorArrangement[squareBeingReplacedId],
        imageSrc: currentColorArrangement[squareBeingReplacedId].imageSrc,
      };
      setCurrentColorArrangement([...currentColorArrangement]);
    }
  };

  const createBoard = () => {
    // do we allow for things in a row 
    const randomColorArrangement: CandyColor[] = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
      const randomCandy = generateNewCandy(randomColor);
      randomColorArrangement.push(randomCandy);
    }
    setCurrentColorArrangement(randomColorArrangement);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnOfFour();
      checkForRowOfFour();
      checkForColumnOfThree();
      checkForRowOfThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 100);
    return () => clearInterval(timer);
  }, [
    checkForColumnOfFour,
    checkForRowOfFour,
    checkForColumnOfThree,
    checkForRowOfThree,
    moveIntoSquareBelow,
    currentColorArrangement,
  ]);

  return (
    <div className="app">
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => (
          <img
            key={index}
            src={candyColor.imageSrc}
            alt={candyColor.color}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e: React.DragEvent<HTMLImageElement>) => e.preventDefault()}
            onDragEnter={(e: React.DragEvent<HTMLImageElement>) => e.preventDefault()}
            onDragLeave={(e: React.DragEvent<HTMLImageElement>) => e.preventDefault()}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBoard score={scoreDisplay} />
    </div>
  );
};

export default App;
