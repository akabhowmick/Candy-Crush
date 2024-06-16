import React, { useCallback, useEffect, useState } from "react";
import { ScoreBoard } from "./components/Scoreboard";
import { CandyColor } from "./types/interfaces";
import { candyColors, emptyCandy } from "./components/HelperFunctions";

// Interface for Drag Event Target with HTMLImageElement
interface DragEventTarget extends EventTarget {
  src: string;
  alt: string;
  getAttribute(name: string): string | null;
}

const App: React.FC = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState<CandyColor[]>([emptyCandy]);
  const [squareBeingDragged, setSquareBeingDragged] = useState<CandyColor>(emptyCandy);
  const [squareBeingReplaced, setSquareBeingReplaced] = useState<CandyColor>(emptyCandy);
  const [scoreDisplay, setScoreDisplay] = useState<number>(0);
  const width = 8;

  const checkForColumnOfFour = useCallback(() => {
    for (let i = 0; i <= 39; i++) {
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
    for (let i = 0; i < 64; i++) {
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
        currentColorArrangement[i] = candyColors[randomNumber];
      }

      if (currentColorArrangement[i + width] === emptyCandy) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = emptyCandy;
      }
    }
  }, [currentColorArrangement]);

  const dragStart = (e: React.DragEvent<HTMLImageElement>) => {
    setSquareBeingDragged((e.target as DragEventTarget).src);
  };

  const dragDrop = (e: React.DragEvent<HTMLImageElement>) => {
    setSquareBeingReplaced((e.target as DragEventTarget).src);
  };

  const dragEnd = () => {
    const squareBeingDraggedId = parseInt(squareBeingDragged.imageSrc.getAttribute("data-id") || "0");
    const squareBeingReplacedId = parseInt(squareBeingReplaced.imageSrc.getAttribute("data-id") || "0");

    currentColorArrangement[squareBeingReplacedId] = {
      ...currentColorArrangement[squareBeingDraggedId],
      image: currentColorArrangement[squareBeingDraggedId].image,
    };
    currentColorArrangement[squareBeingDraggedId] = {
      ...currentColorArrangement[squareBeingReplacedId],
      image: currentColorArrangement[squareBeingReplacedId].image,
    };

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width,
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
      setSquareBeingDragged(emptyCandy);
      setSquareBeingReplaced(emptyCandy);
    } else {
      currentColorArrangement[squareBeingReplacedId] = {
        ...currentColorArrangement[squareBeingDraggedId],
        image: currentColorArrangement[squareBeingDraggedId].image,
      };
      currentColorArrangement[squareBeingDraggedId] = {
        ...currentColorArrangement[squareBeingReplacedId],
        image: currentColorArrangement[squareBeingReplacedId].image,
      };
      setCurrentColorArrangement([...currentColorArrangement]);
    }
  };

  const createBoard = () => {
    const randomColorArrangement: CandyColor[] = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArrangement.push(randomColor);
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
            src={candyColor.imageSrc} // Changed from image
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
